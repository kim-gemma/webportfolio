import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function ProjectsContent() {
  const { projects } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">🖼 Projects</div>
      <h2 className="modal-title">프로젝트</h2>
      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <h3 className="project-name">{p.name}</h3>
            <p className="project-desc">{p.description}</p>
            <div className="project-tags">
              {p.tags.map((t) => (
                <span key={t} className="project-tag">
                  {t}
                </span>
              ))}
            </div>
            {p.achievements?.length > 0 && (
              <ul className="project-achievements">
                {p.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                바로가기 →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
