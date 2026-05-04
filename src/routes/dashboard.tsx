import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MANDATORY_SUBJECTS, iconForSubject } from "@/lib/subjects";
import { Sparkles, ClipboardList, FlaskConical, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AI UBT" }] }),
  component: () => <AppShell variant="student"><Dashboard /></AppShell>,
});

function Dashboard() {
  const { t, lang } = useLanguage();
  const { profile, studentProfile, user } = useAuth();
  const [pairSubjects, setPairSubjects] = useState<{ slug: string; name_kz: string; name_en: string }[]>([]);
  const [counts, setCounts] = useState({ lessons: 0, homework: 0, tests: 0 });
  const [nextSession, setNextSession] = useState<any>(null);

  useEffect(() => {
    if (!studentProfile?.subject_pair_id) return;
    void supabase.from("subject_pairs").select("*").eq("id", studentProfile.subject_pair_id).maybeSingle().then(({ data }) => {
      if (!data) return;
      const subs: any[] = [{ slug: (data.subject_1_en as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"), name_kz: data.subject_1_kz, name_en: data.subject_1_en }];
      if (data.subject_2_en) subs.push({ slug: (data.subject_2_en as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"), name_kz: data.subject_2_kz, name_en: data.subject_2_en });
      setPairSubjects(subs);
    });
    void Promise.all([
      supabase.from("lessons").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("homeworks").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("tests").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("nusqa_sessions").select("*").eq("status", "upcoming").order("scheduled_at").limit(1).maybeSingle(),
    ]).then(([l, h, te, ns]) => {
      setCounts({ lessons: l.count ?? 0, homework: h.count ?? 0, tests: te.count ?? 0 });
      setNextSession(ns.data);
    });
  }, [studentProfile, user]);

  const allSubjects = [
    ...MANDATORY_SUBJECTS.map(s => ({ slug: s.slug, name_kz: s.name_kz, name_en: s.name_en, icon: s.icon })),
    ...pairSubjects.map(s => ({ ...s, icon: iconForSubject(s.slug) })),
  ];

  const scores = studentProfile ? [
    studentProfile.score_qazaqstan_tarihy,
    studentProfile.score_oku_saattylyghy,
    studentProfile.score_math_saattylyghy,
    studentProfile.score_subject_1,
    studentProfile.score_subject_2,
  ] : [0,0,0,0,0];
  const avgScore = Math.round(scores.reduce((a,b) => a+Number(b), 0) / Math.max(scores.length, 1));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
          {t(`Сәлем, ${profile?.full_name ?? ""}!`, `Hello, ${profile?.full_name ?? ""}!`)}
        </h1>
        <p className="text-muted-foreground mt-1">{t("Бүгін не оқысаңыз?", "What will you study today?")}</p>
      </div>

      <Card className="mt-6 border-border shadow-soft overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">{t("Жалпы прогресс", "Overall progress")}</div>
              <div className="text-xs text-muted-foreground">{t("5 пән бойынша орташа балл", "Average across 5 subjects")}</div>
            </div>
            <div className="text-3xl font-extrabold text-gradient-brand font-display">{avgScore}%</div>
          </div>
          <Progress value={avgScore} className="h-2.5" />
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { icon: BookOpen, label: t("Сабақтар", "Lessons"), value: counts.lessons, to: "/subjects", color: "from-emerald-500 to-teal-600" },
          { icon: ClipboardList, label: t("Үй жұмысы", "Homework"), value: counts.homework, to: "/homework", color: "from-indigo-500 to-violet-600" },
          { icon: FlaskConical, label: t("Тесттер", "Tests"), value: counts.tests, to: "/tests", color: "from-amber-500 to-orange-600" },
          { icon: Sparkles, label: t("Нұсқа талдау", "Nusqa session"), value: nextSession ? "1" : "0", to: "/nusqa", color: "from-pink-500 to-rose-600" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to}>
              <Card className="border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-3`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl font-extrabold font-display">{c.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t("Менің пәндерім", "My subjects")}</h2>
          <Link to="/subjects" className="text-sm text-accent font-semibold inline-flex items-center gap-1 hover:underline">
            {t("Барлығын көру", "View all")} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSubjects.map((s) => (
            <Link key={s.slug} to="/subjects/$subjectSlug" params={{ subjectSlug: s.slug }}>
              <Card className="border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-bold">{lang === "kz" ? s.name_kz : s.name_en}</div>
                  <div className="mt-3"><Progress value={Math.floor(Math.random()*60)+20} className="h-1.5" /></div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
