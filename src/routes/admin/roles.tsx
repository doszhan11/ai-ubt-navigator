import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [{ title: "Roles — Admin — AI UBT" }] }),
  component: () => <AppShell variant="admin"><RolesPage /></AppShell>,
});

type AppRole = "student" | "teacher" | "admin";

interface Row {
  id: string;
  full_name: string | null;
  roles: AppRole[];
}

function RolesPage() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id,full_name").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    const grouped: Record<string, AppRole[]> = {};
    (roles ?? []).forEach((r: any) => { grouped[r.user_id] = [...(grouped[r.user_id] ?? []), r.role]; });
    setRows((profiles ?? []).map((p: any) => ({ id: p.id, full_name: p.full_name, roles: grouped[p.id] ?? [] })));
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const setRole = async (userId: string, role: AppRole) => {
    setBusyId(userId);
    // Remove existing roles, set new one
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (delErr) { toast.error(delErr.message); setBusyId(null); return; }
    const { error: insErr } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (insErr) { toast.error(insErr.message); setBusyId(null); return; }
    toast.success(t("Рөл жаңартылды", "Role updated"));
    await load();
    setBusyId(null);
  };

  const filtered = rows.filter(r => !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold font-display">{t("Рөлдерді басқару", "Manage roles")}</h1>
      <p className="text-muted-foreground mt-1">{t("Кез келген қолданушыны студент, мұғалім немесе әкімші ете аласыз.", "Promote any user to student, teacher, or admin.")}</p>

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
                  <TableHead>{t("Қазіргі рөл", "Current")}</TableHead>
                  <TableHead className="text-right">{t("Әрекет", "Action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const current = r.roles[0] ?? null;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.full_name ?? r.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {current ? <Badge className={current === "admin" ? "bg-destructive text-destructive-foreground" : current === "teacher" ? "bg-accent text-accent-foreground" : ""}>{current}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          {(["student", "teacher", "admin"] as AppRole[]).map(rl => (
                            <Button key={rl} size="sm" variant={current === rl ? "default" : "outline"} disabled={busyId === r.id || current === rl} onClick={() => setRole(r.id, rl)}>
                              {rl}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
