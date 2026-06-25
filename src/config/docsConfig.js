// ============================================================
// Docs 메뉴에서 다운로드할 수 있는 문서 목록
// 새 문서를 추가하려면 이 배열에 항목을 더하기만 하면 된다 (DocsModal이 map으로 렌더링)
// ============================================================
import { RESUME_FILE, PORTFOLIO_FILE, CAREER_FILE } from "../utils/fileDownload";

export const DOCS = [
  {
    id: "resume",
    icon: "📄",
    title: "Resume PDF",
    description: "이력서 PDF 다운로드",
    file: RESUME_FILE,
    buttonLabel: "Download Resume",
    ariaLabel: "이력서 PDF 다운로드 또는 새 탭에서 열기",
  },
  {
    id: "portfolio",
    icon: "📚",
    title: "Portfolio PDF",
    description: "포트폴리오 PDF 다운로드",
    file: PORTFOLIO_FILE,
    buttonLabel: "Download Portfolio",
    ariaLabel: "포트폴리오 PDF 다운로드 또는 새 탭에서 열기",
  },
  {
    id: "career",
    icon: "💼",
    title: "Career Description PDF",
    description: "경력기술서 PDF 다운로드",
    file: CAREER_FILE,
    buttonLabel: "Download Career Description",
    ariaLabel: "경력기술서 PDF 다운로드 또는 새 탭에서 열기",
  },
];
