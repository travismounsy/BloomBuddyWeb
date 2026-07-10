import PageHeader from "../../../components/ui/PageHeader.tsx";

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Progress"
        description="Review your streaks, completion rates, and category performance."
      />

      <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Your analytics will appear here.</p>
      </section>
    </>
  );
}