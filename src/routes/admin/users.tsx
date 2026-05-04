import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin — AI UBT" }] }),
  component: () => <AppShell variant="admin"><AdminUsers /></AppShell>,
});

interface Row {
  id: string;
  full_name: string | null;
  language: string;
  created_at: string;
  roles: string[];
}

function AdminUsers() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id,full_name,language,created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      const grouped: Record<string, string[]> = {};
      (roles ?? []).forEach((r: any) => {
        grouped[r.user_id] = [...(grouped[r.user_id] ?? []), r.role];
      });
      setRows((profiles ?? []).map((p: any) => ({ ...p, roles: grouped[p.id] ?? [] })));
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter(r => !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || r.id.includes(q));

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold font-display">{t("Қолданушылар", "Users")}</h1>
      <p className="text-muted-foreground mt-1">{t("Барлық тіркелген қолданушылар.", "All registered users.")}</p>

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
                  <TableHead>{t("Рөлдері", "Roles")}</TableHead>
                  <TableHead>{t("Тіркелген", "Joined")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">{t("Деректер жоқ", "No data")}</TableCell></TableRow>
                )}
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.full_name ?? "—"}</TableCell>
                    <TableCell><Badge variant="outline">{r.language.toUpperCase()}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {r.roles.length === 0 ? <span className="text-muted-foreground text-xs">—</span> :
                          r.roles.map(rl => (
                            <Badge key={rl} className={rl === "admin" ? "bg-destructive text-destructive-foreground" : rl === "teacher" ? "bg-accent text-accent-foreground" : ""}>{rl}</Badge>
                          ))}
                      </div>
                    </TableCell>
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
