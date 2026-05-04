import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/schedule")({
  head: () => ({ meta: [{ title: "Schedule — Admin — AI UBT" }] }),
  component: () => <AppShell variant="admin"><SchedulePage /></AppShell>,
});

function SchedulePage() {
  const { t } = useLanguage();
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Кесте", "Schedule")}</h1>
      <Card className="mt-6 border-border shadow-soft">
        <CardContent className="p-10 text-center">
          <Calendar size={36} className="mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">{t("Жақын арада қол жетімді.", "Coming soon.")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
