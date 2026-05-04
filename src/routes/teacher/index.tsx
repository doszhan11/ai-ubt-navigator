import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Teacher — AI UBT" }] }),
  component: () => <AppShell variant="teacher"><TeacherOverview /></AppShell>,
});

function TeacherOverview() {
  const { t } = useLanguage();
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    void supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "student").then(({ count }) => {
      setStudentCount(count ?? 0);
    });
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold font-display">{t("Мұғалім панелі", "Teacher Panel")}</h1>
      <p className="text-muted-foreground mt-1">{t("Студенттерді қарап шығыңыз.", "View your students.")}</p>

      <Card className="mt-8 border-border shadow-soft max-w-sm">
        <CardContent className="p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center text-white mb-3">
            <GraduationCap size={20} />
          </div>
          <div className="text-3xl font-extrabold font-display">{studentCount}</div>
          <div className="text-xs text-muted-foreground mt-1">{t("Барлық студенттер", "Total students")}</div>
        </CardContent>
      </Card>
    </div>
  );
}
