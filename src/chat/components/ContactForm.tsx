import { useState, useCallback, type FormEvent } from "react";
import type { ContactResponse } from "../types";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isValid = name.trim().length > 0 && message.trim().length > 0;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isValid || status === "sending") return;

      setStatus("sending");
      setErrorMessage("");

      try {
        const res = await fetch(`${API_BASE_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim() || undefined,
            message: message.trim(),
          }),
        });
        const data: ContactResponse = await res.json();

        if (!res.ok || !data.success) {
          setStatus("error");
          setErrorMessage(data.error ?? "Something went wrong. Please try again.");
          return;
        }

        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } catch {
        setStatus("error");
        setErrorMessage("Could not reach the server. Please try again later.");
      }
    },
    [name, email, message, isValid, status]
  );

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <p className="contact-form-intro">
        Thanks for visiting my portfolio.
        <br />
        If you'd like to discuss a project,
        <br />
        collaboration, or opportunity,
        <br />
        feel free to leave a message below.
      </p>

      <label className="contact-field">
        <span className="contact-field-label">Name *</span>
        <input
          className="contact-input"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">Email</span>
        <input
          className="contact-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com (optional)"
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">Message *</span>
        <textarea
          className="contact-input contact-textarea"
          value={message}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          required
        />
      </label>

      {status === "error" && <p className="contact-form-error">{errorMessage}</p>}
      {status === "success" && (
        <p className="contact-form-success">✅ Thanks! Your message has been sent.</p>
      )}

      <button
        type="submit"
        className="contact-send-btn"
        disabled={!isValid || status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
