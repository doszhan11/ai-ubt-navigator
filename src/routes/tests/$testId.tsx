import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/tests/$testId")({
  component: () => <AppShell variant="student"><TestRunner /></AppShell>,
});

function TestRunner() {
  const { testId } = Route.useParams();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { void supabase.from("tests").select("*").eq("id", testId).maybeSingle().then(({ data }) => setTest(data)); }, [testId]);
  if (!test) return <div className="p-8 text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>;
  const qs = test.questions as any[];

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    const correct = qs.filter(q => answers[q.id] === q.correct).length;
    const score = Math.round((correct / qs.length) * 140);
    const wrongTopics: Record<string, number> = {};
    qs.forEach(q => { if (answers[q.id] !== q.correct) wrongTopics[q.topic ?? "Other"] = (wrongTopics[q.topic ?? "Other"] ?? 0) + 1; });
    const weak = Object.entries(wrongTopics).map(([topic, count]) => ({ topic, wrong: count }));
    const { data, error } = await supabase.from("test_results").insert({
      test_id: testId, student_id: user.id, answers, score, max_score: 140,
      weak_topics: weak, predicted_unt_score: score,
    }).select().maybeSingle();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    navigate({ to: "/tests/$testId/result", params: { testId }, search: { resultId: data!.id } });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold font-display">{lang === "kz" ? test.title_kz : test.title_en}</h1>
      <p className="text-sm text-muted-foreground mt-1">{test.time_limit_minutes} {t("мин", "min")} · {qs.length} {t("сұрақ", "questions")}</p>
      <div className="mt-6 space-y-4">
        {qs.map((q, i) => (
          <Card key={q.id} className="border-border shadow-soft">
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">{t("Сұрақ", "Question")} {i+1}</div>
              <div className="font-semibold mt-1">{lang === "kz" ? q.question_kz : q.question_en}</div>
              <div className="mt-3 grid gap-2">
                {(q.options as string[]).map((opt, idx) => (
                  <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[q.id] === idx ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}>
                    <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === idx} onChange={() => setAnswers(a => ({ ...a, [q.id]: idx }))} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={submit} disabled={busy || Object.keys(answers).length < qs.length} className="w-full bg-gradient-brand text-brand-foreground shadow-soft">
          {busy ? t("Жіберілуде…", "Submitting…") : t("Тестті аяқтау", "Submit test")}
        </Button>
      </div>
    </div>
  );
}
