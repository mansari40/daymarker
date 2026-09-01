import { Reveal } from "@/components/ui/Reveal";

const testimonials = [
  {
    quote: "I stopped planning my whole week and started planning my day. It changed everything.",
    name: "Sarah K.",
    role: "Freelance Designer",
  },
  {
    quote: "The streak is addictive. Not in a stressful way — in a 'I don't want to break the chain' way.",
    name: "Marcus T.",
    role: "Software Engineer",
  },
  {
    quote: "It's the opposite of a productivity app. It tells me to do less, and I actually get more done.",
    name: "Priya R.",
    role: "Product Manager",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="text-center">
            <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
              Quiet voices
            </span>
            <h2 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-text-primary">
              People who made a mark.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.1 + i * 0.12}>
              <div className="flex flex-col justify-between rounded-[--radius-lg] border border-border-subtle bg-bg-panel p-6 h-full">
                <p className="text-body leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-border-subtle pt-4">
                  <p className="text-small font-semibold text-text-primary">{t.name}</p>
                  <p className="text-small text-text-tertiary">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
