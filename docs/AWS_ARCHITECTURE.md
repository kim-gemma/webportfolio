# Pixel Garden Portfolio AWS 운영 아키텍처

이 문서는 React + Phaser 기반 Pixel Garden Portfolio를 AWS에서 운영 가능한 서비스 형태로 배포하기 위한 기준 문서입니다.

## 목표

Phaser 기반 게임형 포트폴리오 플랫폼을 개발하고 AWS(S3, CloudFront, EC2, RDS, CloudWatch) 환경에 배포하여 실시간 방문자 모니터링, Discord 알림, AI Portfolio Assistant 기능을 운영 가능한 서비스 형태로 구축한다.

## 전체 아키텍처

```mermaid
flowchart LR
  User[Browser] --> CF[CloudFront CDN / HTTPS]
  CF --> S3[S3 Static Website Bucket]
  User --> API[Nginx Reverse Proxy / HTTPS]
  API --> EC2[EC2 Node.js Express + PM2]
  EC2 --> RDS[(RDS MySQL)]
  EC2 --> Discord[Discord Webhook]
  EC2 --> Gemini[Gemini API]
  EC2 --> CW[CloudWatch Logs / Metrics]
  RDS --> CW
```

## 구성 요소

- Frontend: React, TypeScript, Vite, Phaser
- Static hosting: S3
- CDN/HTTPS: CloudFront + ACM 인증서
- Backend: EC2, Node.js, Express, PM2
- Reverse proxy: Nginx
- Database: RDS MySQL
- Realtime: WebSocket `/ws/visitors`
- Notification: Discord Webhook
- Monitoring: CloudWatch Agent, EC2 metrics, RDS metrics, PM2/Nginx logs

## 디렉터리 구조

```text
.
├── src/
│   ├── components/admin/AdminDashboard.tsx
│   ├── hooks/useOnlineVisitors.ts
│   └── ...
├── server/
│   ├── src/
│   │   ├── controllers/adminController.ts
│   │   ├── db/schema.sql
│   │   ├── db/visitorRepository.ts
│   │   ├── middleware/adminAuth.ts
│   │   ├── realtime/visitorSocket.ts
│   │   └── routes/adminRoutes.ts
│   └── .env.example
├── deploy/aws/
│   ├── ecosystem.config.cjs
│   └── nginx-pixel-garden.conf
└── docs/AWS_ARCHITECTURE.md
```

## Frontend 배포

1. S3 버킷 생성

```bash
aws s3 mb s3://pixel-garden-portfolio
aws s3 website s3://pixel-garden-portfolio --index-document index.html --error-document index.html
```

2. 환경변수 설정

```bash
VITE_API_BASE_URL=https://api.your-domain.com
```

3. 빌드 및 업로드

```bash
npm ci
npm run build
aws s3 sync dist/ s3://pixel-garden-portfolio --delete
```

4. CloudFront 구성

- Origin: S3 버킷
- Viewer protocol policy: Redirect HTTP to HTTPS
- Default root object: `index.html`
- SPA fallback: 403/404 응답을 `/index.html`로 매핑
- ACM 인증서: `us-east-1` 리전에서 발급

5. 캐시 정책

- `index.html`: 짧은 TTL 또는 배포 후 invalidation
- JS/CSS/assets: 파일명 해시 기반이므로 긴 TTL

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/index.html"
```

## Backend 배포

1. EC2 준비

- Ubuntu LTS
- Security Group inbound: 22, 80, 443
- Node.js 20+, Nginx, PM2 설치

```bash
sudo apt update
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

2. 서버 코드 배치

```bash
sudo mkdir -p /var/www/pixel-garden
sudo chown -R ubuntu:ubuntu /var/www/pixel-garden
git clone YOUR_REPOSITORY_URL /var/www/pixel-garden
cd /var/www/pixel-garden/server
npm ci
npm run build
```

3. 환경변수 설정

```bash
cp .env.example .env
vi .env
```

필수 값:

```text
PORT=4000
DATABASE_URL=mysql://portfolio_admin:password@portfolio-db.xxxxxx.ap-northeast-2.rds.amazonaws.com:3306/webportfolio
ALLOWED_ORIGINS=https://www.your-domain.com
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
GEMINI_API_KEY=...
ADMIN_API_TOKEN=long-random-admin-token
```

4. DB 마이그레이션

```bash
npm run migrate
```

5. PM2 실행

```bash
sudo mkdir -p /var/log/pixel-garden
sudo chown -R ubuntu:ubuntu /var/log/pixel-garden
pm2 start /var/www/pixel-garden/deploy/aws/ecosystem.config.cjs
pm2 save
pm2 startup
```

6. Nginx Reverse Proxy

```bash
sudo cp /var/www/pixel-garden/deploy/aws/nginx-pixel-garden.conf /etc/nginx/sites-available/pixel-garden
sudo ln -s /etc/nginx/sites-available/pixel-garden /etc/nginx/sites-enabled/pixel-garden
sudo nginx -t
sudo systemctl reload nginx
```

7. HTTPS 적용

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

## Database

RDS MySQL에는 다음 데이터를 저장한다.

- `contact_messages`: Contact Form 문의 내역
- `visitor_sessions`: 방문 세션, IP, User-Agent, 접속/종료/마지막 확인 시간
- `visitor_events`: connect, disconnect, heartbeat 이벤트 로그와 당시 온라인 수

Security Group 구성:

- RDS inbound 3306은 EC2 Security Group에서만 허용
- 퍼블릭 접근은 비활성화 권장

## 실시간 방문자 모니터링

브라우저는 `/ws/visitors`로 WebSocket을 연결한다.

- 연결 시 `visitor_sessions`에 세션 저장
- 연결/종료/heartbeat 시 `visitor_events`에 로그 저장
- 서버는 `visitor_stats` 메시지를 브로드캐스트

```json
{
  "type": "visitor_stats",
  "onlineCount": 3,
  "totalVisits": 120,
  "todayVisits": 8
}
```

## Discord Notification

Contact Form 제출 시 다음 흐름으로 처리한다.

1. `/api/contact` 요청 수신
2. 유효성 검사
3. `contact_messages`에 저장
4. Discord Webhook 전송

알림에는 Name, Email, Message, CreatedAt이 포함된다. Discord 장애가 발생해도 DB 저장은 성공 처리한다.

## 관리자 기능

관리자 화면:

```text
https://www.your-domain.com/admin
```

관리자 API:

```text
GET /api/admin/dashboard
Header: x-admin-token: ADMIN_API_TOKEN
```

조회 가능 데이터:

- 문의 내역
- 현재 접속자 수
- 누적 방문자 수
- 오늘 방문자 수
- 최근 접속 세션
- 최근 접속 이벤트 로그

## CloudWatch 운영

EC2에 CloudWatch Agent를 설치해 다음 로그를 수집한다.

- `/var/log/pixel-garden/api-out.log`
- `/var/log/pixel-garden/api-error.log`
- `/var/log/nginx/pixel-garden-access.log`
- `/var/log/nginx/pixel-garden-error.log`

권장 알람:

- EC2 CPUUtilization 80% 이상
- EC2 StatusCheckFailed
- RDS CPUUtilization 80% 이상
- RDS FreeStorageSpace 임계치 이하
- RDS DatabaseConnections 급증
- Nginx 5xx 증가

장애 확인 순서:

```bash
pm2 status
pm2 logs pixel-garden-api --lines 100
sudo tail -n 100 /var/log/nginx/pixel-garden-error.log
sudo systemctl status nginx
```

RDS 연결 장애 시 확인:

```bash
mysql -h portfolio-db.xxxxxx.ap-northeast-2.rds.amazonaws.com -u portfolio_admin -p webportfolio
```

## 이력서 설명 문구

Phaser 기반 게임형 포트폴리오 플랫폼을 개발하고 AWS(S3, CloudFront, EC2, RDS, CloudWatch) 환경에 배포하여 실시간 방문자 모니터링, Discord 알림, AI Portfolio Assistant 기능을 운영 가능한 서비스 형태로 구축했습니다.
