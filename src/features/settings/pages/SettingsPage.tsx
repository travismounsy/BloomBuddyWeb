import PageHeader from "../../../components/ui/PageHeader.tsx";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Personalize your Bloom Buddy experience."
      />

      <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Your settings will appear here.</p>
      </section>
    </>
  );
}