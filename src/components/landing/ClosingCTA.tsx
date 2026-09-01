import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ClosingCTA() {
  return (
    <section className="border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
                Your next good day
              </span>
              <h2 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-text-primary">
                Start with one<br />clear mark.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex items-end justify-start md:justify-end">
              <div className="flex flex-col items-start gap-4 md:items-end">
                <p className="text-body text-text-secondary">
                  It starts with a single intention.
                </p>
                <Link href="/signup">
                  <Button trailing>Create your day</Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
