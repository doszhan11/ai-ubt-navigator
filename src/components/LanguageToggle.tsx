import { Button } from "@/components/ui/button";
import { useLanguage, type Lang } from "@/lib/i18n";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const Btn = ({ value, label }: { value: Lang; label: string }) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
        lang === value ? "bg-foreground text-background shadow-soft" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className={`inline-flex items-center gap-0.5 rounded-lg border bg-background/60 backdrop-blur p-0.5 ${className ?? ""}`}>
      <Btn value="kz" label="KZ" />
      <Btn value="en" label="EN" />
    </div>
  );
}

// Re-export Button to satisfy unused import if needed
export { Button };
