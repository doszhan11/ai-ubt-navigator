import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Home, BookOpen, ClipboardList, FlaskConical, Sparkles, Trophy, User, LogOut, Bell, Menu, X,
  LayoutDashboard, Users, Calendar, CreditCard, FileVideo, MessageSquareWarning, BarChart3,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { to: string; icon: any; kz: string; en: string };

const STUDENT_NAV: NavItem[] = [
  { to: "/dashboard", icon: Home, kz: "Бақылау тақтасы", en: "Dashboard" },
  { to: "/subjects", icon: BookOpen, kz: "Менің пәндерім", en: "My Subjects" },
  { to: "/homework", icon: ClipboardList, kz: "Үй жұмысы", en: "Homework" },
  { to: "/tests", icon: FlaskConical, kz: "Тесттер", en: "Practice Tests" },
  { to: "/nusqa", icon: Sparkles, kz: "Нұсқа талдау", en: "Nusqa Taldau" },
  { to: "/leaderboard", icon: Trophy, kz: "Рейтинг", en: "Leaderboard" },
  { to: "/profile", icon: User, kz: "Профиль", en: "Profile" },
];

const TEACHER_NAV: NavItem[] = [
  { to: "/teacher", icon: LayoutDashboard, kz: "Бақылау тақтасы", en: "Dashboard" },
  { to: "/teacher/lessons", icon: FileVideo, kz: "Сабақтар", en: "Lessons" },
  { to: "/teacher/homework", icon: ClipboardList, kz: "Тапсырмалар", en: "Homework Reviews" },
  { to: "/teacher/reports", icon: MessageSquareWarning, kz: "Қате есептері", en: "Error Reports" },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", icon: BarChart3, kz: "Шолу", en: "Overview" },
  { to: "/admin/users", icon: Users, kz: "Қолданушылар", en: "Users" },
  { to: "/admin/schedule", icon: Calendar, kz: "Кесте", en: "Schedule" },
  { to: "/admin/subscriptions", icon: CreditCard, kz: "Жазылымдар", en: "Subscriptions" },
];

interface AppShellProps {
  variant: "student" | "teacher" | "admin";
  children?: ReactNode;
}

export function AppShell({ variant, children }: AppShellProps) {
  const { profile, role, signOut, loading, user, studentProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Role guard
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (variant === "admin" && role !== "admin") { navigate({ to: "/dashboard" }); return; }
    if (variant === "teacher" && role !== "teacher" && role !== "admin") { navigate({ to: "/dashboard" }); return; }
    if (variant === "student" && role === "admin") { navigate({ to: "/admin" }); return; }
    if (variant === "student" && role === "teacher") { navigate({ to: "/teacher" }); return; }
    if (variant === "student" && role === "student" && studentProfile && !studentProfile.onboarded) {
      navigate({ to: "/onboarding" });
    }
  }, [user, role, loading, variant, navigate, studentProfile]);

  const nav = variant === "student" ? STUDENT_NAV : variant === "teacher" ? TEACHER_NAV : ADMIN_NAV;

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center bg-background"><div className="animate-pulse text-muted-foreground">{t("Жүктелуде…", "Loading…")}</div></div>;
  }

  const initials = (profile?.full_name ?? user.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <Logo size={32} light />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={18} />
                <span>{t(item.kz, item.en)}</span>
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

      {/* Mobile drawer */}
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
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden text-foreground/70" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="lg:hidden"><Logo size={26} /></div>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
          </Button>
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
              {variant === "student" && (
                <DropdownMenuItem asChild><Link to="/profile">{t("Профиль", "Profile")}</Link></DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => { void signOut().then(() => navigate({ to: "/" })); }}>
                <LogOut size={14} className="mr-2" /> {t("Шығу", "Log out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">
          {children ?? <Outlet />}
        </main>

        {/* Mobile bottom nav (student only) */}
        {variant === "student" && (
          <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around py-2 px-1">
            {STUDENT_NAV.slice(0, 5).map((item) => {
              const active = path === item.to || path.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${active ? "text-accent" : "text-muted-foreground"}`}>
                  <Icon size={20} />
                  <span className="text-[10px] font-medium leading-none">{t(item.kz, item.en).split(" ")[0]}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
