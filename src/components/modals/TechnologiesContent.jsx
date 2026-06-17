import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function TechnologiesContent() {
  const { skills } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">📚 Technologies</div>
      <h2 className="modal-title">기술 스택</h2>
      <div className="skills-grid">
        {skills.map((s) => (
          <div key={s.id} className="skill-card">
            <div className="skill-card-head">
              <span className="skill-name">{s.name}</span>
              <span className="skill-category">{s.category}</span>
            </div>
            <div className="skill-level" aria-label={`레벨 ${s.level}/5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`skill-pip ${i < s.level ? "on" : ""}`}
                />
              ))}
            </div>
            <p className="skill-desc">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
