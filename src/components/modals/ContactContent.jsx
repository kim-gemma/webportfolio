import { PORTFOLIO_DATA } from "../../data/portfolioData";

export default function ContactContent() {
  const { contact } = PORTFOLIO_DATA;
  return (
    <div className="modal-body">
      <div className="modal-eyebrow">📮 Contact</div>
      <h2 className="modal-title">연락하기</h2>
      <p className="modal-paragraph">{contact.message}</p>
      <a href={`mailto:${contact.email}`} className="contact-email">
        {contact.email}
      </a>
      <a href={`tel:${contact.phone}`} className="contact-email">
        {contact.phone}
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
