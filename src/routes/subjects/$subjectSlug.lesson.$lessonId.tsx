import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/subjects/$subjectSlug/lesson/$lessonId")({
  component: () => <AppShell variant="student"><LessonView /></AppShell>,
});

function LessonView() {
  const { subjectSlug, lessonId } = Route.useParams();
  const { t, lang } = useLanguage();
  const [lesson, setLesson] = useState<any>(null);
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    void supabase.from("lessons").select("*").eq("id", lessonId).maybeSingle().then(({ data }) => setLesson(data));
    void supabase.from("study_notes").select("*").eq("lesson_id", lessonId).maybeSingle().then(({ data }) => setNote(data));
  }, [lessonId]);

  if (!lesson) return <div className="p-8 text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Link to="/subjects/$subjectSlug" params={{ subjectSlug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ChevronLeft size={16} />{t("Артқа", "Back")}</Link>
      <Card className="overflow-hidden border-border shadow-elevated">
        <div className="aspect-video bg-black">
          <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen title="lesson" />
        </div>
        <CardContent className="p-6">
          <h1 className="text-2xl font-extrabold font-display">{lang === "kz" ? lesson.topic_kz : lesson.topic_en}</h1>
          <p className="mt-2 text-muted-foreground">{lang === "kz" ? lesson.description_kz : lesson.description_en}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {note && <Button variant="outline"><Download size={16} className="mr-2" />{t("Конспектіні жүктеу", "Download notes")}</Button>}
            <Button className="bg-gradient-brand text-brand-foreground hover:opacity-90">{t("Аяқталды деп белгілеу", "Mark as complete")}</Button>
          </div>
        </CardContent>
      </Card>
      {note && (
        <Card className="mt-5 border-border shadow-soft">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg">{lang === "kz" ? note.title_kz : note.title_en}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{lang === "kz" ? note.content_kz : note.content_en}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
