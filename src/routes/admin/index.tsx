import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Shield, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — AI UBT" }] }),
  component: () => <AppShell variant="admin"><AdminOverview /></AppShell>,
});

function AdminOverview() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ students: 0, teachers: 0, admins: 0, lessons: 0 });

  useEffect(() => {
    void Promise.all([
      supabase.from("user_roles").select("role"),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
    ]).then(([roles, lessons]) => {
      const r = roles.data ?? [];
      setStats({
        students: r.filter((x: any) => x.role === "student").length,
        teachers: r.filter((x: any) => x.role === "teacher").length,
        admins: r.filter((x: any) => x.role === "admin").length,
        lessons: lessons.count ?? 0,
      });
    });
  }, []);

  const cards = [
    { icon: GraduationCap, label: t("Оқушылар", "Students"), value: stats.students, color: "from-emerald-500 to-teal-600" },
    { icon: Users, label: t("Мұғалімдер", "Teachers"), value: stats.teachers, color: "from-indigo-500 to-violet-600" },
    { icon: Shield, label: t("Әкімшілер", "Admins"), value: stats.admins, color: "from-amber-500 to-orange-600" },
    { icon: BookOpen, label: t("Сабақтар", "Lessons"), value: stats.lessons, color: "from-pink-500 to-rose-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Әкімші тақтасы", "Admin Overview")}</h1>
      <p className="text-muted-foreground mt-1">{t("Платформаның жалпы көрсеткіштері.", "Platform-wide statistics.")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="border-border shadow-soft">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-3`}>
                  <Icon size={20} />
                </div>
                <div className="text-3xl font-extrabold font-display">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
