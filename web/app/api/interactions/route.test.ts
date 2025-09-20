/**
 * @jest-environment-node
 */
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/interactions", () => {
  // Helper to create a mock request
  const createMockRequest = (body: Record<string, string>): NextRequest => {
    return new NextRequest("http://localhost/api/interactions", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  };

  it("should return a risky interaction for warfarin and ibuprofen", async () => {
    const request = createMockRequest({ medA: "Warfarin", medB: "Ibuprofen" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.isPotentiallyRisky).toBe(true);
    expect(body.reason).toContain("Increased bleeding risk");
  });

  it("should return a non-risky result for two unknown medications", async () => {
    const request = createMockRequest({ medA: "Aspirin", medB: "Paracetamol" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.isPotentiallyRisky).toBe(false);
    expect(body.reason).toContain("No specific interaction found");
  });

  it("should return a 400 error if one medication is missing", async () => {
    const request = createMockRequest({ medA: "Lisinopril", medB: "" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Medication B cannot be empty.");
  });
});
