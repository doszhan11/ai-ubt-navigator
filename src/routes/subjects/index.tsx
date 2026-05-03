import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MANDATORY_SUBJECTS, iconForSubject } from "@/lib/subjects";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/subjects/")({
  head: () => ({ meta: [{ title: "My Subjects — AI UBT" }] }),
  component: () => <AppShell variant="student"><SubjectsPage /></AppShell>,
});

function SubjectsPage() {
  const { t, lang } = useLanguage();
  const { studentProfile } = useAuth();
  const [pair, setPair] = useState<any>(null);

  useEffect(() => {
    if (!studentProfile?.subject_pair_id) return;
    void supabase.from("subject_pairs").select("*").eq("id", studentProfile.subject_pair_id).maybeSingle().then(({ data }) => setPair(data));
  }, [studentProfile]);

  const allSubjects = [
    ...MANDATORY_SUBJECTS.map(s => ({ slug: s.slug, name_kz: s.name_kz, name_en: s.name_en, icon: s.icon, mandatory: true })),
    ...(pair ? [{ slug: (pair.subject_1_en as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"), name_kz: pair.subject_1_kz, name_en: pair.subject_1_en, icon: iconForSubject((pair.subject_1_en as string).toLowerCase().replace(/[^a-z0-9]+/g, "-")), mandatory: false }] : []),
    ...(pair?.subject_2_en ? [{ slug: (pair.subject_2_en as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"), name_kz: pair.subject_2_kz, name_en: pair.subject_2_en, icon: iconForSubject((pair.subject_2_en as string).toLowerCase().replace(/[^a-z0-9]+/g, "-")), mandatory: false }] : []),
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Менің пәндерім", "My subjects")}</h1>
      <p className="text-muted-foreground mt-1">{t("Бес пән — үшеуі міндетті, екеуі сіз таңдадыңыз.", "Five subjects — three mandatory, two you chose.")}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {allSubjects.map((s) => (
          <Link key={s.slug} to="/subjects/$subjectSlug" params={{ subjectSlug: s.slug }}>
            <Card className="border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{s.icon}</div>
                  {s.mandatory && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">{t("МІНДЕТТІ", "MANDATORY")}</span>}
                </div>
                <div className="mt-4 font-bold text-lg leading-tight">{lang === "kz" ? s.name_kz : s.name_en}</div>
                <div className="mt-4"><Progress value={Math.floor(Math.random()*60)+20} className="h-1.5" /></div>
                <div className="mt-2 text-xs text-muted-foreground flex justify-between"><span>{t("4 сабақ", "4 lessons")}</span><span>{t("2 тапсырма", "2 homework")}</span></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
