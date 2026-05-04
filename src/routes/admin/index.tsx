import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — AI UBT" }] }),
  component: () => <AppShell variant="admin"><AdminOverview /></AppShell>,
});

function AdminOverview() {
  const { t } = useLanguage();
  const [counts, setCounts] = useState({ total: 0, students: 0, teachers: 0, admins: 0 });

  useEffect(() => {
    void (async () => {
      const [{ count: total }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("role"),
      ]);
      const r = roles ?? [];
      setCounts({
        total: total ?? 0,
        students: r.filter((x: any) => x.role === "student").length,
        teachers: r.filter((x: any) => x.role === "teacher").length,
        admins: r.filter((x: any) => x.role === "admin").length,
      });
    })();
  }, []);

  const cards = [
    { icon: Users, label: t("Барлық қолданушылар", "Total users"), value: counts.total, color: "from-indigo-500 to-violet-600" },
    { icon: GraduationCap, label: t("Студенттер", "Students"), value: counts.students, color: "from-emerald-500 to-teal-600" },
    { icon: Users, label: t("Мұғалімдер", "Teachers"), value: counts.teachers, color: "from-amber-500 to-orange-600" },
    { icon: ShieldCheck, label: t("Әкімшілер", "Admins"), value: counts.admins, color: "from-pink-500 to-rose-600" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold font-display">{t("Әкімші панелі", "Admin Panel")}</h1>
      <p className="text-muted-foreground mt-1">{t("Қолданушылар мен рөлдерді басқарыңыз.", "Manage users and roles.")}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="border-border shadow-soft">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-3`}>
                  <Icon size={20} />
                </div>
                <div className="text-3xl font-extrabold font-display">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
