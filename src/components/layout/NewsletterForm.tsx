"use client"

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot, kept empty by real visitors
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-emerald-400">You&rsquo;re subscribed. Thanks for joining.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="footer-company">Company</label>
          <input
            id="footer-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <input
          id="footer-newsletter-email"
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full rounded-md px-3 py-2
            bg-white/10 border border-white/20
            text-white placeholder:text-white/50
            focus:outline-none focus:border-white
          "
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="
            px-4 py-2 rounded-md
            bg-white text-black
            text-sm font-medium
            hover:bg-neutral-200 transition
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {status === "sending" ? "Joining…" : "Join"}
        </button>
      </form>

      {status === "error" && errorMessage && (
        <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
