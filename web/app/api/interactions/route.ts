import { NextResponse } from "next/server";
import { z } from "zod";

// Mock knowledge base for medication interactions
const interactionRules = new Map<string, { reason: string; advice: string }>([
  [
    "ibuprofen|warfarin",
    {
      reason: "Increased bleeding risk.",
      advice:
        "Avoid this combination if possible. Consult your clinician. Acetaminophen is a preferred alternative for pain relief.",
    },
  ],
  [
    "contrast dye|metformin",
    {
      reason:
        "Risk of lactic acidosis around the time of imaging with contrast.",
      advice:
        "Metformin should typically be held before and after receiving imaging contrast, as per your imaging protocol.",
    },
  ],
  [
    "lisinopril|spironolactone",
    {
      reason: "Risk of hyperkalemia (high potassium levels).",
      advice:
        "Regular monitoring of potassium levels is required. Consult your clinician about this combination.",
    },
  ],
]);

// Zod schema for input validation
const InteractionRequestSchema = z.object({
  medA: z.string().trim().min(1, "Medication A cannot be empty."),
  medB: z.string().trim().min(1, "Medication B cannot be empty."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = InteractionRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    const { medA, medB } = validation.data;

    // Normalize inputs: lowercase and sort alphabetically to ensure order doesn't matter
    const med1 = medA.toLowerCase();
    const med2 = medB.toLowerCase();
    const sortedPair = [med1, med2].sort();
    const ruleKey = sortedPair.join("|");

    if (interactionRules.has(ruleKey)) {
      const rule = interactionRules.get(ruleKey)!;
      return NextResponse.json({
        pair: [medA, medB],
        isPotentiallyRisky: true,
        reason: rule.reason,
        advice: rule.advice,
      });
    } else {
      return NextResponse.json({
        pair: [medA, medB],
        isPotentiallyRisky: false,
        reason: "No specific interaction found in our mock dataset.",
        advice:
          "This does not guarantee safety. Always consult with a healthcare professional before changing your medication regimen.",
      });
    }
  } catch (error) {
    console.error("Interaction API Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
