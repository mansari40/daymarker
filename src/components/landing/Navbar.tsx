import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-500">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-body font-medium text-text-primary">daymark</span>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#ritual" className="text-small text-text-secondary hover:text-text-primary transition-colors">
            The ritual
          </a>
          <a href="#principles" className="text-small text-text-secondary hover:text-text-primary transition-colors">
            Principles
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/signin" className="text-small text-text-secondary hover:text-text-primary transition-colors">
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm" trailing>
              Begin today
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
