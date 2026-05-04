import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home, LogOut, Menu, X, LayoutDashboard, Users, ClipboardList, GraduationCap,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { to: string; icon: any; kz: string; en: string };

const STUDENT_NAV: NavItem[] = [
  { to: "/dashboard", icon: Home, kz: "Басты бет", en: "Home" },
];

const TEACHER_NAV: NavItem[] = [
  { to: "/teacher", icon: LayoutDashboard, kz: "Шолу", en: "Overview" },
  { to: "/teacher/students", icon: GraduationCap, kz: "Студенттер", en: "Students" },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", icon: LayoutDashboard, kz: "Шолу", en: "Overview" },
  { to: "/admin/users", icon: Users, kz: "Қолданушылар", en: "Users" },
  { to: "/admin/roles", icon: ClipboardList, kz: "Рөлдер", en: "Roles" },
];

interface AppShellProps {
  variant: "student" | "teacher" | "admin";
  children?: ReactNode;
}

export function AppShell({ variant, children }: AppShellProps) {
  const { profile, role, signOut, loading, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Role guard — wait for role to load before redirecting
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (!role) return; // role still loading
    if (variant === "admin" && role !== "admin") { navigate({ to: role === "teacher" ? "/teacher" : "/dashboard" }); return; }
    if (variant === "teacher" && role !== "teacher" && role !== "admin") { navigate({ to: "/dashboard" }); return; }
    if (variant === "student" && role === "admin") { navigate({ to: "/admin" }); return; }
    if (variant === "student" && role === "teacher") { navigate({ to: "/teacher" }); return; }
  }, [user, role, loading, variant, navigate]);

  const nav = variant === "student" ? STUDENT_NAV : variant === "teacher" ? TEACHER_NAV : ADMIN_NAV;

  if (loading || !user || !role) {
    return <div className="min-h-screen grid place-items-center bg-background"><div className="animate-pulse text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div></div>;
  }

  const initials = (profile?.full_name ?? user.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border"><Logo size={32} light /></div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                <Icon size={18} /><span>{t(item.kz, item.en)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <LanguageToggle />
          <button onClick={() => { void signOut().then(() => navigate({ to: "/" })); }} className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors w-full">
            <LogOut size={16} /> {t("Шығу", "Log out")}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <Logo size={28} light />
              <button onClick={() => setMobileOpen(false)} className="text-sidebar-foreground/70"><X size={20} /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {nav.map((item) => {
                const active = path === item.to || path.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70"}`}>
                    <Icon size={18} /><span>{t(item.kz, item.en)}</span>
                  </Link>
                );
              })}
            </nav>
            <LanguageToggle className="mt-4" />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden text-foreground/70" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="lg:hidden"><Logo size={26} /></div>
          <div className="flex-1" />
          <div className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-semibold uppercase">{role}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full hover:bg-muted p-1 pr-3 transition-colors">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-brand text-brand-foreground text-xs font-semibold">{initials}</AvatarFallback></Avatar>
                <span className="hidden sm:block text-sm font-medium">{profile?.full_name ?? user.email}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{profile?.full_name ?? user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { void signOut().then(() => navigate({ to: "/" })); }}>
                <LogOut size={14} className="mr-2" /> {t("Шығу", "Log out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-x-hidden">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
