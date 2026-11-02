import { FileCheck2, Lock, ScanEye, ServerCog } from "lucide-react";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { SectionHeader } from "@/components/marketing/section-header";

const points = [
  {
    icon: Lock,
    title: "Hardened by default",
    description:
      "bcrypt password hashing, rate-limited login/PIN, httpOnly session cookies, and strict tenant isolation on every query.",
  },
  {
    icon: ServerCog,
    title: "Server-authoritative money",
    description:
      "Prices, tax, discounts, and totals are always recomputed server-side — checkout and refunds are race-condition safe under concurrent requests.",
  },
  {
    icon: ScanEye,
    title: "Your data stays on your server",
    description:
      "Self-hosted on your own LAN or VPS — no restaurant or customer data is ever sent to a third-party cloud you don't control.",
  },
  {
    icon: FileCheck2,
    title: "Documented compliance posture",
    description:
      "Written accessibility and India data-protection notes — not a marketing claim, an actual document you can read.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="bg-[#0A0A0A] px-4 py-24 text-[#F5F5F2] sm:px-6 sm:py-32 lg:px-8 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl [--foreground:#F5F5F2] [--muted-foreground:#9A9A95] [--border:#262626]">
        <SectionHeader
          index="03"
          label="Security"
          title={
            <>
              Security isn&rsquo;t a checkbox here<span className="text-brand">.</span>
            </>
          }
          description="Every module went through a real audit pass before this page did. Read the details — don’t just take our word for it."
        />

        <RevealGroup className="mt-16 grid sm:grid-cols-2">
          {points.map((p, i) => (
            <RevealItem
              key={p.title}
              className="flex gap-6 border-t border-[#262626] py-8 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
            >
              <span className="font-mono text-[11px] text-brand">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="flex items-center gap-2.5 font-heading text-[19px] font-semibold tracking-[-0.02em]">
                  <p.icon className="size-4 text-[#9A9A95]" strokeWidth={1.7} />
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#9A9A95]">{p.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#262626] pt-8">
          <Link
            href="/docs/accessibility"
            className="text-sm font-medium underline decoration-brand decoration-2 underline-offset-[6px] hover:text-white"
          >
            Accessibility statement &rarr;
          </Link>
          <Link
            href="/docs/compliance-india"
            className="text-sm font-medium underline decoration-brand decoration-2 underline-offset-[6px] hover:text-white"
          >
            India compliance notes &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
