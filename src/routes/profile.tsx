import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MANDATORY_SUBJECTS } from "@/lib/subjects";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AI UBT" }] }),
  component: () => <AppShell variant="student"><ProfilePage /></AppShell>,
});

function ProfilePage() {
  const { t, lang } = useLanguage();
  const { profile, studentProfile, user } = useAuth();
  const [pair, setPair] = useState<any>(null);

  useEffect(() => {
    if (studentProfile?.subject_pair_id) {
      void supabase.from("subject_pairs").select("*").eq("id", studentProfile.subject_pair_id).maybeSingle().then(({ data }) => setPair(data));
    }
  }, [studentProfile]);

  const data = [
    { subject: lang === "kz" ? MANDATORY_SUBJECTS[0].name_kz : MANDATORY_SUBJECTS[0].name_en, score: Number(studentProfile?.score_qazaqstan_tarihy ?? 0), avg: 60 },
    { subject: lang === "kz" ? MANDATORY_SUBJECTS[1].name_kz : MANDATORY_SUBJECTS[1].name_en, score: Number(studentProfile?.score_oku_saattylyghy ?? 0), avg: 65 },
    { subject: lang === "kz" ? MANDATORY_SUBJECTS[2].name_kz : MANDATORY_SUBJECTS[2].name_en, score: Number(studentProfile?.score_math_saattylyghy ?? 0), avg: 58 },
    { subject: pair ? (lang === "kz" ? pair.subject_1_kz : pair.subject_1_en) : "—", score: Number(studentProfile?.score_subject_1 ?? 0), avg: 55 },
    { subject: pair?.subject_2_en ? (lang === "kz" ? pair.subject_2_kz : pair.subject_2_en) : "—", score: Number(studentProfile?.score_subject_2 ?? 0), avg: 50 },
  ];

  const initials = (profile?.full_name ?? user?.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <Card className="border-border shadow-soft overflow-hidden">
        <div className="h-24 bg-gradient-hero" />
        <CardContent className="p-6 -mt-12">
          <Avatar className="h-20 w-20 border-4 border-card"><AvatarFallback className="bg-gradient-brand text-brand-foreground text-xl font-bold">{initials}</AvatarFallback></Avatar>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold font-display">{profile?.full_name ?? user?.email}</h1>
            <Badge className={studentProfile?.subscription_tier === "premium" ? "bg-accent text-accent-foreground" : ""}>{studentProfile?.subscription_tier === "premium" ? t("Премиум", "Premium") : t("Тегін", "Free")}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
        </CardContent>
      </Card>

      <Card className="mt-6 border-border shadow-soft">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">{t("Менің профилім", "My profile")}</h2>
          <div className="h-[360px] w-full">
            <ResponsiveContainer>
              <RadarChart data={data}>
                <PolarGrid stroke="oklch(0.92 0.01 240)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name={t("Менің балым", "My score")} dataKey="score" stroke="oklch(0.72 0.16 160)" fill="oklch(0.72 0.16 160)" fillOpacity={0.4} />
                <Radar name={t("Орташа", "Class average")} dataKey="avg" stroke="oklch(0.5 0.03 260)" fill="oklch(0.5 0.03 260)" fillOpacity={0.15} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: t("Тесттер", "Tests"), value: 0 },
          { label: t("Орташа балл", "Avg score"), value: "—" },
          { label: t("Тапсырмалар", "Homework"), value: 0 },
          { label: t("Сабақтар", "Lessons"), value: 0 },
        ].map(s => (
          <Card key={s.label} className="border-border shadow-soft text-center">
            <CardContent className="p-5">
              <div className="text-2xl font-extrabold font-display">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
