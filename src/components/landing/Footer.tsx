import { Check } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-500">
            <Check size={10} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-small font-medium text-text-primary">daymark</span>
        </div>
        <div className="flex items-center gap-2 text-small text-text-tertiary">
          <span>Made for the next right thing.</span>
          <span className="text-text-tertiary">·</span>
        </div>
      </div>
    </footer>
  );
}
