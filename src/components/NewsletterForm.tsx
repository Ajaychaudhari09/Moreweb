"use client";

import { useState } from "react";

interface NewsletterFormProps {
  theme?: "light" | "dark";
}

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");

    try {
      // Placeholder: replace with real API endpoint or integration
      await new Promise((r) => setTimeout(r, 700));
      setStatus("ok");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-2" onSubmit={onSubmit}>
      <input
        className="form-input"
        placeholder="Your email"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />
      <button
        className="btn-primary"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : status === "ok" ? "Subscribed" : "Subscribe"}
      </button>

      {status === "error" && (
        <p className="text-xs text-red-600 dark:text-red-400">Subscription failed. Please try again.</p>
      )}
    </form>
  );
}
