import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ resultId: z.string().optional() });

export const Route = createFileRoute("/tests/$testId/result")({
  validateSearch: searchSchema,
  component: () => <AppShell variant="student"><Result /></AppShell>,
});

function Result() {
  const { testId } = Route.useParams();
  const { resultId } = Route.useSearch();
  const { t } = useLanguage();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (resultId) void supabase.from("test_results").select("*").eq("id", resultId).maybeSingle().then(({ data }) => setResult(data));
  }, [resultId]);

  if (!result) return <div className="p-8 text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Card className="border-2 border-accent shadow-glow text-center">
        <CardContent className="p-10">
          <Trophy className="mx-auto text-accent" size={48} />
          <div className="mt-4 text-7xl font-extrabold font-display text-gradient-brand">{Math.round(result.score)}<span className="text-2xl text-muted-foreground">/{result.max_score}</span></div>
          <p className="mt-2 text-muted-foreground">{t("Сіздің ҰБТ балыңыз", "Your UNT score")}</p>
        </CardContent>
      </Card>
      {Array.isArray(result.weak_topics) && result.weak_topics.length > 0 && (
        <Card className="mt-5 border-border shadow-soft">
          <CardContent className="p-6">
            <h3 className="font-bold">{t("Әлсіз тақырыптар", "Weak topics")}</h3>
            <div className="mt-3 space-y-2">
              {result.weak_topics.map((wt: any) => (
                <div key={wt.topic} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-sm font-medium">{wt.topic}</span>
                  <span className="text-xs text-destructive font-semibold">{wt.wrong} {t("қате", "wrong")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="mt-6 flex gap-3">
        <Link to="/tests/$testId" params={{ testId }}><Button variant="outline">{t("Қайта тапсыру", "Retry")}</Button></Link>
        <Link to="/tests"><Button className="bg-gradient-brand text-brand-foreground">{t("Басқа тесттер", "More tests")}</Button></Link>
      </div>
    </div>
  );
}
