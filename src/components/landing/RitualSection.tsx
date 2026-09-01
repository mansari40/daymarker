import { Reveal } from "@/components/ui/Reveal";

export function RitualSection() {
  return (
    <section id="ritual" className="border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left */}
          <Reveal direction="left">
            <div>
              <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
                The small ritual
              </span>
              <h2 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-text-primary">
                Less list.<br />More day.
              </h2>
            </div>
          </Reveal>
          {/* Right */}
          <Reveal direction="right" delay={0.15}>
            <div className="flex items-end">
              <p className="max-w-md text-body leading-relaxed text-text-secondary">
                Every morning, you name one thing. One clear intention that makes the
                day feel complete. No noise, no overwhelm — just the next right thing.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="border-t border-border-subtle" />
    </section>
  );
}
