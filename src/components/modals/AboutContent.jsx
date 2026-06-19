import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function AboutContent() {
  const { about, profile } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">🙂 About Me</div>
      <h2 className="modal-title">{about.headline}</h2>
      <p className="modal-meta">
        {profile.location} · Frontend 실무 {profile.yearsExperience} · {profile.role}
      </p>
      {about.paragraphs.map((p, i) => (
        <p key={i} className="modal-paragraph">
          {p}
        </p>
      ))}
    </div>
  );
}
