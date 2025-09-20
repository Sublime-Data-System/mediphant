"use client";

import { useState, FormEvent } from "react";

// Define the structure of the API response
interface FaqResult {
  answer: string;
  matches: {
    text: string;
    score: number;
  }[];
}

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FaqResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!query.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/faq?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred.");
      }

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Medication FAQ Search</h2>
      <p>
        Ask a question about medication adherence or safety to get an
        AI-synthesized answer based on our knowledge base.
      </p>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="faq-query">Your Question</label>
          <input
            id="faq-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., How can I remember to take my medication?"
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Searching..." : "Ask"}
        </button>
      </form>

      {error && (
        <p style={{ color: "var(--danger-color)", marginTop: "1rem" }}>
          Error: {error}
        </p>
      )}

      {result && (
        <div className="result-card safe" style={{ marginTop: "2rem" }}>
          <h3>AI-Generated Answer</h3>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            <strong>{result.answer}</strong>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border-color)",
              margin: "1.5rem 0",
            }}
          />
          <h4>Sources from Knowledge Base</h4>
          <ul>
            {result.matches.map((match, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                &quot;{match.text}&quot; (Similarity: {match.score.toFixed(2)})
              </li>
            ))}
          </ul>
          <p className="disclaimer">
            <strong>Disclaimer:</strong> This AI-generated answer is for
            informational purposes only and is not a substitute for professional
            medical advice.
          </p>
        </div>
      )}
    </div>
  );
}
