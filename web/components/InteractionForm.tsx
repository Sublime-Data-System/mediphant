"use client";

import { useState, FormEvent } from "react";

// Define the structure of the API response
interface InteractionResult {
  pair: [string, string];
  isPotentiallyRisky: boolean;
  reason: string;
  advice: string;
}

export default function InteractionForm() {
  const [medA, setMedA] = useState("");
  const [medB, setMedB] = useState("");
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Basic client-side validation
    const trimmedA = medA.trim();
    const trimmedB = medB.trim();

    if (!trimmedA || !trimmedB) {
      setError("Please enter both medication names.");
      return;
    }
    if (trimmedA.toLowerCase() === trimmedB.toLowerCase()) {
      setError("Please enter two different medication names.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medA: trimmedA, medB: trimmedB }),
      });

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
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="medA">Medication 1</label>
          <input
            id="medA"
            type="text"
            value={medA}
            onChange={(e) => setMedA(e.target.value)}
            placeholder="e.g., Warfarin"
          />
        </div>
        <div className="form-group">
          <label htmlFor="medB">Medication 2</label>
          <input
            id="medB"
            type="text"
            value={medB}
            onChange={(e) => setMedB(e.target.value)}
            placeholder="e.g., Ibuprofen"
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Checking..." : "Check Interactions"}
        </button>
      </form>

      {error && (
        <p style={{ color: "var(--danger-color)", marginTop: "1rem" }}>
          Error: {error}
        </p>
      )}

      {result && (
        <div
          className={`result-card ${result.isPotentiallyRisky ? "risky" : "safe"}`}
        >
          <h3>
            Interaction:{" "}
            {result.isPotentiallyRisky
              ? "Potential Risk Found"
              : "No Specific Risk Found"}
          </h3>
          <p>
            <strong>Medications:</strong> {result.pair[0]} & {result.pair[1]}
          </p>
          <p>
            <strong>Reason:</strong> {result.reason}
          </p>
          <p>
            <strong>Advice:</strong> {result.advice}
          </p>
          <p className="disclaimer">
            <strong>Disclaimer:</strong> This is informational only and not
            medical advice. Always consult a healthcare professional.
          </p>
        </div>
      )}
    </>
  );
}
