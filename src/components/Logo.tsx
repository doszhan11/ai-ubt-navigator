import { GraduationCap } from "lucide-react";

export function Logo({ size = 28, withText = true, light = false }: { size?: number; withText?: boolean; light?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className="grid place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-soft"
        style={{ width: size, height: size }}
      >
        <GraduationCap size={Math.round(size * 0.6)} strokeWidth={2.5} />
      </div>
      {withText && (
        <span className={`font-display font-extrabold tracking-tight ${light ? "text-white" : "text-foreground"}`} style={{ fontSize: Math.round(size * 0.6) }}>
          AI <span className="text-gradient-brand">UBT</span>
        </span>
      )}
    </div>
  );
}
