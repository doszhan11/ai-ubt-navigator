export interface SubjectMeta {
  slug: string;
  name_en: string;
  name_kz: string;
  icon: string;
  color: string;
  scoreField: "score_qazaqstan_tarihy" | "score_oku_saattylyghy" | "score_math_saattylyghy" | "score_subject_1" | "score_subject_2";
}

export const MANDATORY_SUBJECTS: SubjectMeta[] = [
  { slug: "qazaqstan-tarihy", name_kz: "Қазақстан тарихы", name_en: "History of Kazakhstan", icon: "🏛️", color: "#6366F1", scoreField: "score_qazaqstan_tarihy" },
  { slug: "oku-saattylyghy", name_kz: "Оқу сауаттылығы", name_en: "Reading Literacy", icon: "📖", color: "#10B981", scoreField: "score_oku_saattylyghy" },
  { slug: "math-saattylyghy", name_kz: "Математикалық сауаттылық", name_en: "Mathematical Literacy", icon: "📐", color: "#F59E0B", scoreField: "score_math_saattylyghy" },
];

export function slugFor(name_en: string): string {
  return name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function iconForSubject(slug: string): string {
  const map: Record<string, string> = {
    "qazaqstan-tarihy": "🏛️", "oku-saattylyghy": "📖", "math-saattylyghy": "📐",
    mathematics: "🧮", physics: "⚛️", chemistry: "⚗️", biology: "🧬",
    geography: "🌍", "computer-science": "💻", "world-history": "🌐",
    "kazakh-language": "📜", "kazakh-literature": "📚",
    "russian-language": "📜", "russian-literature": "📚",
    "foreign-language": "🌐", "basics-of-law": "⚖️", creative: "🎨",
  };
  return map[slug] ?? "📘";
}
