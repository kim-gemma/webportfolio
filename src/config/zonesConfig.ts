// ============================================================
// 게임 내 영역(Zone) 메타데이터
// 각 영역의 제목, 아이콘, 설명 등을 한 곳에서 관리합니다
// ============================================================

export type ZoneKey = "about" | "technologies" | "cv" | "projects" | "contact";

export interface ZoneMeta {
  key: ZoneKey;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export const ZONE_META: Record<ZoneKey, ZoneMeta> = {
  about: {
    key: "about",
    title: "About Me",
    icon: "🙂",
    description: "소개",
    color: "#b5563a",
  },
  technologies: {
    key: "technologies",
    title: "Technologies",
    icon: "📚",
    description: "기술 스택",
    color: "#7ec8c9",
  },
  cv: {
    key: "cv",
    title: "CV",
    icon: "📜",
    description: "경력",
    color: "#f4d35e",
  },
  projects: {
    key: "projects",
    title: "Projects",
    icon: "🖼",
    description: "프로젝트",
    color: "#e98ca0",
  },
  contact: {
    key: "contact",
    title: "Contact",
    icon: "🤙",
    description: "연락",
    color: "#4a78a0",
  },
};

export const ZONES: ZoneKey[] = ["about", "technologies", "cv", "projects", "contact"];
