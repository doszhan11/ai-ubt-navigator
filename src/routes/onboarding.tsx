import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Choose your subject pair — AI UBT" }] }),
  component: Onboarding,
});

interface Pair {
  id: number;
  name_kz: string;
  name_en: string;
  subject_1_kz: string;
  subject_1_en: string;
  subject_2_kz: string | null;
  subject_2_en: string | null;
}

function Onboarding() {
  const { t, lang } = useLanguage();
  const { user, loading, refresh, role, studentProfile } = useAuth();
  const navigate = useNavigate();
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (role === "admin") { navigate({ to: "/admin" }); return; }
    if (role === "teacher") { navigate({ to: "/teacher" }); return; }
    if (studentProfile?.onboarded) { navigate({ to: "/dashboard" }); return; }
  }, [user, loading, role, studentProfile, navigate]);

  useEffect(() => {
    void supabase.from("subject_pairs").select("*").order("id").then(({ data }) => setPairs((data ?? []) as Pair[]));
  }, []);

  const onContinue = async () => {
    if (!selected || !user) return;
    setBusy(true);
    const { error } = await supabase.from("student_profiles").update({
      subject_pair_id: selected,
      onboarded: true,
    }).eq("id", user.id);
    if (error) { toast.error(error.message); setBusy(false); return; }
    await refresh();
    toast.success(t("Сақталды!", "Saved!"));
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size={30} />
          <LanguageToggle />
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
            {t("1-қадам / 1-step", "Step 1 of 1")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">{t("Пән жұбын таңдаңыз", "Choose your subject pair")}</h1>
          <p className="mt-3 text-muted-foreground">{t("Бұл сіздің ҰБТ-да тапсыратын 2 негізгі пәніңіз. Барлық оқушылар қосымша 3 міндетті пән алады.", "These are the 2 elective subjects you'll take at the UNT. All students also get 3 mandatory subjects.")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {pairs.map((p) => {
            const active = selected === p.id;
            const name = lang === "kz" ? p.name_kz : p.name_en;
            const s1 = lang === "kz" ? p.subject_1_kz : p.subject_1_en;
            const s2 = lang === "kz" ? p.subject_2_kz : p.subject_2_en;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                  active
                    ? "border-accent bg-accent/5 shadow-glow"
                    : "border-border bg-card hover:border-accent/40 hover:shadow-soft"
                }`}
              >
                {active && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent grid place-items-center text-accent-foreground">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
                <div className="text-xs font-semibold text-muted-foreground">#{p.id}</div>
                <div className="mt-2 font-bold text-lg leading-tight">{name}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground/70">{s1}</span>
                  {s2 && <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground/70">{s2}</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <Button onClick={onContinue} disabled={!selected || busy} size="lg" className="bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-soft">
            {busy ? t("Сақталуда…", "Saving…") : t("Жалғастыру", "Continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
