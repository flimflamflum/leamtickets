"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Ticket, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validations";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Registration failed. Please try again.");
        return;
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/auth/login");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters" },
    { label: "One uppercase letter" },
    { label: "One number" },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      {serverError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="name"
          type="text"
          label="Name"
          placeholder="Alex Smith"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <ul className="mt-2 space-y-1">
            {passwordRequirements.map((req) => (
              <li key={req.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3" />
                {req.label}
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <Ticket className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start selling tickets in minutes</p>
        </div>

        <Suspense fallback={
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 h-64 animate-pulse" />
        }>
          <RegisterForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-4 px-4">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}
