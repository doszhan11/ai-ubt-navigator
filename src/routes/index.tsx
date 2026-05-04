import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain, Sparkles, BarChart3, Trophy, BookOpen, ClipboardCheck, ArrowRight, Check, Zap, Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI UBT — AI-powered UNT preparation for Kazakhstani students" },
      { name: "description", content: "Bilingual UNT prep with AI-graded homework, video lessons, live Nusqa Taldau and personalized analytics. Free to try." },
      { property: "og:title", content: "AI UBT — Smart UNT preparation" },
      { property: "og:description", content: "Бағдарламаны AI басқарады. Видео сабақтар, AI үй жұмысын тексеру және рейтинг." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useLanguage();
  const { user, role, studentProfile, loading } = useAuth();
  const navigate = useNavigate();

  // If logged in, push to right place
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (role === "admin") navigate({ to: "/admin" });
    else if (role === "teacher") navigate({ to: "/teacher" });
    else if (role === "student") navigate({ to: "/dashboard" });
  }, [user, role, studentProfile, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <Link to="/login"><Button variant="ghost" size="sm">{t("Кіру", "Log in")}</Button></Link>
            <Link to="/register"><Button size="sm" className="bg-gradient-brand text-brand-foreground hover:opacity-90 shadow-soft">{t("Бастау", "Get started")}</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-spotlight/40 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold mb-6">
              <Sparkles size={14} className="text-accent" />
              {t("AI басқаратын ҰБТ дайындығы", "AI-powered UNT preparation")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.05]">
              {t("Жоғары ҰБТ балы — ", "Higher UNT scores — ")}
              <span className="text-gradient-brand">{t("AI көмегімен", "with AI on your side")}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl">
              {t(
                "Видео сабақтар, AI тексеретін үй жұмысы, тірі Нұсқа талдау және әр студент үшін жеке аналитика. Қазақ және ағылшын тілдерінде.",
                "Video lessons, AI-graded homework, live Nusqa Taldau sessions and personalized analytics for every student. In Kazakh and English."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90">
                  {t("Тегін бастау", "Start free")} <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <a href="#features"><Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">{t("Толығырақ", "Learn more")}</Button></a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2"><Check size={16} className="text-accent" />{t("Несие картасы керек емес", "No credit card required")}</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-accent" />{t("2 тіл: KZ / EN", "2 languages: KZ / EN")}</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-accent" />{t("Барлық 13 пән жұбы", "All 13 subject pairs")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "2 000+", k: t("Студент", "Students") },
            { v: "13", k: t("Пән жұбы", "Subject pairs") },
            { v: "AI", k: t("Үй жұмысын тексеру", "Homework grading") },
            { v: "24/7", k: t("Қолжетімділік", "Availability") },
          ].map((s) => (
            <div key={s.k} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-gradient-brand font-display">{s.v}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">{t("Не үшін AI UBT?", "Why AI UBT?")}</h2>
            <p className="mt-4 text-muted-foreground">{t("ҰБТ-ға дайындалудың ең тиімді жолы — әр оқушыға бейімделген.", "The smartest way to prepare for the UNT — adapted to every student.")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BookOpen, kz: "Видео сабақтар", en: "Video lessons", dkz: "Жоғары сапалы видеолар әр пән үшін.", den: "High quality videos for each subject." },
              { icon: Brain, kz: "AI үй жұмысы", en: "AI homework grading", dkz: "AI секундтарда бағалап, кері байланыс береді.", den: "AI grades and gives feedback in seconds." },
              { icon: Sparkles, kz: "Нұсқа талдау", en: "Nusqa Taldau", dkz: "Тірі AI сессиялар нақты ҰБТ нұсқаларын талдайды.", den: "Live AI sessions analyzing real UNT variants." },
              { icon: BarChart3, kz: "Аналитика", en: "Progress analytics", dkz: "Радар диаграммасы әлсіз тұстарыңызды көрсетеді.", den: "A radar chart highlights your weak areas." },
              { icon: ClipboardCheck, kz: "Шынайы тесттер", en: "Practice tests", dkz: "ҰБТ форматындағы шынайы нұсқалар.", den: "Authentic UNT-format mock tests." },
              { icon: Zap, kz: "Жеке кеңес", en: "Personalized recs", dkz: "AI келесі қандай тақырыпты оқу керек екенін айтады.", den: "AI tells you exactly what to study next." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.en} className="border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-xl bg-gradient-brand grid place-items-center text-brand-foreground mb-4 shadow-soft">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-lg">{t(f.kz, f.en)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(f.dkz, f.den)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-center mb-12">{t("Студенттер не дейді", "What students say")}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Айгерім", grade: "11 сынып", kz: "Радар диаграммам менің әлсіз тұсым физика екенін көрсетті. Бір айда +18 балл алдым.", en: "The radar chart showed Physics was my weak spot. I gained +18 points in a month." },
              { name: "Ернар", grade: "11 сынып", kz: "Нұсқа талдау сессиялар алтын. Әр аптада жаңа стратегиялар үйренемін.", en: "The Nusqa Taldau sessions are gold. I learn new strategies every week." },
              { name: "Дана", grade: "11 сынып", kz: "AI үй жұмысы тексеретіндіктен, түнде де жаттыға аламын.", en: "Because AI grades the homework, I can practice even at night." },
            ].map((tt) => (
              <Card key={tt.name} className="shadow-soft border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 text-warning mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                  <p className="text-sm leading-relaxed">&ldquo;{t(tt.kz, tt.en)}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground text-sm font-bold">{tt.name[0]}</div>
                    <div>
                      <div className="text-sm font-semibold">{tt.name}</div>
                      <div className="text-xs text-muted-foreground">{t(tt.grade, "11th grade")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">{t("Қарапайым баға", "Simple pricing")}</h2>
            <p className="mt-3 text-muted-foreground">{t("Тегін бастаңыз, дайын болғанда жаңартыңыз.", "Start free, upgrade when ready.")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="border-border shadow-soft">
              <CardContent className="p-8">
                <div className="text-sm font-semibold text-muted-foreground">{t("Тегін", "Free")}</div>
                <div className="mt-2 text-4xl font-extrabold font-display">0 ₸</div>
                <div className="text-sm text-muted-foreground">{t("әр айда", "/ month")}</div>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    t("3 негізгі пән", "3 mandatory subjects"),
                    t("Айына 2 тест", "2 tests per month"),
                    t("Негізгі аналитика", "Basic analytics"),
                  ].map(x => <li key={x} className="flex gap-2"><Check size={16} className="text-accent shrink-0 mt-0.5" />{x}</li>)}
                </ul>
                <Link to="/register"><Button variant="outline" className="w-full mt-8">{t("Тегін бастау", "Start free")}</Button></Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent shadow-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-bl-lg">★ {t("Танымал", "Popular")}</div>
              <CardContent className="p-8">
                <div className="text-sm font-semibold text-accent">{t("Премиум", "Premium")}</div>
                <div className="mt-2 text-4xl font-extrabold font-display">2 990 ₸</div>
                <div className="text-sm text-muted-foreground">{t("әр айда", "/ month")}</div>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    t("Барлық 5 пәнге қол жеткізу", "Access to all 5 subjects"),
                    t("Шексіз тесттер", "Unlimited tests"),
                    t("AI үй жұмысын тексеру", "AI homework grading"),
                    t("Нұсқа талдау сессиялары", "Nusqa Taldau sessions"),
                    t("Толық аналитика + радар", "Full analytics + radar chart"),
                    t("PDF конспектілер", "PDF study notes"),
                  ].map(x => <li key={x} className="flex gap-2"><Check size={16} className="text-accent shrink-0 mt-0.5" />{x}</li>)}
                </ul>
                <Link to="/register"><Button className="w-full mt-8 bg-gradient-brand text-brand-foreground shadow-soft hover:opacity-90">{t("Премиумды алу", "Get Premium")}</Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Trophy className="mx-auto text-accent mb-4" size={42} />
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">{t("Жоғары балыңызды бүгін бастаңыз", "Start your higher score today")}</h2>
          <p className="mt-3 text-white/80">{t("Бір минутта тіркеліңіз. Несие картасы керек емес.", "Sign up in a minute. No credit card needed.")}</p>
          <Link to="/register"><Button size="lg" className="mt-6 bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90">{t("Тегін есептік жазба ашу", "Create free account")}</Button></Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={26} />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AI UBT. {t("Барлық құқықтар қорғалған.", "All rights reserved.")}</p>
        </div>
      </footer>
    </div>
  );
}
