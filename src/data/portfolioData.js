// ============================================================
// 포트폴리오 콘텐츠 데이터
// ============================================================

export const PORTFOLIO_DATA = {
  profile: {
    name: "김현능",
    role: "Enterprise Collaboration & AI Productivity Frontend Engineer",
    tagline:
      "기업용 협업 플랫폼과 AI 생산성 서비스를 개발하는 프론트엔드 엔지니어입니다. 전자결재, 문서관리, 메신저, 화상회의, AI 회의록·OCR·STT 등 업무 흐름을 모바일에서도 끊김 없이 사용할 수 있도록 만듭니다.",
    location: "서울, 대한민국",
    yearsExperience: "3년 8개월",
    email: "ayuhyun@naver.com",
    github: "https://github.com/kim-gemma",
    notion:
      "https://app.notion.com/p/Home-37a1b4452a5380b19bfde40e5c19b7db",
  },

  about: {
    headline: "기업용 협업 플랫폼과 AI 생산성 서비스를 개발하는 Frontend Engineer",
    paragraphs: [
      "더존비즈온에서 3년 3개월간 기업용 협업 플랫폼의 모바일 서비스를 개발했습니다. 전자결재, 문서관리, 메신저, 화상회의, 조직도 기반 커뮤니케이션처럼 기업 사용자가 매일 사용하는 업무 기능을 모바일 환경에서도 안정적으로 처리할 수 있도록 구현했습니다.",
      "AI 회의록, OCR, STT, AI Chat UI 등 업무 생산성을 높이는 기능을 서비스 흐름 안에 통합했습니다. 단순히 AI API를 연결하는 데서 그치지 않고, 사용자가 회의 내용을 빠르게 정리하고 문서를 더 쉽게 탐색하며 음성 입력으로 업무를 이어갈 수 있는 경험을 만드는 데 집중했습니다.",
      "엔터프라이즈 SaaS 환경에서 권한 관리, 인증, 보안 요구사항, Android/iOS 플랫폼 차이, WebView-Native Bridge 같은 복잡한 제약을 다뤘습니다. Context API, Redux, Zustand 등 상태 관리 도구는 기술 자체보다 전자결재·문서·메신저·AI 응답처럼 서로 다른 업무 흐름을 안정적으로 연결하기 위한 수단으로 활용했습니다.",
      "최근에는 Spring Boot, MySQL, Docker, AWS 기반의 백엔드/클라우드 구조를 학습하며 프론트엔드 너머의 서비스 아키텍처 이해를 넓히고 있습니다. 이 포트폴리오에도 AI Portfolio Assistant, 실시간 방문자 표시, Discord 알림, 디자인 시스템을 직접 구성해 운영까지 고려한 서비스 흐름을 실험하고 있습니다.",
    ],
  },

  skills: [
    {
      id: "enterprise-collaboration",
      name: "Enterprise Collaboration",
      category: "Domain",
      level: 5,
      description:
        "전자결재, 메신저, 화상회의, 조직도 기반 커뮤니케이션 등 기업 구성원이 매일 사용하는 협업 기능을 모바일 업무 흐름에 맞게 개발했습니다.",
    },
    {
      id: "document-management",
      name: "Document Management",
      category: "Domain",
      level: 5,
      description:
        "기업 문서의 등록, 업로드, 조회, 권한 기반 접근 흐름을 다뤘으며, 대용량 문서를 모바일에서도 안정적으로 처리할 수 있도록 사용자 경험을 개선했습니다.",
    },
    {
      id: "ai-productivity",
      name: "AI Productivity",
      category: "Domain",
      level: 4,
      description:
        "AI 회의록, OCR, STT, AI Chat UI를 업무 서비스에 통합해 회의 정리, 문서 분석, 음성 입력 같은 반복 업무를 더 빠르게 처리할 수 있도록 구현했습니다.",
    },
    {
      id: "enterprise-saas",
      name: "Enterprise SaaS",
      category: "Domain",
      level: 4,
      description:
        "기업 환경의 인증, 권한 관리, 보안 요구사항, 플랫폼별 제약을 고려해 실제 업무 시스템에 필요한 안정성과 일관성을 갖춘 화면을 개발했습니다.",
    },
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
        "3년 이상 기업용 협업 플랫폼 모바일 서비스를 개발하며 전자결재, 문서관리, 메신저, 화상회의 등 PC 중심 업무 기능을 모바일 경험으로 확장했습니다.",
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
        "문서·협업·AI 응답 흐름에 필요한 API 연동과 실시간 통신을 구현했습니다. 사용자가 더 빠르게 업무를 처리할 수 있도록 AI 응답, 상태 변경, 데이터 흐름을 안정적으로 연결했습니다.",
    },
    {
      id: "webview-bridge",
      name: "WebView-Native Bridge",
      category: "Mobile",
      level: 5,
      description:
        "기업 사용자가 모바일 환경에서도 PC와 유사한 업무 경험을 할 수 있도록 WebView와 Native 모듈 간 양방향 통신을 구현하고 Android/iOS 플랫폼별 이슈를 해결했습니다.",
    },
    {
      id: "ai-integration",
      name: "AI Integration",
      category: "Feature",
      level: 4,
      description:
        "AI Chat UI, STT, OCR, 스트리밍 응답 처리를 업무 서비스에 통합해 회의록 작성, 문서 분석, 음성 입력 등 사용자의 반복 업무를 줄이는 기능을 개발했습니다.",
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
        "기업용 협업 플랫폼 모바일 서비스를 개발하며 전자결재, 문서관리, 메신저, 화상회의, 조직도 기반 협업, AI 생산성 기능을 모바일 업무 경험으로 연결했습니다.",
      highlights: [
        "전자결재, 문서관리, 메신저, 화상회의 등 기업용 협업 플랫폼 모바일 서비스 개발",
        "조직도 기반 사용자 탐색, 참여자 초대, 커뮤니케이션 흐름 등 협업 기능 구현",
        "AI 회의록, OCR, STT, AI Chat UI 등 업무 생산성 기능 개발",
        "기업 환경의 인증, 권한 관리, 보안 요구사항에 맞춘 모바일 서비스 대응",
        "WebView-Native Bridge와 Native 모듈 연동으로 PC 업무 기능을 모바일 경험으로 확장",
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
      name: "ONE AI Mobile — AI 업무 생산성 서비스",
      description:
        "기업 사용자가 문서 분석, 음성 입력, AI 응답을 모바일에서 빠르게 활용할 수 있도록 만든 AI 생산성 서비스입니다. 실시간 AI 응답 환경과 안정적인 STT 상태 관리를 통해 회의·문서 업무 중 발생하는 대기 시간과 입력 불편을 줄였습니다.",
      tags: ["AI Productivity", "React Native", "STT", "Real-time AI"],
      link: null,
    },
    {
      id: "proj-onechamber",
      name: "Mobile OneChamber — 기업 문서관리 모바일 서비스",
      description:
        "기업 사용자가 대용량 문서를 모바일에서도 안정적으로 등록·관리할 수 있도록 지원한 문서관리 서비스입니다. 100MB 이상 파일 업로드 과정의 실패 가능성을 줄이고, 문서 처리 상태를 명확히 분리해 업무 중단 없이 문서 업무를 이어갈 수 있게 했습니다.",
      tags: ["Document Management", "Enterprise SaaS", "React Native", "REST API"],
      link: null,
    },
    {
      id: "proj-oneffice",
      name: "ONEFFICE Mobile — 모바일 업무 환경 확장",
      description:
        "기업 사용자가 모바일 환경에서도 PC와 동일한 문서·협업 업무를 수행할 수 있도록 지원한 모바일 서비스입니다. WebView-Native Bridge, 인증, 권한 제어를 통해 기존 업무 시스템을 모바일로 확장하면서 기업 보안 요구사항에 대응했습니다.",
      tags: ["Mobile Enterprise Platform", "WebView", "RBAC", "Enterprise Security"],
      link: null,
    },
    {
      id: "proj-amaranth-chat",
      name: "Amaranth10 Messenger & Video Conference",
      description:
        "조직도 기반 협업이 필요한 기업 사용자를 위해 메신저와 화상회의 모바일 경험을 개발했습니다. 조직도 기반 참여자 초대, 채팅방 관리, 회의 입장 흐름, AI 회의록 연동을 통해 커뮤니케이션과 회의 기록이 하나의 업무 흐름 안에서 이어지도록 구성했습니다.",
      tags: [
        "Enterprise Collaboration",
        "Business Productivity",
        "Video Conference",
        "AI Meeting Notes",
        "React Native",
      ],
      link: null,
    },
    {
      id: "proj-whatflix",
      name: "WhatFlix",
      description:
        "사용자가 콘텐츠를 더 쉽게 탐색하고 개인화된 추천 흐름을 경험할 수 있도록 만든 React + Spring Boot 풀스택 프로젝트입니다. 외부 API 연동, 무한 스크롤, Kakao OAuth 인증을 통해 실제 서비스형 탐색 경험을 구성했습니다.",
      tags: ["React", "Context API", "Spring Boot", "Kakao OAuth"],
      link: null,
    },
    {
      id: "proj-web-builder",
      name: "Web Builder Template Frontend",
      description:
        "템플릿 제작자가 반복 UI를 더 빠르게 구성할 수 있도록 공통 컴포넌트와 반응형 레이아웃을 정리한 프로젝트입니다. 모듈화된 컴포넌트 구조로 신규 템플릿 제작 시간을 줄이고 유지보수성을 높였습니다.",
      tags: ["React", "TypeScript", "HTML/CSS"],
      link: null,
    },
    {
      id: "proj-doggyforest",
      name: "강아지숲 반응형 웹 전환",
      description:
        "PC 중심으로 제공되던 웹 경험을 모바일 사용자도 자연스럽게 이용할 수 있도록 Mobile-first 구조로 전환했습니다. 재사용 가능한 컴포넌트와 시맨틱 마크업·ARIA 적용으로 사용성과 접근성을 함께 개선했습니다.",
      tags: ["React", "TypeScript", "Responsive Web"],
      link: null,
    },
    {
      id: "proj-design-system",
      name: "Design System & Storybook",
      description:
        "화면이 늘어날수록 UI 품질이 흔들리지 않도록 공통 컴포넌트와 Design Token을 정리한 프로젝트입니다. Storybook으로 상태별 UI를 문서화해 반복 개발 과정에서도 일관된 사용자 경험을 유지할 수 있게 했습니다.",
      tags: ["React", "TypeScript", "Storybook", "Design System"],
      link: null,
    },
    {
      id: "proj-garden-portfolio",
      name: "코드 정원 포트폴리오",
      description:
        "면접관이 이력서를 순서대로 읽는 대신 직접 탐색하며 경험을 확인할 수 있도록 만든 인터랙티브 포트폴리오입니다. AI Portfolio Assistant, 실시간 방문자 표시, 문의 알림, 디자인 시스템을 연결해 단순 소개 페이지가 아니라 운영 가능한 작은 서비스처럼 구성했습니다.",
      tags: ["React", "TypeScript", "Phaser.js", "AI Productivity", "WebSocket" ,],
      achievements: [
        "Storybook 기반 UI 컴포넌트 문서화",
        "AWS S3 + CloudFront 기반 프론트엔드 배포",
        "AWS EC2 + Nginx + PM2 기반 서버 운영",
        "AWS RDS 기반 문의 및 방문자 데이터 저장",
        "AWS CloudWatch 기반 로그 모니터링 환경 구축",
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
