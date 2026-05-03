import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/tests/")({
  head: () => ({ meta: [{ title: "Practice Tests — AI UBT" }] }),
  component: () => <AppShell variant="student"><TestsList /></AppShell>,
});

function TestsList() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    void supabase.from("tests").select("*").eq("is_published", true).then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("ҰБТ тесттері", "Practice tests")}</h1>
      <div className="mt-6 space-y-3">
        {items.map(te => (
          <Link key={te.id} to="/tests/$testId" params={{ testId: te.id }}>
            <Card className="border-border shadow-soft hover:shadow-elevated transition-all">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-spotlight/10 text-spotlight grid place-items-center"><FlaskConical size={20} /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{lang === "kz" ? te.title_kz : te.title_en}</div>
                  <div className="text-xs text-muted-foreground">{lang === "kz" ? te.subject_kz : te.subject_en} · {te.time_limit_minutes} {t("мин", "min")} · {(te.questions as any[]).length} {t("сұрақ", "questions")}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
