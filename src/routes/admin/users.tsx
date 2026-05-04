import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin — AI UBT" }] }),
  component: () => <AppShell variant="admin"><UsersPage /></AppShell>,
});

type Role = "student" | "teacher" | "admin";
interface UserRow {
  id: string;
  full_name: string | null;
  language: string;
  created_at: string;
  role: Role | null;
}

function UsersPage() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id,full_name,language,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    const roleMap = new Map<string, Role>();
    (roles ?? []).forEach((r: any) => {
      const cur = roleMap.get(r.user_id);
      // priority: admin > teacher > student
      const rank = (x: Role) => (x === "admin" ? 3 : x === "teacher" ? 2 : 1);
      if (!cur || rank(r.role) > rank(cur)) roleMap.set(r.user_id, r.role);
    });
    setRows((profiles ?? []).map((p: any) => ({ ...p, role: roleMap.get(p.id) ?? null })));
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const changeRole = async (userId: string, newRole: Role) => {
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (delErr) { toast.error(delErr.message); return; }
    const { error: insErr } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (insErr) { toast.error(insErr.message); return; }
    toast.success(t("Рөл жаңартылды", "Role updated"));
    void load();
  };

  const filtered = rows.filter((r) =>
    !filter || (r.full_name ?? "").toLowerCase().includes(filter.toLowerCase()) || r.id.includes(filter)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{t("Қолданушылар", "Users")}</h1>
          <p className="text-muted-foreground mt-1">{t("Барлық тіркелген пайдаланушылар және олардың рөлдері.", "All registered users and their roles.")}</p>
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
            <div className="p-8 text-center text-muted-foreground">{t("Пайдаланушы табылмады.", "No users found.")}</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 sm:p-5 flex items-center gap-4 flex-wrap">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand text-brand-foreground grid place-items-center font-bold text-sm shrink-0">
                    {(u.full_name ?? "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{u.full_name ?? t("Атаусыз", "Unnamed")}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.id}</div>
                  </div>
                  <Badge variant={u.role === "admin" ? "default" : u.role === "teacher" ? "secondary" : "outline"} className="capitalize">
                    {u.role ?? "—"}
                  </Badge>
                  <Select value={u.role ?? undefined} onValueChange={(v) => changeRole(u.id, v as Role)}>
                    <SelectTrigger className="w-36"><SelectValue placeholder={t("Рөл өзгерту", "Change role")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t("Оқушы", "Student")}</SelectItem>
                      <SelectItem value="teacher">{t("Мұғалім", "Teacher")}</SelectItem>
                      <SelectItem value="admin">{t("Әкімші", "Admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={() => void load()}>{t("Жаңарту", "Refresh")}</Button>
      </div>
    </div>
  );
}
