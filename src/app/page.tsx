import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { RitualSection } from "@/components/landing/RitualSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <main>
        <Hero />
        <RitualSection />
        <FeaturesSection />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
