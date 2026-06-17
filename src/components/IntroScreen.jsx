import { PORTFOLIO_DATA } from "../data/portfolioData";

export default function IntroScreen({ onStart }) {
  const data = PORTFOLIO_DATA;
  return (
    <div className="intro-screen">
      <div className="intro-card">
        <div className="intro-badge">PIXEL PORTFOLIO</div>
        <h1 className="intro-title">{data.profile.name}</h1>
        <p className="intro-role">{data.profile.role}</p>
        <p className="intro-tagline">{data.profile.tagline}</p>
        <button className="btn-primary intro-start" onClick={onStart}>
          ▶ 정원 탐험 시작하기
        </button>
        <p className="intro-skip">
          탐험 없이 바로 보고 싶다면{" "}
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
          <span>구역에 다가가면 정보가 열립니다</span>
        </div>
      </div>
      <div className="intro-grid-bg" aria-hidden="true" />
    </div>
  );
}
