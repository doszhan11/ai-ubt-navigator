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

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Sign up — AI UBT" },
      { name: "description", content: "Create your free AI UBT account and start preparing for the UNT today." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error(t("Құпия сөздер сәйкес келмейді", "Passwords don't match")); return; }
    if (password.length < 6) { toast.error(t("Кемінде 6 таңба", "At least 6 characters")); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: name },
      },
    });
    if (error) { toast.error(error.message); setBusy(false); return; }
    await refresh();
    toast.success(t("Есептік жазба құрылды!", "Account created!"));
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:block bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-spotlight/40 blur-3xl" />
        </div>
        <div className="relative h-full p-12 flex flex-col justify-between text-white">
          <Link to="/"><Logo size={32} light /></Link>
          <div>
            <h2 className="text-4xl font-extrabold font-display leading-tight">{t("Бір минутта бастаңыз.", "Get started in a minute.")}</h2>
            <p className="mt-3 text-white/70">{t("Несие картасы керек емес.", "No credit card required.")}</p>
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
              <h1 className="text-2xl font-extrabold font-display">{t("Тіркелу", "Create account")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("Тегін есептік жазба ашыңыз.", "Open your free account.")}</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">{t("Толық аты-жөні", "Full name")}</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">{t("Электрондық пошта", "Email")}</Label>
                  <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password">{t("Құпия сөз", "Password")}</Label>
                  <Input id="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="confirm">{t("Құпия сөзді растау", "Confirm password")}</Label>
                  <Input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-soft">
                  {busy ? t("Жасалуда…", "Creating…") : t("Жалғастыру", "Continue")}
                </Button>
              </form>
              <p className="mt-5 text-sm text-center text-muted-foreground">
                {t("Есептік жазбаңыз бар ма?", "Already have an account?")}{" "}
                <Link to="/login" className="font-semibold text-accent hover:underline">{t("Кіру", "Log in")}</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
