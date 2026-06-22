# 🌿 코드 정원 포트폴리오

배포 주소
https://webportfolio-ten-theta.vercel.app/

GitHub 저장소
https://github.com/kim-gemma

## 프로젝트 소개

코드 정원 포트폴리오는 React와 Phaser.js를 활용하여 제작한 게임형 인터랙티브 포트폴리오입니다.

일반적인 웹 포트폴리오에서 벗어나 사용자가 캐릭터를 직접 조작하며 정원 맵을 탐험하고, About / Skills / Experience / Projects / Contact 구역을 발견하는 방식으로 구성했습니다.

포트폴리오를 단순히 읽는 것이 아니라 직접 경험할 수 있도록 설계했으며, 게임적인 요소를 통해 사용자의 몰입감을 높이는 데 집중했습니다.

## 주요 기능

### 🎮 게임형 인터랙션

* Phaser.js 기반 픽셀아트 맵 구현
* 캐릭터 이동 및 충돌 처리
* 구역 탐색 기반 정보 확인
* PC 및 모바일 환경 지원

### 📱 반응형 지원

* 데스크톱 키보드 조작 지원
* 모바일 가상 조이스틱 지원
* 다양한 화면 크기 대응

### 📋 포트폴리오 정보 제공

* About
* Skills
* Experience
* Projects
* Contact

각 영역을 모달 형태로 제공하여 사용자 경험을 개선했습니다.

### 🎨 커스텀 맵 시스템

* Phaser Graphics API 활용
* 외부 이미지 없이 맵 및 오브젝트 직접 생성
* 구역별 테마 및 컬러 시스템 적용

## 기술 스택

### Frontend

* React
* JavaScript / TypeScript (Contact Form)
* Phaser.js
* CSS3

### Backend (Contact 서버, `server/`)

* Node.js / Express
* MySQL (mysql2)

### Deployment

* Frontend → Vercel
* Backend → Render

## 프로젝트 구조

```bash
src/
├── components/
│   ├── TopBar.jsx
│   ├── ZoneModal.jsx
│   ├── ZoneHint.jsx
│   ├── VirtualJoystick.jsx
│   └── DownloadButton.jsx
│
├── game/
│   ├── introScene.js
│   └── gardenScene.js
│
├── context/
│   └── GameContext.jsx
│
├── config/
│   └── zonesConfig.js
│
├── data/
│   └── portfolioData.js
│
└── utils/
```

## 조작 방법

### PC

* WASD 이동
* 방향키 이동
* Enter : 정보 열기
* ESC : 모달 닫기

### Mobile

* 가상 조이스틱 이동
* 구역 진입 시 힌트 표시
* 탭하여 상세 정보 확인

## 구현 포인트

* React와 Phaser.js 라이프사이클 연동
* Context API 기반 게임 상태 관리
* Zone 기반 충돌 감지 시스템
* 모달 및 UI 컴포넌트 분리
* 모바일 조이스틱 인터페이스 구현
* 재사용 가능한 포트폴리오 데이터 구조 설계

## 📮 Contact Form

방문자가 우측 하단 `📮 Contact` 버튼을 누르면 이름/이메일(선택)/메시지를 남길 수 있는 문의 폼이 열립니다. 입력 내용은 백엔드 API를 통해 MySQL `contact_messages` 테이블에 저장됩니다.

### 구성

* `src/chat/` — Contact Form 위젯 (TypeScript)
* `server/` — Express + MySQL 백엔드 (별도 배포 단위, TypeScript)

### 로컬 실행

```bash
# 1) 백엔드
cd server
cp .env.example .env   # DATABASE_URL 또는 MYSQL_HOST/USER/PASSWORD/DATABASE 채우기
npm install
npm run migrate         # contact_messages 테이블 생성
npm run dev              # https://webportfolio-cv10.onrender.com

# 2) 프론트엔드 (별도 터미널, 저장소 루트에서)
cp .env.example .env     # VITE_API_BASE_URL=https://webportfolio-cv10.onrender.com
npm install
npm run dev               # http://localhost:5173
```

* 방문자: `http://localhost:5173` 에서 📮 Contact 버튼 클릭 후 폼 작성
* 문의가 저장되면 `DISCORD_WEBHOOK_URL`로 지정한 Discord 채널에 알림이 전송됩니다 (설정하지 않으면 알림 없이 저장만 됩니다).

### 배포 전 사용자가 직접 준비해야 하는 것

1. **MySQL**: 사용할 MySQL 인스턴스를 준비하고 `DATABASE_URL`(또는 `MYSQL_HOST`/`MYSQL_USER`/`MYSQL_PASSWORD`/`MYSQL_DATABASE`)을 발급받습니다.
2. **Discord Webhook**: 알림을 받을 Discord 채널 설정 → 연동 → 웹후크 → 새 웹후크 생성 → URL 복사 → `DISCORD_WEBHOOK_URL`에 설정합니다. `.env.example`은 git에 커밋되는 템플릿 파일이므로 실제 URL을 적지 말고 빈 값으로 두고, 실제 값은 gitignore된 로컬 `.env`와 배포 플랫폼의 환경변수 설정에만 입력하세요.

### 배포

* **백엔드 → Render**: 새 Web Service 생성 시 Root Directory를 `server`로 지정(`server/render.yaml` 참고). Build: `npm install && npm run build`, Start: `npm start`. 위 환경변수들을 Render 대시보드에 등록.
* **프론트엔드 → Vercel**: 기존과 동일하게 배포하되, 프로젝트 환경변수에 `VITE_API_BASE_URL`(Render 백엔드 URL)을 추가.
* Render 무료 플랜은 일정 시간 미사용 시 슬립 상태가 되어, 슬립 후 첫 요청에 몇 초 지연이 발생할 수 있습니다.

## 향후 개선 계획

* 다크 모드 / 라이트 모드 전환
* NPC 및 상호작용 추가
* 배경 애니메이션 강화
* 프로젝트 상세 페이지 추가

## 제작자

김현능

Frontend Engineer

GitHub
https://github.com/kim-gemma

Portfolio
https://webportfolio-ten-theta.vercel.app/
