import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles } from "lucide-react";

export const Route = createFileRoute("/nusqa/")({
  component: () => <AppShell variant="student"><NusqaList /></AppShell>,
});

function NusqaList() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { void supabase.from("nusqa_sessions").select("*").order("scheduled_at").then(({ data }) => setItems(data ?? [])); }, []);
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display flex items-center gap-2"><Sparkles className="text-accent" />{t("Нұсқа талдау", "Nusqa Taldau")}</h1>
      <p className="text-muted-foreground mt-1">{t("Тікелей AI сессиялар.", "Live AI analysis sessions.")}</p>
      <div className="mt-6 space-y-3">
        {items.map(s => (
          <Card key={s.id} className="border-border shadow-soft">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand text-brand-foreground grid place-items-center"><Calendar size={20} /></div>
              <div className="flex-1">
                <div className="font-bold">{lang === "kz" ? s.title_kz : s.title_en}</div>
                <div className="text-xs text-muted-foreground">{new Date(s.scheduled_at).toLocaleString()}</div>
              </div>
              <Button variant="outline" size="sm">{t("Қосылу", "Join")}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
