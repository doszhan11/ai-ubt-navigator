import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Teacher — AI UBT" }] }),
  component: () => <AppShell variant="teacher"><TeacherDashboard /></AppShell>,
});

interface StudentRow {
  id: string;
  full_name: string | null;
  avg: number;
  pair_id: number | null;
}

function TeacherDashboard() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    void Promise.all([
      supabase.from("profiles").select("id,full_name"),
      supabase.from("student_profiles").select("id,subject_pair_id,score_qazaqstan_tarihy,score_oku_saattylyghy,score_math_saattylyghy,score_subject_1,score_subject_2"),
      supabase.from("user_roles").select("user_id,role").eq("role", "student"),
    ]).then(([profiles, sp, roles]) => {
      const studentIds = new Set((roles.data ?? []).map((r: any) => r.user_id));
      const spMap = new Map((sp.data ?? []).map((x: any) => [x.id, x]));
      const list: StudentRow[] = (profiles.data ?? [])
        .filter((p: any) => studentIds.has(p.id))
        .map((p: any) => {
          const s: any = spMap.get(p.id);
          const scores = s ? [s.score_qazaqstan_tarihy, s.score_oku_saattylyghy, s.score_math_saattylyghy, s.score_subject_1, s.score_subject_2].map(Number) : [];
          const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
          return { id: p.id, full_name: p.full_name, avg, pair_id: s?.subject_pair_id ?? null };
        });
      setRows(list);
      setLoading(false);
    });
  }, []);

  const filtered = rows.filter((r) => !filter || (r.full_name ?? "").toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Оқушылар", "Students")}</h1>
          <p className="text-muted-foreground mt-1">{t("Сіздің оқушыларыңыздың прогресі.", "Progress of your students.")}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t("Іздеу…", "Search…")} className="pl-9" />
        </div>
      </div>

      <Card className="mt-6 border-border shadow-soft">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">{t("Оқушылар жоқ.", "No students yet.")}</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((s) => (
                <div key={s.id} className="p-4 sm:p-5 flex items-center gap-4 flex-wrap">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand text-brand-foreground grid place-items-center font-bold text-sm shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{s.full_name ?? t("Атаусыз", "Unnamed")}</div>
                    <div className="text-xs text-muted-foreground">{s.pair_id ? `Pair #${s.pair_id}` : t("Пән жұбы таңдалмаған", "No subject pair selected")}</div>
                  </div>
                  <div className="w-40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{t("Орташа", "Average")}</span>
                      <span className="font-bold">{s.avg}%</span>
                    </div>
                    <Progress value={s.avg} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
