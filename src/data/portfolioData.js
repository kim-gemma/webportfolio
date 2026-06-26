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

  flagshipProject: {
    id: "proj-garden-portfolio",
    name: "Pixel Garden — 코드 정원 포트폴리오",
    tagline:
      "면접관이 이력서를 순서대로 읽는 대신, 직접 탐험하며 경험을 확인할 수 있도록 만든 인터랙티브 포트폴리오입니다.",
    tags: ["React", "TypeScript", "Phaser.js", "Node.js", "WebSocket", "AWS"],
    link: null,
    why: [
      {
        title: "왜 게임형 포트폴리오인가",
        description:
          "텍스트 위주 포트폴리오는 스크롤 몇 번이면 끝나서 기억에 남기 어렵다고 판단했습니다. 방문자가 직접 캐릭터를 움직여 About/Skills/CV/Projects 같은 구역을 찾아가게 만들면, 같은 정보라도 둘러보는 경험 자체가 차별점이 됩니다.",
      },
      {
        title: "왜 Phaser인가",
        description:
          "React만으로 캐릭터 이동, 충돌 판정, 카메라 트윈 같은 게임 루프를 다루면 코드가 금방 복잡해집니다. 캔버스 렌더링과 씬 관리를 전담하는 Phaser를 게임 레이어로 분리하고, React는 모달·HUD 같은 DOM UI에 집중하도록 역할을 나눴습니다.",
      },
      {
        title: "왜 스크롤 대신 인터랙션인가",
        description:
          "세로 스크롤 포트폴리오는 정보 구조가 고정돼 있어 방문자가 순서대로만 읽게 됩니다. 맵 위에서 원하는 zone으로 먼저 이동할 수 있는 자유를 주고 싶어서 클릭/이동 기반 인터랙션을 선택했습니다.",
      },
    ],
    coreFeatures: [
      { icon: "🎮", title: "Pixel World" },
      { icon: "🤖", title: "AI Portfolio Assistant" },
      { icon: "📧", title: "Contact System" },
      { icon: "🌙", title: "Dark Mode" },
      { icon: "📱", title: "Mobile Joystick" },
      { icon: "👥", title: "Online Visitors" },
      { icon: "💬", title: "NPC Conversation" },
      { icon: "🛰", title: "WebSocket" },
      { icon: "☁", title: "AWS Deploy" },
    ],
    implementation: [
      "Phaser 게임 엔진으로 Intro/Loading/Garden Scene 구성",
      "GameContext로 Phaser 인스턴스와 React 상태(활성 zone, 모바일 메뉴, 모달 열림 여부) 연결",
      "Zone 진입에 따라 ZoneModal에서 About/Skills/CV/Projects/Architecture/Contact 콘텐츠 전환",
      "NPC 대화 시스템과 AI Portfolio Assistant 채팅 UI 구현",
      "Mailbox 오브젝트 기반 Contact 시스템 + Discord Webhook 실시간 알림 연동",
      "WebSocket으로 실시간 접속자 수 표시, 연결 상태(연결 중/Online/재연결 중) 처리",
      "localStorage와 OS 다크모드 설정을 함께 보는 테마 토글 구현",
      "VirtualJoystick으로 모바일 캐릭터 이동 처리",
      "768px 기준 데스크톱 가로 메뉴 ↔ 모바일 햄버거 메뉴 반응형 레이아웃",
      "AWS S3+CloudFront(프론트엔드), EC2+Nginx+PM2(서버), RDS(MySQL) 배포 구성",
      "Scene 단위 코드 스플리팅, React.memo·useMemo로 불필요한 리렌더 축소",
    ],
    architecture: [
      { label: "React", role: "UI 셸", description: "TopBar, ZoneModal, Docs/Contact 같은 모달과 전역 레이아웃을 담당합니다." },
      { label: "Game Provider", role: "GameContext", description: "Phaser 인스턴스와 React 상태(활성 zone, 모달 열림 여부)를 양방향으로 연결합니다." },
      { label: "Phaser", role: "게임 엔진", description: "캔버스 렌더링, 캐릭터 이동, 충돌 판정을 전담합니다." },
      { label: "Scene", role: "Intro / Garden", description: "오프닝 시퀀스에서 게임 화면으로 전환되는 씬 단위 구조입니다." },
      { label: "NPC", role: "캐릭터 인터랙션", description: "맵 위 캐릭터에게 다가가면 대화가 시작되는 인터랙션을 처리합니다." },
      { label: "Chat", role: "AI Portfolio Assistant", description: "NPC 대화와 챗 위젯에서 입력한 질문을 AI 응답으로 연결합니다." },
      { label: "API", role: "REST / WebSocket", description: "Contact 제출, AI 응답 요청, 실시간 방문자 수 통신을 처리합니다." },
      { label: "Server", role: "Node.js / Express", description: "AWS EC2 위에서 Nginx·PM2로 운영되는 백엔드입니다." },
      { label: "MySQL", role: "AWS RDS", description: "문의 내역과 방문자 이벤트를 저장합니다." },
    ],
    challenges: [
      {
        title: "React ↔ Phaser 상태 동기화",
        description:
          "Phaser는 자체 게임 루프로 캐릭터/씬을 관리하고 React는 모달과 UI를 선언적으로 관리해서 두 상태가 어긋나기 쉬웠습니다. GameContext에서 Phaser 인스턴스의 메서드(zone 이동, 조이스틱 입력)를 React 콜백으로 감싸 한 방향으로만 상태가 흐르게 정리했습니다.",
      },
      {
        title: "Intro → Garden Scene 전환",
        description:
          "오프닝에서 캐릭터가 몇 걸음 걷고 카메라가 줌인된 뒤 다음 씬으로 넘어가는 연출은 타이밍이 어긋나면 어색해 보여서, 트윈 완료 콜백 기준으로 씬 전환 시점을 맞췄습니다.",
      },
      {
        title: "모바일 가상 조이스틱 UX",
        description:
          "터치 입력은 마우스/키보드와 달리 입력 벡터가 끊기거나 튀는 문제가 있어서, 조이스틱 좌표를 정규화해 Phaser의 캐릭터 이동 벡터로 그대로 전달하는 방식으로 단순화했습니다.",
      },
      {
        title: "WebSocket 재연결 처리",
        description:
          "방문자 수 WebSocket이 끊기면 화면이 멈춘 것처럼 보여서, connecting/connected/disconnected 상태를 따로 두고 재연결 중에는 \"재연결 중...\"이라고 명확히 표시했습니다.",
      },
      {
        title: "다크모드 토글의 포커스 버그",
        description:
          "마우스로 다크모드 버튼을 클릭한 뒤 포커스가 버튼에 남아있으면, 게임 화면에서 Enter를 눌러 다음 동작을 할 때 그 Enter가 버튼 클릭으로도 합성되어 테마가 다시 바뀌는 버그가 있었습니다. 클릭 직후 버튼 포커스를 강제로 비워서 해결했습니다.",
      },
      {
        title: "Discord Webhook 알림 연동",
        description:
          "Contact 폼 제출을 실시간으로 알아야 해서, 서버에서 문의를 저장한 뒤 Discord Webhook으로 바로 알림을 보내도록 연결했습니다.",
      },
      {
        title: "AWS 배포 구성",
        description:
          "프론트엔드(S3+CloudFront), 서버(EC2+Nginx+PM2), 데이터베이스(RDS)를 분리해서 배포하면서, 정적 자산과 API/WebSocket 요청이 서로 다른 도메인·경로로 흩어지는 구성을 정리했습니다.",
      },
    ],
    beforeAfter: [
      { before: "정적인 텍스트 포트폴리오", after: "캐릭터로 맵을 탐험하는 포트폴리오" },
      { before: "단순 Contact Form", after: "제출 즉시 Discord로 알림이 오는 Contact System" },
      { before: "텍스트로 나열한 소개", after: "NPC·AI Portfolio Assistant와의 대화" },
    ],
    buildStory: [
      "Idea",
      "Prototype",
      "Game Engine",
      "NPC",
      "AI Assistant",
      "Contact",
      "Deploy",
      "Mobile Optimization",
      "Release",
    ],
    interviewQuestions: [
      "Q. React와 Phaser 사이의 상태는 어떻게 동기화했나요?",
      "Q. WebSocket 연결이 끊겼을 때 사용자에게는 어떻게 보여주나요?",
      "Q. NPC 대화와 AI Portfolio Assistant는 같은 API를 쓰나요?",
    ],
  },

  architecture: {
    layers: [
      {
        name: "Frontend",
        stack: "React Native · React · Phaser.js",
        description:
          "기업용 모바일 업무 화면, 게임형 포트폴리오 UI, AI/실시간 상태 UI를 구성합니다.",
      },
      {
        name: "Backend",
        stack: "Node.js · Express · REST API · WebSocket",
        description:
          "문의, AI 요청, 실시간 방문자 상태, 알림 연동을 처리하는 서버 레이어입니다.",
      },
      {
        name: "Database",
        stack: "MySQL · AWS RDS",
        description:
          "문의 데이터와 방문자 이벤트처럼 서비스 운영에 필요한 데이터를 저장합니다.",
      },
      {
        name: "Infra",
        stack: "AWS S3 · CloudFront · EC2 · Nginx · PM2",
        description:
          "정적 프론트엔드 배포, 서버 운영, 로그 모니터링, 프로세스 관리를 담당합니다.",
      },
      {
        name: "AI",
        stack: "OpenAI · Gemini · STT · OCR",
        description:
          "AI Portfolio Assistant와 업무 생산성 기능의 응답 생성, 문서/음성 처리 흐름을 연결합니다.",
      },
    ],
    ownership: [
      "React/React Native 화면에서 API, WebSocket, AI 응답 상태를 사용자 경험으로 연결",
      "Node.js 서버와 MySQL 저장소를 구성해 문의와 방문자 데이터를 운영 가능한 형태로 관리",
      "AWS 기반 프론트엔드/서버 배포 구조를 직접 구성하고 로그 모니터링 흐름을 정리",
      "OpenAI·Gemini 기반 AI 기능을 화면 상태, 로딩, 실패 처리와 함께 통합",
    ],
    interviewQuestions: [
      "Q. Frontend와 WebSocket 연결 구조는 어떻게 설계했나요?",
      "Q. AI 응답 상태를 UI에서 어떻게 표현했나요?",
      "Q. AWS에서 프론트엔드와 서버를 분리해 배포한 이유는?",
      "Q. MySQL에는 어떤 데이터를 저장하고 왜 저장했나요?",
    ],
  },

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
