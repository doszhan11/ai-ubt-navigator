import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — AI UBT" }] }),
  component: () => <AppShell variant="student"><Leaderboard /></AppShell>,
});

const FAKE = [
  { name: "Айгерім Серік", score: 132, pair: "Математика – Физика" },
  { name: "Ернар Қасымов", score: 128, pair: "Биология – Химия" },
  { name: "Дана Айтпай", score: 124, pair: "Математика – Информатика" },
  { name: "Алишер Б.", score: 119, pair: "Дүниежүзі тарихы – География" },
  { name: "Камила Н.", score: 115, pair: "Математика – Физика" },
];

function Leaderboard() {
  const { t } = useLanguage();
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold font-display flex items-center gap-2"><Trophy className="text-warning" />{t("Рейтинг", "Leaderboard")}</h1>
      <Card className="mt-6 border-border shadow-soft">
        <CardContent className="p-2">
          {FAKE.map((s, i) => (
            <div key={s.name} className={`flex items-center gap-4 p-3 rounded-lg ${i === 0 ? "bg-gradient-brand text-brand-foreground" : ""}`}>
              <div className="w-8 text-center font-bold">{i+1}</div>
              <div className="w-9 h-9 rounded-full bg-card text-foreground grid place-items-center text-sm font-bold border border-border">{s.name[0]}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{s.name}</div>
                <div className={`text-xs ${i === 0 ? "text-brand-foreground/80" : "text-muted-foreground"}`}>{s.pair}</div>
              </div>
              <div className="font-extrabold font-display">{s.score}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
