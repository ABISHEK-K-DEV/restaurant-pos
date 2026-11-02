import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

// Shown at "/" once this self-hosted instance already has a restaurant set
// up (see useSetupStatus / MarketingHomePage) — the full marketing pitch
// only makes sense for an unclaimed install; a live instance's public root
// should get a returning staff member to Sign in fast, with a way to reach
// the docs, not a repeat of the product's own sales page.
export function ClaimedLanding() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <span className="flex items-center gap-2.5">
          <Logo size={28} className="rounded-md" />
          <span className="font-heading text-[15px] font-semibold tracking-[-0.015em]">Restaurant POS</span>
        </span>
        <span className="eyebrow flex items-center gap-2 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
          Instance online
        </span>
      </header>

      <main id="main-content" className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-24 lg:px-8">
        <p className="eyebrow flex items-center gap-2.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 bg-brand" aria-hidden />
          Staff access
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-[48px] leading-[0.95] font-semibold tracking-[-0.045em] text-foreground sm:text-[80px]">
          Ready for service<span className="text-brand">.</span>
        </h1>
        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          This instance is already set up. Sign in to your dashboard, or read the documentation.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-12 px-6 text-[15px]" render={<Link href="/login" />}>
            Sign in
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-6 text-[15px]" render={<Link href="/docs" />}>
            Documentation
          </Button>
        </div>
      </main>
    </div>
  );
}
