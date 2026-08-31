"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AuthCardProps {
  mode: "signup" | "signin";
  onSubmit: (data: { name?: string; email: string; password: string }) => Promise<void>;
  error?: string;
}

export function AuthCard({ mode, onSubmit, error }: AuthCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-8">
      <h2 className="text-h2 font-bold text-text-primary">
        {mode === "signup" ? "Create your space" : "Welcome back"}
      </h2>
      <p className="mt-1 text-small text-text-secondary">
        {mode === "signup"
          ? "It takes less than a minute."
          : "Sign in to pick up where you left off."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        {mode === "signup" && (
          <Input
            label="Your name"
            type="text"
            placeholder="Jane"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <p className="text-small text-red-400">{error}</p>
        )}

        <Button
          type="submit"
          trailing
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading
            ? "Working..."
            : mode === "signup"
            ? "Create my day"
            : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-small text-text-tertiary">
        {mode === "signup" ? (
          <>
            Already have a space?{" "}
            <a href="/signin" className="text-text-secondary hover:text-text-primary transition-colors">
              Sign in
            </a>
          </>
        ) : (
          <>
            Don&apos;t have a space?{" "}
            <a href="/signup" className="text-text-secondary hover:text-text-primary transition-colors">
              Create one
            </a>
          </>
        )}
      </p>
    </div>
  );
}
