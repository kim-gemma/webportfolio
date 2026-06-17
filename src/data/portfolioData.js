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
    headline: "웹 퍼블리싱에서 React Native 엔터프라이즈 모바일로 성장한 Frontend Engineer",
    paragraphs: [
      "웹 퍼블리싱 기반 UI 역량에서 시작해 React Native 엔터프라이즈 모바일 개발자로 성장했습니다. 더존비즈온에서 3년 3개월간 기업용 SaaS 모바일 플랫폼을 신규 개발하며 WebView-Native Bridge 고도화와 Android/iOS 플랫폼 이슈 대응을 도맡았습니다.",
      "AI Chat UI와 STT(음성-텍스트 변환), WebSocket 기반 실시간 인터페이스를 직접 설계하고 구현했습니다. Context API, Redux, Zustand 등 상황에 맞는 상태 관리 전략을 선택해 복잡한 데이터 흐름을 안정적으로 풀어내는 것을 중요하게 생각합니다.",
      "최근에는 Spring Boot, MySQL, Docker, AWS 기반의 백엔드/클라우드 구조를 직접 학습하며 서비스 전체 아키텍처를 이해하는 풀스택 시야를 넓히고 있습니다.",
    ],
  },

  skills: [
    {
      id: "react-native",
      name: "React Native",
      category: "Mobile",
      level: 5,
      description:
        "엔터프라이즈 앱을 3년 이상 운영하며 재사용성과 확장성을 고려한 계층적 컴포넌트 구조화, UI와 상태 변경 로직 분리로 유지보수성을 높였습니다.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Language",
      level: 4,
      description:
        "React Native 기반 엔터프라이즈 앱 개발 전반에 적용해 타입 안정성을 확보하고 협업 시 인터페이스 오류를 줄였습니다.",
    },
    {
      id: "webview-bridge",
      name: "WebView-Native Bridge",
      category: "Mobile",
      level: 5,
      description:
        "메시지 프로토콜을 정의해 WebView와 Native 모듈 간 안정적인 양방향 통신을 구현하고, Android/iOS 플랫폼별 이슈를 해결했습니다.",
    },
    {
      id: "state-api",
      name: "상태 관리 (Context·Redux·Zustand)",
      category: "Architecture",
      level: 4,
      description:
        "Context API, Redux, Zustand를 상황에 맞게 활용해 전역/지역 상태를 분리하고, REST/WebSocket 기반 실시간 데이터 통신을 설계했습니다.",
    },
    {
      id: "ai-integration",
      name: "AI Integration",
      category: "Feature",
      level: 4,
      description:
        "AI Chat UI 설계와 STT 연동, 실시간 스트리밍 응답 처리를 구현했습니다. STT 상태를 Custom Hook으로 분리해 UI 충돌을 제거했습니다.",
    },
    {
      id: "backend-cloud",
      name: "Backend & Cloud (학습 중)",
      category: "Backend",
      level: 2,
      description:
        "Spring Boot 기반 REST API, MySQL 데이터베이스 설계, Docker 컨테이너 환경 구축과 AWS 배포까지 서비스 전체 구조를 이해하기 위해 학습하고 있습니다.",
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
      id: "proj-garden-portfolio",
      name: "코드 정원 포트폴리오",
      description:
        "이 포트폴리오 자체입니다. React와 Phaser.js를 결합해 캐릭터가 맵을 탐험하며 정보를 발견하는 게임형 인터랙션으로 구현했습니다.",
      tags: ["React", "Phaser.js", "Pixel Art"],
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
        label: "Notion Portfolio",
        url: "https://app.notion.com/p/Home-37a1b4452a5380b19bfde40e5c19b7db",
      },
    ],
  },
};
