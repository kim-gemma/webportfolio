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
* JavaScript
* Phaser.js
* CSS3

### Deployment

* Vercel

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

## 향후 개선 계획

* 다크 모드 / 라이트 모드 전환
* NPC 및 상호작용 추가
* 배경 애니메이션 강화
* 실시간 채팅 기능(WebSocket)
* 방문자 방명록 기능
* 프로젝트 상세 페이지 추가

## 제작자

김현능

React Native · Frontend Engineer

GitHub
https://github.com/kim-gemma

Portfolio
https://webportfolio-ten-theta.vercel.app/
