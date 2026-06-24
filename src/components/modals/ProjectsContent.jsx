import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function ProjectsContent() {
  const { projects } = PORTFOLIO_DATA;
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="modal-body">
      <div className="modal-eyebrow">🖼 Projects</div>
      <h2 className="modal-title">Enterprise SaaS Project Gallery</h2>
      <p className="modal-meta">
        3년 3개월간의 기업용 협업 SaaS 경험을 ONE AI, 문서 협업, 메신저/화상회의, 포트폴리오 아키텍처 중심으로 정리했습니다.
      </p>

      <div className="projects-grid project-detail-grid">
        {featuredProjects.map((p) => (
          <article key={p.id} className="project-card project-detail-card">
            <h3 className="project-name">{p.name}</h3>
            <p className="project-desc">{p.description}</p>
            <div className="project-tags">
              {p.tags.map((t) => (
                <span key={t} className="project-tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="project-detail-sections">
              <section className="project-detail-section">
                <h4>소개</h4>
                <p>{p.overview}</p>
              </section>
              <section className="project-detail-section">
                <h4>문제</h4>
                <p>{p.problem}</p>
              </section>
              <section className="project-detail-section">
                <h4>해결</h4>
                <p>{p.solution}</p>
              </section>
              <section className="project-detail-section">
                <h4>결과</h4>
                <p>{p.outcome}</p>
              </section>
              <section className="project-detail-section">
                <h4>사용 기술</h4>
                <div className="project-tags project-tags-compact">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="project-tag">{tech}</span>
                  ))}
                </div>
              </section>
              <section className="project-detail-section">
                <h4>내가 담당한 기능</h4>
                <ul className="project-detail-list">
                  {p.ownership.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            {p.architectureNote && (
              <div className="architecture-inline">
                <strong>Architecture 보기</strong>
                <span>{p.architectureNote}</span>
              </div>
            )}

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
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                바로가기 →
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
