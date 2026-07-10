import PageHeader from "../../../components/ui/PageHeader.tsx";

export default function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Your garden"
        title="Good morning, Travis"
        description="Complete today's habits to help your Bloom Buddy grow."
      />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="min-h-96 rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <p className="font-semibold text-emerald-950">Your plant</p>
          <p className="mt-2 text-sm text-slate-600">
            Plant growth will appear here.
          </p>
        </article>

        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <p className="font-semibold text-emerald-950">Today’s progress</p>
          <p className="mt-2 text-sm text-slate-600">
            Daily habit completion will appear here.
          </p>
        </article>
      </section>
    </>
  );
}