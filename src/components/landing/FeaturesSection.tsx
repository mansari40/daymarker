import { Flag, Clock, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    number: "01",
    icon: Flag,
    title: "One task at a time",
    description: "No backlogs, no priority tiers. Just one mark per day.",
  },
  {
    number: "02",
    icon: Clock,
    title: "Time-aware",
    description: "Morning, afternoon, or evening — schedule with intention.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Streak-driven",
    description: "Watch your consistency build. Small marks add up.",
  },
];

export function FeaturesSection() {
  return (
    <section id="principles" className="border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
                Built for attention
              </span>
              <h2 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-text-primary">
                A few good<br />defaults.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-end">
              <p className="text-small text-text-tertiary">
                Thoughtful by design<br />quiet by nature
              </p>
            </div>
          </Reveal>
        </div>

        {/* Feature row */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-border-subtle pt-12 sm:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.number} delay={0.1 + i * 0.12}>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <span className="text-label font-semibold uppercase tracking-widest text-text-tertiary">
                    {feature.number}
                  </span>
                  <feature.icon size={16} className="text-text-tertiary" />
                </div>
                <div className="border-t border-border-subtle" />
                <h3 className="text-body font-bold text-text-primary">{feature.title}</h3>
                <p className="text-small text-text-secondary">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
