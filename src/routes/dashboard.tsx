import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AI UBT" }] }),
  component: () => <AppShell variant="student"><StudentHome /></AppShell>,
});

function StudentHome() {
  const { t } = useLanguage();
  const { profile, user } = useAuth();
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold font-display">
        {t(`Сәлем, ${profile?.full_name ?? user?.email ?? ""}!`, `Hello, ${profile?.full_name ?? user?.email ?? ""}!`)}
      </h1>
      <p className="text-muted-foreground mt-2">{t("Сіз AI UBT-ке тіркелдіңіз.", "You're signed in to AI UBT.")}</p>

      <Card className="mt-8 border-border shadow-soft">
        <CardContent className="p-6 flex gap-4 items-start">
          <div className="w-11 h-11 rounded-xl bg-gradient-brand grid place-items-center text-brand-foreground shadow-soft shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t("Көп ұзамай…", "Coming soon…")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "Видеосабақтар, AI үй жұмысы және тесттер жақын арада қосылады. Қазір біз есептік жазбалар мен жүйені дайындап жатырмыз.",
                "Video lessons, AI homework and tests are coming soon. For now we're setting up accounts and the platform."
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
