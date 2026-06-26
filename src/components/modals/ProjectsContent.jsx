import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function ProjectsContent() {
  const { flagshipProject: p } = PORTFOLIO_DATA;

  return (
    <div className="modal-body">
      <div className="modal-eyebrow">🖼 Projects</div>
      <h2 className="modal-title">{p.name}</h2>
      <p className="modal-meta">{p.tagline}</p>
      <div className="project-tags">
        {p.tags.map((tag) => (
          <span key={tag} className="project-tag">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="project-section-title">왜 Pixel Garden을 만들었나</h3>
      <div className="project-detail-sections">
        {p.why.map((reason) => (
          <section key={reason.title} className="project-detail-section">
            <h4>{reason.title}</h4>
            <p>{reason.description}</p>
          </section>
        ))}
      </div>

      <h3 className="project-section-title">핵심 기능</h3>
      <div className="project-detail-sections">
        {p.coreFeatures.map((feature) => (
          <section key={feature.title} className="project-detail-section">
            <h4>
              {feature.icon} {feature.title}
            </h4>
          </section>
        ))}
      </div>

      <h3 className="project-section-title">구현 과정</h3>
      <ul className="project-detail-list">
        {p.implementation.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3 className="project-section-title">React ↔ Phaser 연결 구조</h3>
      <p className="modal-meta">
        전체 서비스 아키텍처(Frontend/Backend/Database/Infra/AI)는 Architecture Zone에서 볼 수 있습니다. 여기서는 그 중 React와
        Phaser가 어떻게 연결되는지를 보여줍니다.
      </p>
      <div className="architecture-flow" aria-label="React와 Phaser 연결 흐름">
        {p.architecture.map((step, index) => (
          <div key={step.label} className="architecture-step">
            <div className="architecture-node">
              <span className="architecture-node-label">{step.label}</span>
              <strong>{step.role}</strong>
              <p>{step.description}</p>
            </div>
            {index < p.architecture.length - 1 && (
              <div className="architecture-arrow" aria-hidden="true">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="project-section-title">개발하면서 어려웠던 점</h3>
      <div className="project-detail-sections">
        {p.challenges.map((challenge) => (
          <section key={challenge.title} className="project-detail-section">
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
          </section>
        ))}
      </div>

      <h3 className="project-section-title">Before / After</h3>
      <div className="before-after-list">
        {p.beforeAfter.map((pair) => (
          <div key={pair.before} className="before-after-pair">
            <div className="before-after-card before">{pair.before}</div>
            <div className="before-after-arrow" aria-hidden="true">
              →
            </div>
            <div className="before-after-card after">{pair.after}</div>
          </div>
        ))}
      </div>

      <h3 className="project-section-title">Build Story</h3>
      <div className="architecture-flow" aria-label="Pixel Garden 개발 타임라인">
        {p.buildStory.map((step, index) => (
          <div key={step} className="architecture-step">
            <div className="architecture-node">
              <strong>{step}</strong>
            </div>
            {index < p.buildStory.length - 1 && (
              <div className="architecture-arrow" aria-hidden="true">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {p.interviewQuestions?.length > 0 && (
        <section className="project-detail-section interview-section">
          <h4>Interview Questions</h4>
          <ul className="interview-list">
            {p.interviewQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </section>
      )}

      {p.link && (
        <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
          바로가기 →
        </a>
      )}
    </div>
  );
}
