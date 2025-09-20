import InteractionForm from "@/components/InteractionForm";

export default function InteractionsPage() {
  return (
    <div>
      <h2>Medication Interaction Checker</h2>
      <p>
        Enter two medications to check for potential interactions based on our
        mock dataset.
      </p>
      <InteractionForm />
    </div>
  );
}
