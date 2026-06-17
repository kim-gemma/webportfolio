import { useEffect } from "react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

export default function ZoneModal({ zoneKey, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        {zoneKey === "about" && <AboutContent />}
        {zoneKey === "skills" && <SkillsContent />}
        {zoneKey === "experience" && <ExperienceContent />}
        {zoneKey === "projects" && <ProjectsContent />}
        {zoneKey === "contact" && <ContactContent />}
      </div>
    </div>
  );
}

function AboutContent() {
  const { about, profile } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">🏠 About Me</div>
      <h2 className="modal-title">{about.headline}</h2>
      <p className="modal-meta">
        {profile.location} · {profile.yearsExperience}년차 {profile.role}
      </p>
      {about.paragraphs.map((p, i) => (
        <p key={i} className="modal-paragraph">
          {p}
        </p>
      ))}
    </div>
  );
}

function SkillsContent() {
  const { skills } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">📚 Skills</div>
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

function ExperienceContent() {
  const { experience } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">📜 Experience</div>
      <h2 className="modal-title">경력</h2>
      <div className="timeline">
        {experience.map((exp) => (
          <div key={exp.id} className="timeline-item">
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-year">{exp.year}</div>
              <h3 className="timeline-company">{exp.company}</h3>
              <div className="timeline-role">{exp.role}</div>
              <p className="timeline-summary">{exp.summary}</p>
              <ul className="timeline-highlights">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsContent() {
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

function ContactContent() {
  const { contact } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">📮 Contact</div>
      <h2 className="modal-title">연락하기</h2>
      <p className="modal-paragraph">{contact.message}</p>
      <a href={`mailto:${contact.email}`} className="contact-email">
        {contact.email}
      </a>
      <div className="contact-links">
        {contact.links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {l.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
