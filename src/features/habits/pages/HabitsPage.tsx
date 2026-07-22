import PageHeader from "../../../components/ui/PageHeader.tsx";

export default function HabitsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Daily routines"
        title="Habits"
        description="Create, organize, and complete the habits that help your garden grow."
      />

      <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Your habit list will appear here.</p>
      </section>
    </>
  );
}