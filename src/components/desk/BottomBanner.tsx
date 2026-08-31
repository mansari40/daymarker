import { Calendar } from "lucide-react";

export function BottomBanner() {
  return (
    <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4 text-small text-text-tertiary">
      <div className="flex items-center gap-2">
        <Calendar size={14} />
        <span>A day is made of small marks.</span>
      </div>
      <span>Keep it kind. Keep it moving.</span>
    </div>
  );
}
