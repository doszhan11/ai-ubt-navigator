import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/homework/$hwId")({
  component: () => <AppShell variant="student"><HomeworkDetail /></AppShell>,
});

function HomeworkDetail() {
  const { hwId } = Route.useParams();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hw, setHw] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<any>(null);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    void supabase.from("homeworks").select("*").eq("id", hwId).maybeSingle().then(({ data }) => setHw(data));
    if (user) {
      void supabase.from("homework_submissions").select("*").eq("homework_id", hwId).eq("student_id", user.id).maybeSingle().then(({ data }) => setSubmitted(data));
    }
  }, [hwId, user]);

  if (!hw) return <div className="p-8 text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>;

  const submit = async () => {
    if (!user) return;
    setGrading(true);
    let aiScore = 0;
    if (hw.type === "test" && hw.questions) {
      const qs = hw.questions as any[];
      const correct = qs.filter(q => answers[q.id] === q.correct).length;
      aiScore = Math.round((correct / qs.length) * 100);
    } else {
      aiScore = 80 + Math.floor(Math.random() * 15);
    }
    await new Promise(r => setTimeout(r, 1800));
    const { data, error } = await supabase.from("homework_submissions").insert({
      homework_id: hwId,
      student_id: user.id,
      answers: hw.type === "test" ? answers : null,
      ai_score: aiScore,
      ai_feedback: t("AI бағалады. Жақсы жұмыс! Әлсіз тұстарды талдап шығыңыз.", "Graded by AI. Good work! Review weak spots."),
      status: "graded",
    }).select().maybeSingle();
    setGrading(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(data);
    toast.success(t("Бағаланды!", "Graded!"));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate({ to: "/homework" })} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ChevronLeft size={16} />{t("Артқа", "Back")}</button>
      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="text-xs font-semibold text-accent">{lang === "kz" ? hw.subject_kz : hw.subject_en}</div>
          <h1 className="text-2xl font-extrabold font-display mt-1">{lang === "kz" ? hw.title_kz : hw.title_en}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{lang === "kz" ? hw.description_kz : hw.description_en}</p>
        </CardContent>
      </Card>

      {submitted ? (
        <Card className="mt-5 border-2 border-accent shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-accent text-sm font-semibold"><Sparkles size={16} /> {t("AI бағалаған", "Graded by AI")}</div>
            <div className="mt-2 text-5xl font-extrabold font-display text-gradient-brand">{Math.round(submitted.ai_score)}<span className="text-xl text-muted-foreground">/100</span></div>
            <p className="mt-3 text-sm text-muted-foreground">{submitted.ai_feedback}</p>
          </CardContent>
        </Card>
      ) : hw.type === "test" ? (
        <div className="mt-5 space-y-4">
          {(hw.questions as any[]).map((q, i) => (
            <Card key={q.id} className="border-border shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs text-muted-foreground">{t("Сұрақ", "Question")} {i+1}</div>
                <div className="font-semibold mt-1">{lang === "kz" ? q.question_kz : q.question_en}</div>
                <div className="mt-3 grid gap-2">
                  {(q.options as string[]).map((opt, idx) => (
                    <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[q.id] === idx ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}>
                      <input type="radio" name={`q-${q.id}`} className="accent-current" checked={answers[q.id] === idx} onChange={() => setAnswers(a => ({ ...a, [q.id]: idx }))} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={submit} disabled={grading || Object.keys(answers).length < (hw.questions as any[]).length} className="w-full bg-gradient-brand text-brand-foreground shadow-soft">
            {grading ? t("AI бағалап жатыр…", "AI is grading…") : t("Жіберу", "Submit")}
          </Button>
        </div>
      ) : (
        <Card className="mt-5 border-dashed border-2 border-border">
          <CardContent className="p-10 text-center">
            <Upload className="mx-auto text-muted-foreground" size={32} />
            <p className="mt-3 text-sm text-muted-foreground">{t("Файлыңызды осы жерге сүйреңіз", "Drag your file here")}</p>
            <Button onClick={submit} disabled={grading} className="mt-5 bg-gradient-brand text-brand-foreground">
              {grading ? t("AI бағалап жатыр…", "AI is grading…") : t("Демо жіберу", "Submit demo")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
