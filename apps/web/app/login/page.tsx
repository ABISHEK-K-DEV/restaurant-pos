"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginDto } from "@restaurant-pos/types";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { AuthFrame, AuthHeading } from "@/components/layout/auth-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  // Set once the server says this account uses two-factor authentication.
  const [needsCode, setNeedsCode] = useState(false);
  // Shown inline under the form (a toast vanishes before it can be read).
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (dto: LoginDto) => {
    setError(null);
    login.mutate(dto, {
      onSuccess: (data) => {
        // A delivery rider has no back-office screens: open their deliveries.
        const user = (data as { user?: { roleName?: string; permissions?: string[] } }).user;
        const rider = user?.roleName === "DELIVERY_STAFF" && user.permissions?.includes("delivery.rider");
        router.push(rider ? "/my-deliveries" : "/dashboard");
      },
      onError: (err) => {
        if (err instanceof ApiError && err.message === "TWO_FACTOR_REQUIRED") {
          setNeedsCode(true);
          return;
        }
        if (err instanceof ApiError && err.status >= 500) {
          setError("The server is having a problem right now. Please try again in a minute.");
        } else if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Can't reach the server. Check your internet connection and try again.");
        }
      },
    });
  };

  return (
    <AuthFrame
      aside={
        <>
          New restaurant?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <AuthHeading eyebrow="Sign in" title="Welcome back." subtitle="Sign in to manage your restaurant" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email or phone number</Label>
            <Input
              id="email"
              type="text"
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="next"
              autoFocus
              className="h-11 text-[14px]"
              placeholder="you@restaurant.com or phone number"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              
              autoComplete="current-password"
              enterKeyHint="go"
              className="h-11 text-[14px]"
              placeholder="Your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {needsCode && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="totp">Verification code</Label>
              <Input
                id="totp"
                inputMode="text"
                autoComplete="one-time-code"
                autoFocus
                placeholder="6-digit code or recovery code"
                {...register("totp")}
              />
              <p className="text-xs text-muted-foreground">
                Open your authenticator app, or use one of your recovery codes.
              </p>
              {errors.totp && <p className="text-xs text-destructive">{errors.totp.message}</p>}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="mt-2 h-12 text-base" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

      </motion.div>
    </AuthFrame>
  );
}
