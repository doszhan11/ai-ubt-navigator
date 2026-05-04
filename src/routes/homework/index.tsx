import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export const Route = createFileRoute("/homework/")({
  head: () => ({ meta: [{ title: "Homework — AI UBT" }] }),
  component: () => <AppShell variant="student"><HomeworkList /></AppShell>,
});

function HomeworkList() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    void supabase.from("homeworks").select("*").eq("is_published", true).order("deadline").then(({ data }) => setItems(data ?? []));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Үй жұмысы", "Homework")}</h1>
      <div className="mt-6 space-y-3">
        {items.map(h => (
          <Link key={h.id} to="/homework/$hwId" params={{ hwId: h.id }}>
            <Card className="border-border shadow-soft hover:shadow-elevated transition-all">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent grid place-items-center"><ClipboardList size={20} /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{lang === "kz" ? h.title_kz : h.title_en}</div>
                  <div className="text-xs text-muted-foreground">{lang === "kz" ? h.subject_kz : h.subject_en} · {h.type === "test" ? t("Тест", "Test") : t("Файл", "File")}</div>
                </div>
                {h.deadline && <div className="text-xs text-muted-foreground hidden sm:block">{new Date(h.deadline).toLocaleDateString()}</div>}
              </CardContent>
            </Card>
          </Link>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">{t("Тапсырма жоқ.", "No homework.")}</p>}
      </div>
    </div>
  );
}
