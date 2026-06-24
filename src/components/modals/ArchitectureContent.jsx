import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function ArchitectureContent() {
  const { architecture } = PORTFOLIO_DATA;

  return (
    <div className="modal-body">
      <div className="modal-eyebrow">🏗 Architecture</div>
      <h2 className="modal-title">Pixel Garden Architecture</h2>
      <p className="modal-meta">
        React Native 경험에서 확장한 Frontend · Backend · Database · Infra · AI 연결 구조
      </p>

      <div className="architecture-flow" aria-label="서비스 아키텍처 흐름">
        {architecture.layers.map((layer, index) => (
          <div key={layer.name} className="architecture-step">
            <div className="architecture-node">
              <span className="architecture-node-label">{layer.name}</span>
              <strong>{layer.stack}</strong>
              <p>{layer.description}</p>
            </div>
            {index < architecture.layers.length - 1 && (
              <div className="architecture-arrow" aria-hidden="true">↓</div>
            )}
          </div>
        ))}
      </div>

      <section className="project-detail-section">
        <h3>내가 직접 연결한 지점</h3>
        <ul className="project-detail-list">
          {architecture.ownership.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="project-detail-section interview-section">
        <h3>Interview Questions</h3>
        <ul className="interview-list">
          {architecture.interviewQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
