"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Check } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();

  const handleSignup = async ({
    name,
    email,
    password,
  }: {
    name?: string;
    email: string;
    password: string;
  }) => {
    setError(undefined);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    // Auto sign-in after registration
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      setError("Account created but sign-in failed. Try signing in manually.");
      return;
    }

    router.push("/desk");
  };

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-500">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-body font-medium text-text-primary">Daymarker</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-small text-text-secondary hover:text-text-primary transition-colors">
            ← Back
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Left copy */}
      <div className="hidden flex-1 items-center justify-center p-12 lg:flex">
        <div className="max-w-md">
          <span className="text-label font-semibold uppercase tracking-widest text-accent-400">
            Daymarker / Begin here
          </span>
          <h1 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-text-primary">
            Make today<br />
            <span className="text-accent-400">count.</span>
          </h1>
          <p className="mt-4 text-body text-text-secondary">
            One clear intention, every morning.
          </p>
          <div className="mt-6 flex items-center gap-3 text-small text-text-secondary">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-muted">
              <Check size={12} className="text-accent-400" />
            </div>
            No noise. Just your next right thing.
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="flex flex-1 items-center justify-center p-6 pt-20 lg:p-12">
        <AuthCard mode="signup" onSubmit={handleSignup} error={error} />
      </div>
    </div>
  );
}
