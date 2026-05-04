import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/teacher/students")({
  head: () => ({ meta: [{ title: "Students — Teacher — AI UBT" }] }),
  component: () => <AppShell variant="teacher"><Students /></AppShell>,
});

interface Row {
  id: string;
  full_name: string | null;
  language: string;
  created_at: string;
}

function Students() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "student");
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (ids.length === 0) { setRows([]); setLoading(false); return; }
      const { data: profiles } = await supabase.from("profiles").select("id,full_name,language,created_at").in("id", ids).order("created_at", { ascending: false });
      setRows((profiles ?? []) as Row[]);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter(r => !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold font-display">{t("Студенттер", "Students")}</h1>
      <p className="text-muted-foreground mt-1">{t("Барлық тіркелген студенттер.", "All registered students.")}</p>

      <div className="mt-6">
        <Input placeholder={t("Атымен іздеу…", "Search by name…")} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      </div>

      <Card className="mt-4 border-border shadow-soft">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Аты", "Name")}</TableHead>
                  <TableHead>{t("Тілі", "Lang")}</TableHead>
                  <TableHead>{t("Тіркелген", "Joined")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">{t("Студенттер жоқ", "No students")}</TableCell></TableRow>
                )}
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.full_name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.language.toUpperCase()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
