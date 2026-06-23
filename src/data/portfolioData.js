// ============================================================
// 포트폴리오 콘텐츠 데이터
// ============================================================

export const PORTFOLIO_DATA = {
  profile: {
    name: "김현능",
    role: "React Native Enterprise Mobile Frontend Engineer",
    tagline:
      "웹 퍼블리싱에서 시작해 React Native 엔터프라이즈 모바일 개발자로 성장했습니다. AI 기능 연동, WebView-Native Bridge, 기업용 SaaS 보안 요구사항까지 고려한 서비스를 만듭니다.",
    location: "서울, 대한민국",
    yearsExperience: "3년 8개월",
    email: "ayuhyun@naver.com",
    github: "https://github.com/kim-gemma",
    notion:
      "https://app.notion.com/p/Home-37a1b4452a5380b19bfde40e5c19b7db",
  },

  about: {
    headline: "웹 퍼블리싱에서 시작해 React · React Native 기반 엔터프라이즈 서비스와 AI 기능을 개발하는 Frontend Engineer",
    paragraphs: [
      "웹 퍼블리싱 기반 UI 역량에서 시작해 React Native 엔터프라이즈 모바일 개발자로 성장했습니다. 더존비즈온에서 3년 3개월간 기업용 SaaS 모바일 플랫폼을 신규 개발하며 WebView-Native Bridge 고도화와 Android/iOS 플랫폼 이슈 대응을 도맡았습니다.",
      "AI Chat UI와 STT(음성-텍스트 변환), WebSocket 기반 실시간 인터페이스를 직접 설계하고 구현했습니다. Context API, Redux, Zustand 등 상황에 맞는 상태 관리 전략을 선택해 복잡한 데이터 흐름을 안정적으로 풀어내는 것을 중요하게 생각합니다.",
      "최근에는 Spring Boot, MySQL, Docker, AWS 기반의 백엔드/클라우드 구조를 직접 학습하며 서비스 전체 아키텍처를 이해하는 풀스택 시야를 넓히고 있습니다.",
      "이 포트폴리오 자체도 하나의 실험 공간으로 운영하고 있습니다. Storybook으로 공통 UI 컴포넌트를 문서화하고 Design Token 기반 디자인 시스템을 구축해 다크 모드와 반응형 UI를 일관되게 관리했고, OpenAI·Gemini 기반 AI Portfolio Assistant와 WebSocket 기반 실시간 방문자 표시 기능을 직접 구현했습니다. 방문자 문의는 Discord Webhook으로 알림을 받도록 연동해, 운영까지 고려한 서비스 흐름을 경험해보고 있습니다.",
    ],
  },

  skills: [
    {
      id: "react",
      name: "React",
      category: "Frontend",
      level: 5,
      description:
        "React 기반 컴포넌트 설계와 상태 관리 경험을 보유하고 있으며, 재사용 가능한 UI 컴포넌트 구조와 유지보수성을 고려한 화면 개발을 수행했습니다. useState, useEffect, Custom Hook을 활용하여 비즈니스 로직과 UI를 분리했습니다.",
    },
    {
      id: "javascript",
      name: "JavaScript",
      category: "Language",
      level: 5,
      description:
        "ES6+ 문법을 기반으로 비동기 처리(Promise, async/await), 이벤트 처리, DOM 조작 및 데이터 가공 로직을 구현했습니다. 클로저, 스코프, 이벤트 루프 등 JavaScript 핵심 개념을 이해하고 있습니다.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Language",
      level: 4,
      description:
        "정적 타입 시스템을 활용하여 런타임 오류를 줄이고 대규모 프로젝트의 유지보수성과 협업 효율을 높였습니다.",
    },
    {
      id: "react-native",
      name: "React Native",
      category: "Mobile",
      level: 5,
      description:
        "3년 이상 엔터프라이즈 모바일 앱을 개발하며 플랫폼 특성을 고려한 UI 구현 및 성능 최적화를 경험했습니다.",
    },
    {
      id: "state-api",
      name: "상태 관리 (Context·Redux·Zustand)",
      category: "Architecture",
      level: 4,
      description:
        "Context API, Redux, Zustand를 프로젝트 규모에 맞게 활용하여 전역 상태와 지역 상태를 효율적으로 관리했습니다.",
    },
    {
      id: "rest-websocket",
      name: "REST API & WebSocket",
      category: "Communication",
      level: 4,
      description:
        "REST API 기반 CRUD 기능 개발과 WebSocket을 활용한 실시간 데이터 통신 기능을 구현했습니다. 프론트엔드와 백엔드 간 데이터 흐름을 설계하고 관리했습니다.",
    },
    {
      id: "webview-bridge",
      name: "WebView-Native Bridge",
      category: "Mobile",
      level: 5,
      description:
        "WebView와 Native 모듈 간 양방향 통신을 구현하여 Android/iOS 플랫폼별 이슈를 해결했습니다.",
    },
    {
      id: "ai-integration",
      name: "AI Integration",
      category: "Feature",
      level: 4,
      description:
        "AI Chat UI, STT, OCR, 스트리밍 응답 처리 등 생성형 AI 기반 기능을 프론트엔드에 통합했습니다.",
    },
    {
      id: "backend-cloud",
      name: "Backend & Cloud",
      category: "Backend",
      level: 3,
      description:
        "Spring Boot, MySQL, Docker, AWS 환경을 학습하며 프론트엔드 개발자가 이해해야 할 서버 구조와 배포 과정을 경험했습니다.",
    },
    {
      id: "storybook",
      name: "Storybook",
      category: "Design System",
      level: 4,
      description:
        "공통 UI 컴포넌트를 Storybook으로 독립된 환경에서 개발하고 문서화했습니다. 컴포넌트별로 Primary/Disabled/Loading 같은 상태를 스토리로 분리해, 실제 화면에 붙이기 전에 props와 시각적 변화를 먼저 검증할 수 있는 워크플로를 구성했습니다.",
    },
    {
      id: "design-system",
      name: "Design System",
      category: "Architecture",
      level: 4,
      description:
        "색상·여백·타이포그래피·반경 값을 Design Token으로 분리해 컴포넌트가 하드코딩된 값 대신 토큰을 참조하도록 설계했습니다. 같은 토큰 체계를 다크/라이트 모드 전환과 반응형 레이아웃에도 적용해, 화면이 늘어나도 값이 흩어지지 않도록 관리했습니다.",
    },
    {
      id: "performance",
      name: "Web Performance",
      category: "Optimization",
      level: 4,
      description:
        "Lighthouse로 성능 지표를 점검하고 React DevTools Profiler로 컴포넌트 렌더링 횟수와 원인을 분석했습니다. rollup-plugin-visualizer로 번들 구성을 시각화해 큰 청크를 파악한 뒤, 동적 import 기반 코드 스플리팅으로 초기 로딩에 필요한 번들을 줄였습니다. 렌더링 단에서는 React.memo·useMemo·useCallback으로 불필요한 재계산과 재렌더링을 줄이고, 화면에 보이지 않는 리소스는 Lazy Loading으로 지연 로드했습니다.",
    },
  ],

  experience: [
    {
      id: "exp-fullstack-training",
      year: "2025.10 - 2026.04",
      company: "Java Full-Stack / Cloud & Backend",
      role: "Full-Stack Development Training (6개월)",
      summary:
        "Spring Boot, MySQL, Docker, AWS 기반 서버/클라우드 구조를 학습하며 백엔드 API와 서비스 아키텍처에 대한 이해를 넓혔습니다.",
      highlights: [
        "Spring Boot 기반 REST API 개발 및 서버 구조 이해",
        "MySQL 데이터베이스 설계 및 데이터 흐름 학습",
        "Docker 기반 컨테이너 환경 구축 및 AWS 배포 경험",
      ],
    },
    {
      id: "exp-duzon",
      year: "2022.07 - 2025.09",
      company: "더존비즈온",
      role: "React Native Engineer · Frontend Engineer (3년 3개월)",
      summary:
        "기업용 SaaS 모바일 플랫폼을 신규 개발하며 WebView-Native Bridge 고도화, Native 모듈 연동, AI Chat UI·STT·WebSocket 실시간 인터페이스 개발을 담당했습니다.",
      highlights: [
        "기업용 SaaS 모바일 플랫폼 신규 개발",
        "WebView-Native Bridge 고도화 및 Native 모듈 연동",
        "Android/iOS 플랫폼 이슈 해결 및 대응",
        "AI Chat UI, STT, WebSocket 실시간 인터페이스 개발",
      ],
    },
    {
      id: "exp-future-tech",
      year: "2021.07 - 2021.11",
      company: "미래기술",
      role: "Web Publisher (5개월)",
      summary:
        "반응형 웹 페이지 개발과 크로스 브라우징 대응, 웹 표준·접근성을 고려한 시멘틱 마크업으로 실무 웹 개발 경험을 쌓았습니다.",
      highlights: [
        "반응형 웹 페이지 개발 및 크로스 브라우징 대응",
        "웹 표준 및 접근성을 고려한 시멘틱 마크업",
        "디자인 시안을 실제 서비스 화면으로 구현",
      ],
    },
    {
      id: "exp-frontend-edu",
      year: "2020.09 - 2021.03",
      company: "웹 퍼블리싱 및 UI/UX 교육",
      role: "Frontend Developer 교육생",
      summary:
        "HTML5, CSS3, JavaScript 기반 UI 구현과 반응형 웹 개발을 학습하며 프론트엔드 개발의 기초 역량을 다졌습니다.",
      highlights: [
        "웹 표준 및 웹 접근성 심화 학습",
        "사용자 중심 UI/UX 설계 및 포트폴리오 제작",
      ],
    },
  ],

  projects: [
    {
      id: "proj-one-ai-mobile",
      name: "ONE AI Mobile — AI Chat UI & STT Integration",
      description:
        "AI 기반 문서 분석 및 음성 인터페이스 엔터프라이즈 모바일 서비스. WebSocket 실시간 통신으로 응답 지연을 개선하고, STT 상태를 독립 Custom Hook으로 분리해 음성 입력 중 UI 충돌을 제거했습니다.",
      tags: ["React Native", "WebSocket", "OpenAI", "Gemini"],
      link: null,
    },
    {
      id: "proj-onechamber",
      name: "Mobile OneChamber — 대용량 문서 관리",
      description:
        "100MB+ 대용량 파일 업로드를 다루는 엔터프라이즈 문서 관리 모바일 서비스. 청크 단위 전송과 자동 재연결 로직으로 업로드 안정성을 확보하고, Context+Reducer로 API/UI 상태를 분리했습니다.",
      tags: ["React Native", "TypeScript", "Context API", "REST API"],
      link: null,
    },
    {
      id: "proj-oneffice",
      name: "ONEFFICE Mobile — CSAP 보안 대응",
      description:
        "더존비즈온 기업용 협업·문서 관리 모바일 서비스. WebView-Native Bridge 메시지 프로토콜을 정의하고, JWT 인증 및 RBAC 권한 제어로 CSAP 보안 요구사항에 대응했습니다.",
      tags: ["React Native", "WebView", "JWT", "RBAC"],
      link: null,
    },
    {
      id: "proj-amaranth-chat",
      name: "Amaranth10 Messenger & Video Conference",
      description:
        "기업용 메신저 및 화상회의 모바일 서비스 개발. 조직도 기반 참여자 초대, 채팅방 관리, 화상회의 입장 프로세스, AI 회의록 연동 기능을 구현했으며 공통 댓글 및 커뮤니케이션 기능을 모바일 환경에 최적화했습니다.",
      tags: [
        "React Native",
        "React",
        "REST API",
        "WebRTC",
        "Enterprise Collaboration"
      ],
      link: null,
    },
    {
      id: "proj-whatflix",
      name: "WhatFlix",
      description:
        "React + Spring Boot 풀스택 개인 프로젝트. Custom Hook으로 외부 API 연동을 추상화하고, IntersectionObserver 기반 무한 스크롤과 React.memo 렌더링 최적화, Kakao OAuth 인증을 구현했습니다.",
      tags: ["React", "Context API", "Spring Boot", "Kakao OAuth"],
      link: null,
    },
    {
      id: "proj-web-builder",
      name: "Web Builder Template Frontend",
      description:
        "템플릿 플랫폼의 UI와 공통 컴포넌트를 개발했습니다. 컴포넌트 아키텍처를 모듈화하고 CSS Grid/Flexbox로 반응형 설계를 적용해 신규 템플릿 개발 생산성을 높였습니다.",
      tags: ["React", "TypeScript", "HTML/CSS"],
      link: null,
    },
    {
      id: "proj-doggyforest",
      name: "강아지숲 반응형 웹 전환",
      description:
        "PC 중심 화면을 Mobile-first 레이아웃으로 전환했습니다. 재사용 가능한 컴포넌트 구조와 시맨틱 마크업·ARIA 적용으로 모바일 사용성과 접근성을 함께 개선했습니다.",
      tags: ["React", "TypeScript", "Responsive Web"],
      link: null,
    },
    {
      id: "proj-design-system",
      name: "Design System & Storybook",
      description:
        "포트폴리오 전반에서 사용하는 공통 UI 컴포넌트와 Design Token 시스템을 구축한 프로젝트입니다. Storybook을 통해 버튼, 모달, 카드, 다크 모드 UI 등 주요 컴포넌트를 문서화하고 상태별 UI를 독립적으로 검증할 수 있도록 구성했습니다.",
      tags: ["React", "TypeScript", "Storybook", "Design System"],
      link: null,
    },
    {
      id: "proj-garden-portfolio",
      name: "코드 정원 포트폴리오",
      description:
        "React, Phaser.js, TypeScript 기반 게임형 인터랙티브 포트폴리오입니다. 캐릭터가 맵을 탐험하며 정보를 발견하는 인터랙션 위에, Storybook 기반 컴포넌트 문서화와 Design Token 디자인 시스템, OpenAI/Gemini 기반 AI Portfolio Assistant, WebSocket 실시간 방문자 기능, Discord Webhook 알림까지 더해 하나의 서비스에 가깝게 구성했습니다.",
      tags: ["React", "TypeScript", "Phaser.js", "Storybook", "WebSocket", "AI"],
      achievements: [
        "Storybook 기반 UI 컴포넌트 문서화",
        "Design Token 기반 디자인 시스템 구축",
        "OpenAI·Gemini 기반 AI Portfolio Assistant 구현",
        "WebSocket 실시간 방문자 기능 구현",
        "Discord Webhook 실시간 알림 연동",
        "다크 모드 및 반응형 UI 지원",
        "Lighthouse·React DevTools Profiler·rollup-plugin-visualizer 기반 성능 분석 및 코드 스플리팅 적용",
      ],
      link: null,
    },
  ],

  contact: {
    message: "함께 일하고 싶으시거나 궁금한 점이 있으시면 편하게 연락 주세요.",
    email: "ayuhyun@naver.com",
    phone: "010-3907-4180",
    links: [
      { label: "GitHub", url: "https://github.com/kim-gemma" },
      {
        label: "Notion",
        url: "https://app.notion.com/p/Home-37a1b4452a5380b19bfde40e5c19b7db",
      },
    ],
  },
};
