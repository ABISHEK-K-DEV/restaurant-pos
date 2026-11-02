"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterDto } from "@restaurant-pos/types";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { StatusNote, useNoteToast } from "@/components/ui/status-note";
import { AuthFrame, AuthHeading } from "@/components/layout/auth-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const register = useRegister();
  const { note, clear, toast } = useNoteToast();
  const prefersReducedMotion = useReducedMotion();
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (dto: RegisterDto) => {
    register.mutate(dto, {
      onSuccess: () => router.push("/dashboard"),
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong");
      },
    });
  };

  return (
    <AuthFrame
      aside={
        <>
          Have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
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
        <AuthHeading eyebrow="Create account" title="Open your restaurant." subtitle="Set up your restaurant in under a minute." />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="restaurantName">Restaurant name</Label>
            <Input
              id="restaurantName"
              autoComplete="organization"
              placeholder="e.g. Spice Route"
              {...field("restaurantName")}
            />
            {errors.restaurantName && (
              <p className="text-xs text-destructive">{errors.restaurantName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="branchName">First branch name</Label>
            <Input
              id="branchName"
              placeholder="Main Branch"
              defaultValue="Main Branch"
              {...field("branchName")}
            />
            {errors.branchName && (
              <p className="text-xs text-destructive">{errors.branchName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ownerName">Your name</Label>
            <Input
              id="ownerName"
              autoComplete="name"
              placeholder="e.g. Priya Sharma"
              {...field("ownerName")}
            />
            {errors.ownerName && (
              <p className="text-xs text-destructive">{errors.ownerName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@restaurant.com"
              {...field("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...field("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <StatusNote note={note} onClear={clear} />
          <Button type="submit" className="mt-2 h-11 text-[14px]" disabled={register.isPending}>
            {register.isPending ? "Creating your account…" : "Create account"}
          </Button>
        </form>

      </motion.div>
    </AuthFrame>
  );
}
