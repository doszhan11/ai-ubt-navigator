import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, FileText, ClipboardList, FlaskConical } from "lucide-react";
import { iconForSubject } from "@/lib/subjects";

export const Route = createFileRoute("/subjects/$subjectSlug")({
  component: () => <AppShell variant="student"><SubjectPage /></AppShell>,
});

function SubjectPage() {
  const { subjectSlug } = Route.useParams();
  const { t, lang } = useLanguage();
  const [lessons, setLessons] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const subjectName = lessons[0] ? (lang === "kz" ? lessons[0].subject_kz : lessons[0].subject_en) : subjectSlug;

  useEffect(() => {
    void Promise.all([
      supabase.from("lessons").select("*").eq("subject_slug", subjectSlug).eq("is_published", true).order("order_index"),
      supabase.from("homeworks").select("*").eq("subject_slug", subjectSlug).eq("is_published", true),
      supabase.from("tests").select("*").eq("subject_slug", subjectSlug).eq("is_published", true),
    ]).then(([l, h, te]) => {
      setLessons(l.data ?? []); setHomeworks(h.data ?? []); setTests(te.data ?? []);
    });
  }, [subjectSlug]);

  useEffect(() => {
    if (lessons.length === 0) return;
    const ids = lessons.map(l => l.id);
    void supabase.from("study_notes").select("*").in("lesson_id", ids).then(({ data }) => setNotes(data ?? []));
  }, [lessons]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{iconForSubject(subjectSlug)}</div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{subjectName}</h1>
          <p className="text-muted-foreground text-sm">{lessons.length} {t("сабақ", "lessons")} · {homeworks.length} {t("тапсырма", "homework")} · {tests.length} {t("тест", "tests")}</p>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="mt-6">
        <TabsList>
          <TabsTrigger value="lessons">{t("Сабақтар", "Lessons")}</TabsTrigger>
          <TabsTrigger value="homework">{t("Тапсырма", "Homework")}</TabsTrigger>
          <TabsTrigger value="tests">{t("Тесттер", "Tests")}</TabsTrigger>
          <TabsTrigger value="notes">{t("Конспект", "Notes")}</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map(l => (
              <Link key={l.id} to="/subjects/$subjectSlug/lesson/$lessonId" params={{ subjectSlug, lessonId: l.id }}>
                <Card className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {l.thumbnail_url && <img src={l.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 grid place-items-center bg-black/30"><Play className="text-white" size={32} fill="white" /></div>
                  </div>
                  <CardContent className="p-4">
                    <div className="font-semibold text-sm leading-snug">{lang === "kz" ? l.topic_kz : l.topic_en}</div>
                    <div className="text-xs text-muted-foreground mt-1">{Math.round((l.duration_seconds ?? 0)/60)} {t("мин", "min")}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {lessons.length === 0 && <p className="text-sm text-muted-foreground col-span-full">{t("Әзірге сабақ жоқ.", "No lessons yet.")}</p>}
          </div>
        </TabsContent>

        <TabsContent value="homework" className="mt-5 space-y-3">
          {homeworks.map(h => (
            <Link key={h.id} to="/homework/$hwId" params={{ hwId: h.id }}>
              <Card className="border-border shadow-soft hover:shadow-elevated transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent grid place-items-center"><ClipboardList size={20} /></div>
                  <div className="flex-1">
                    <div className="font-semibold">{lang === "kz" ? h.title_kz : h.title_en}</div>
                    <div className="text-xs text-muted-foreground">{h.type === "test" ? t("Тест", "Test") : t("Файл", "File")}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {homeworks.length === 0 && <p className="text-sm text-muted-foreground">{t("Тапсырма жоқ.", "No homework.")}</p>}
        </TabsContent>

        <TabsContent value="tests" className="mt-5 space-y-3">
          {tests.map(te => (
            <Link key={te.id} to="/tests/$testId" params={{ testId: te.id }}>
              <Card className="border-border shadow-soft hover:shadow-elevated transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-spotlight/10 text-spotlight grid place-items-center"><FlaskConical size={20} /></div>
                  <div className="flex-1">
                    <div className="font-semibold">{lang === "kz" ? te.title_kz : te.title_en}</div>
                    <div className="text-xs text-muted-foreground">{te.time_limit_minutes} {t("мин", "min")} · {(te.questions as any[]).length} {t("сұрақ", "questions")}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {tests.length === 0 && <p className="text-sm text-muted-foreground">{t("Тест жоқ.", "No tests.")}</p>}
        </TabsContent>

        <TabsContent value="notes" className="mt-5 space-y-3">
          {notes.map(n => (
            <Card key={n.id} className="border-border shadow-soft">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning grid place-items-center"><FileText size={20} /></div>
                <div className="flex-1">
                  <div className="font-semibold">{lang === "kz" ? n.title_kz : n.title_en}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{lang === "kz" ? n.content_kz : n.content_en}</div>
                </div>
              </CardContent>
            </Card>
          ))}
          {notes.length === 0 && <p className="text-sm text-muted-foreground">{t("Конспект жоқ.", "No notes.")}</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
