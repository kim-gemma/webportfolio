// ============================================================
// 이력서 / 포트폴리오 PDF 다운로드 유틸
// ============================================================

export const RESUME_FILE = {
  path: "/files/resume.pdf",
  label: "이력서",
};

export const PORTFOLIO_FILE = {
  path: "/files/portfolio.pdf",
  label: "포트폴리오",
};

// 새 탭에서 PDF를 열어, 브라우저 자체 뷰어의 다운로드 버튼으로도 저장할 수 있게 한다
export function openDownloadFile(path) {
  const link = document.createElement("a");
  link.href = path;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}