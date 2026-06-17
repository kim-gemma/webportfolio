import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function CvContent() {
  const { experience } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">📜 CV</div>
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
