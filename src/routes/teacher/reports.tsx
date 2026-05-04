import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareWarning } from "lucide-react";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({ meta: [{ title: "Reports — Teacher — AI UBT" }] }),
  component: () => <AppShell variant="teacher"><ReportsPage /></AppShell>,
});

function ReportsPage() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase.from("error_reports").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setRows(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Қате есептері", "Error Reports")}</h1>
      <Card className="mt-6 border-border shadow-soft">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center">
              <MessageSquareWarning size={36} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">{t("Әзірге есептер жоқ.", "No reports yet.")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((r) => (
                <div key={r.id} className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{r.status}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-sm">{r.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
