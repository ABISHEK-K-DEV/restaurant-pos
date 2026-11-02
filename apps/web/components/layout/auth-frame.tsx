import Link from "next/link";
import { Logo } from "@/components/layout/logo";

const MODULES = [
  ["01", "Point of sale"],
  ["02", "Kitchen display"],
  ["03", "Tables & bookings"],
  ["04", "Stock & reports"],
] as const;

/**
 * Left half of the sign-in / sign-up screens: a Swiss poster in ink — grid
 * paper, one red square, oversized type, a numbered index of the modules.
 * Decorative only; hidden below lg where the form takes the full width.
 */
function AuthPoster() {
  return (
    <aside
      aria-hidden
      className="relative hidden overflow-hidden bg-[#0A0A0A] text-[#F5F5F2] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: "right top",
        }}
      />
      <div className="absolute top-0 right-0 h-32 w-32 bg-[#E3000F]" />

      <div className="relative flex items-center gap-3">
        <Logo size={36} className="rounded-md" />
        <div className="flex flex-col">
          <span className="font-heading text-[15px] font-semibold tracking-[-0.01em]">Restaurant POS</span>
          <span className="eyebrow mt-1 text-[#8A8A85]">Self-hosted · Offline-first</span>
        </div>
      </div>

      <div className="relative">
        <p className="eyebrow mb-6 text-[#8A8A85]">Restaurant operating system</p>
        <p className="font-display text-[64px] leading-[0.92] font-semibold tracking-[-0.045em] xl:text-[88px]">
          Every table.
          <br />
          Every ticket.
          <br />
          In order<span className="text-[#E3000F]">.</span>
        </p>
      </div>

      <div className="relative grid grid-cols-4 gap-6 border-t border-white/15 pt-6">
        {MODULES.map(([n, label]) => (
          <div key={n} className="flex flex-col gap-2">
            <span className="font-mono text-[11px] text-[#E3000F]">{n}</span>
            <span className="text-[13px] leading-snug text-[#F5F5F2]/80">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function AuthFrame({
  children,
  aside,
}: {
  children: React.ReactNode;
  /** Small link shown top-right (e.g. "New here? Create an account"). */
  aside?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh flex-1 bg-background lg:grid-cols-[1.1fr_1fr]">
      <AuthPoster />
      <section className="flex min-h-dvh flex-col px-6 py-6 sm:px-10 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <Logo size={28} className="rounded-md" />
            <span className="hidden font-heading text-[14px] font-semibold tracking-[-0.01em] whitespace-nowrap sm:inline">Restaurant POS</span>
          </Link>
          {aside && <div className="text-right text-[13px] text-muted-foreground">{aside}</div>}
        </div>
        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-12">{children}</div>
        <p className="eyebrow text-muted-foreground">© {new Date().getFullYear()} Abishek K · AGPL-3.0</p>
      </section>
    </main>
  );
}

export function AuthHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <span className="eyebrow flex items-center gap-2 text-muted-foreground">
        <span className="h-1.5 w-1.5 bg-brand" aria-hidden />
        {eyebrow}
      </span>
      <h1 className="font-display text-[40px] leading-[1] font-semibold tracking-[-0.04em] text-foreground">
        {title}
      </h1>
      <p className="text-[14px] text-muted-foreground">{subtitle}</p>
    </div>
  );
}
