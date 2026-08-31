import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center pt-16">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-8">
        {/* Left: copy */}
        <div className="flex flex-col justify-center gap-8">
          {/* Eyebrow pill */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-accent-muted px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
              A quieter way to plan
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display font-bold leading-[1.05] tracking-tight text-text-primary">
            Make a mark<br />
            <span className="text-accent-400">of today.</span>
          </h1>

          {/* Supporting paragraph */}
          <p className="max-w-md text-body leading-relaxed text-text-secondary">
            Not another to-do list. A small, daily ritual — one clear intention,
            then the rest of the day follows.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-6">
            <Link href="/signup">
              <Button trailing>Start your ritual</Button>
            </Link>
            <Link href="/signin" className="text-small text-text-secondary hover:text-text-primary transition-colors">
              I already have a mark
            </Link>
          </div>
        </div>

        {/* Right: floating card mockup */}
        <div className="relative hidden items-center justify-center md:flex">
          <div className="relative rotate-2 rounded-[--radius-lg] border border-border-subtle bg-bg-panel p-6 shadow-lg">
            {/* Mini task list card */}
            <div className="flex items-center gap-3 pb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-500">
                <Check size={10} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-small font-medium text-text-primary">daymark</span>
            </div>
            <div className="space-y-2">
              {[
                { done: true, text: "Morning walk" },
                { done: false, text: "Write 200 words" },
                { done: false, text: "Water the plants" },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-bg-base/50 px-3 py-2">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      task.done
                        ? "border-accent-500 bg-accent-500"
                        : "border-border-strong"
                    }`}
                  >
                    {task.done && <Check size={8} className="text-white" strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-small ${
                      task.done ? "text-text-tertiary line-through" : "text-text-primary"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Offset decorative card */}
          <div className="absolute -bottom-4 -right-4 rotate-[-3deg] rounded-[--radius-lg] border border-border-subtle bg-bg-panel p-4 shadow-lg opacity-60">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full border border-border-strong" />
              <div className="h-2.5 w-24 rounded bg-bg-panel-hover" />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full border border-border-strong" />
              <div className="h-2.5 w-20 rounded bg-bg-panel-hover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
