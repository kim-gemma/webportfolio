import { PORTFOLIO_DATA } from "../data/portfolioData";

export default function IntroScreen({ onStart }) {
  const data = PORTFOLIO_DATA;
  const keywords = [
    "React Native",
    "Enterprise Collaboration",
    "AI Productivity",
    "Real-time Communication",
    "WebSocket",
  ];

  return (
    <div className="intro-screen">
      <div className="intro-card">
        <div className="intro-badge">CAREER EXHIBITION</div>
        <p className="intro-name">{data.profile.name}</p>
        <h1 className="intro-title">Enterprise SaaS & AI Product Engineer</h1>
        <p className="intro-role">Frontend Engineer · 3+ Years Experience</p>
        <p className="intro-tagline">
          더존비즈온에서 3년 3개월간 기업용 협업 SaaS 모바일 서비스를 개발했습니다.
          ONE AI, 문서 협업, 메신저, 화상회의, WebSocket 기반 실시간 경험을 React Native 중심으로 구현했습니다.
        </p>
        <div className="intro-keywords" aria-label="핵심 기술 키워드">
          {keywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
        <div className="intro-proof-grid" aria-label="핵심 경력 요약">
          <strong>3년 3개월</strong>
          <span>더존비즈온 Enterprise SaaS</span>
          <strong>ONE AI</strong>
          <span>AI 회의록 · OCR · STT · Streaming UI</span>
          <strong>Collaboration</strong>
          <span>문서 협업 · 메신저 · 화상회의</span>
        </div>
        <button className="btn-primary intro-start" onClick={onStart}>
          경력 전시관 입장하기
        </button>
        <p className="intro-skip">
          맵 탐험 없이 핵심 프로젝트부터 보고 싶다면{" "}
          <a
            href="#about-fallback"
            onClick={(e) => {
              e.preventDefault();
              onStart();
            }}
          >
            요약 보기
          </a>
        </p>
        <div className="intro-controls">
          <span>WASD / 방향키로 이동</span>
          <span>Quick Navigation으로 프로젝트 구역에 바로 이동</span>
        </div>
      </div>
      <div className="intro-grid-bg" aria-hidden="true" />
    </div>
  );
}
