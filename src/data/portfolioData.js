// ============================================================
// 포트폴리오 콘텐츠 데이터 (예시/임시 콘텐츠)
// 실제 정보가 준비되면 이 파일의 값만 교체하면 됩니다.
// ============================================================

export const PORTFOLIO_DATA = {
  profile: {
    name: "김현ㅇㅇ능",
    role: "프론트엔드 개발자",
    tagline: "사용자 경험과 성능, 둘 다 놓치지 않는 코드를 씁니다",
    location: "서울, 대한민국",
    yearsExperience: "3년 8개월",
    email: "ayuhyun@naver.com",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
  },

  about: {
    headline: "디자인과 코드를 잇는 사람",
    paragraphs: [
      "5년차 프론트엔드 개발자로, React와 TypeScript를 중심으로 사용자 인터페이스를 만들어왔습니다. 디자이너의 의도를 정확히 코드로 옮기는 것과, 그 위에서 실제로 매끄럽게 동작하는 인터랙션을 구현하는 것 모두에 신경 씁니다.",
      "복잡한 상태 관리가 필요한 대규모 SPA부터, 디테일한 모션이 들어간 랜딩 페이지까지 다양한 스케일의 프로젝트를 경험했습니다. 성능 최적화와 접근성을 기본값으로 두고 작업하는 것을 좋아합니다.",
      "최근에는 디자인 시스템 구축과 프론트엔드 아키텍처 설계에 관심을 두고, 팀 전체의 개발 속도를 끌어올리는 일에도 시간을 쓰고 있습니다.",
    ],
  },

  skills: [
    {
      id: "react",
      name: "React",
      category: "Frontend",
      level: 5,
      description:
        "5년간 실무에서 사용한 핵심 프레임워크입니다. 훅 기반 아키텍처, 성능 최적화(메모이제이션, 코드 스플리팅), 커스텀 훅 설계에 익숙합니다.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Language",
      level: 5,
      description:
        "타입 안정성을 통해 런타임 오류를 줄이고 협업 생산성을 높이는 데 적극적으로 활용합니다. 제네릭, 유틸리티 타입을 활용한 타입 설계를 즐깁니다.",
    },
    {
      id: "nextjs",
      name: "Next.js",
      category: "Framework",
      level: 4,
      description:
        "SSR/SSG를 활용한 SEO 최적화 프로젝트와 App Router 기반 풀스택 애플리케이션 개발 경험이 있습니다.",
    },
    {
      id: "javascript",
      name: "JavaScript",
      category: "Language",
      level: 5,
      description:
        "ES6+ 문법과 비동기 처리, 이벤트 루프에 대한 깊은 이해를 바탕으로 견고한 코드를 작성합니다.",
    },
    {
      id: "css",
      name: "CSS / Tailwind",
      category: "Styling",
      level: 5,
      description:
        "반응형 레이아웃, 애니메이션, 디자인 시스템 구축에 강점이 있습니다. Tailwind와 CSS-in-JS 둘 다 상황에 맞게 사용합니다.",
    },
    {
      id: "nodejs",
      name: "Node.js",
      category: "Backend",
      level: 3,
      description:
        "프론트엔드 개발에 필요한 백엔드 API와 BFF(Backend for Frontend) 레이어를 직접 구성할 수 있습니다.",
    },
  ],

  experience: [
    {
      id: "exp1",
      year: "2023 - 현재",
      company: "테크노바 (가상 회사명)",
      role: "프론트엔드 개발자",
      summary:
        "사내 SaaS 대시보드 제품의 프론트엔드 리드를 맡아 디자인 시스템 구축과 성능 개선을 주도했습니다.",
      highlights: [
        "디자인 시스템 도입으로 신규 화면 개발 속도 40% 개선",
        "코드 스플리팅 및 이미지 최적화로 초기 로딩 시간 35% 단축",
        "신규 입사자 온보딩 문서 및 컨벤션 가이드 작성",
      ],
    },
    {
      id: "exp2",
      year: "2021 - 2023",
      company: "핀브릿지 (가상 회사명)",
      role: "프론트엔드 개발자",
      summary:
        "핀테크 서비스의 결제 및 자산관리 화면을 개발하며 복잡한 상태 관리와 데이터 시각화를 다뤘습니다.",
      highlights: [
        "실시간 시세 차트 컴포넌트 자체 개발",
        "결제 플로우 A/B 테스트로 전환율 12% 개선",
        "E2E 테스트(Playwright) 도입으로 배포 안정성 강화",
      ],
    },
    {
      id: "exp3",
      year: "2019 - 2021",
      company: "스튜디오라인 (가상 회사명)",
      role: "주니어 웹 개발자",
      summary:
        "에이전시에서 다양한 클라이언트의 랜딩 페이지와 마케팅 사이트를 제작했습니다.",
      highlights: [
        "월 평균 3-4건의 반응형 웹사이트 퍼블리싱 및 개발",
        "GSAP 기반 스크롤 인터랙션 다수 구현",
        "Lighthouse 성능 점수 90+ 유지 기준 수립",
      ],
    },
  ],

  projects: [
    {
      id: "proj1",
      name: "코드 정원 포트폴리오",
      description:
        "이 포트폴리오 자체입니다. React와 Phaser.js를 결합해 캐릭터가 맵을 탐험하며 정보를 발견하는 게임형 인터랙션으로 구현했습니다.",
      tags: ["React", "Phaser.js", "Pixel Art"],
      link: null,
    },
    {
      id: "proj2",
      name: "오픈소스 차트 라이브러리 (가상 프로젝트)",
      description:
        "가벼운 React 차트 컴포넌트 라이브러리를 직접 설계하고 배포했습니다. 번들 크기를 최소화하면서도 커스터마이징이 자유로운 API를 목표로 했습니다.",
      tags: ["TypeScript", "Rollup", "Storybook"],
      link: null,
    },
    {
      id: "proj3",
      name: "실시간 협업 보드 (가상 프로젝트)",
      description:
        "WebSocket 기반 실시간 동기화 기능을 가진 칸반 보드 클론을 만들며 CRDT와 충돌 해결 로직을 학습했습니다.",
      tags: ["Next.js", "WebSocket", "Yjs"],
      link: null,
    },
  ],

  contact: {
    message: "함께 일하고 싶으시거나 궁금한 점이 있으시면 편하게 연락 주세요.",
    email: "minjun.dev@example.com",
    links: [
      { label: "GitHub", url: "https://github.com/example" },
      { label: "LinkedIn", url: "https://linkedin.com/in/example" },
    ],
  },
};
