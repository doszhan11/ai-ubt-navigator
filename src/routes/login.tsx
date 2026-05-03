import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — AI UBT" },
      { name: "description", content: "Log in to your AI UBT account to continue your UNT preparation." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    await refresh();
    toast.success(t("Қош келдіңіз!", "Welcome back!"));
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:block bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
        </div>
        <div className="relative h-full p-12 flex flex-col justify-between text-white">
          <Link to="/"><Logo size={32} light /></Link>
          <div>
            <h2 className="text-4xl font-extrabold font-display leading-tight">{t("Жоғары ҰБТ балына жол.", "Your path to a higher UNT score.")}</h2>
            <p className="mt-3 text-white/70">{t("AI көмегімен әр күн жетілдіріңіз.", "Improve every day with AI.")}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-12">
        <div className="flex items-center justify-between">
          <div className="lg:hidden"><Link to="/"><Logo size={28} /></Link></div>
          <LanguageToggle className="ml-auto" />
        </div>
        <div className="flex-1 grid place-items-center">
          <Card className="w-full max-w-sm border-border shadow-elevated">
            <CardContent className="p-7">
              <h1 className="text-2xl font-extrabold font-display">{t("Кіру", "Log in")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("Жалғастыру үшін есептік жазбаңызға кіріңіз.", "Sign in to your account to continue.")}</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email">{t("Электрондық пошта", "Email")}</Label>
                  <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password">{t("Құпия сөз", "Password")}</Label>
                  <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-soft">
                  {busy ? t("Кіруде…", "Signing in…") : t("Кіру", "Log in")}
                </Button>
              </form>
              <p className="mt-5 text-sm text-center text-muted-foreground">
                {t("Есептік жазбаңыз жоқ па?", "Don't have an account?")}{" "}
                <Link to="/register" className="font-semibold text-accent hover:underline">{t("Тіркелу", "Register")}</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
