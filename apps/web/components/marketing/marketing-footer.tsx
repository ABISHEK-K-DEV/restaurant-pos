import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { downloadHref } from "@/lib/downloads";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#security", label: "Security" },
      { href: "#get-started", label: "Get started" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: downloadHref("github"), label: "GitHub" },
      { href: "/docs/api", label: "API & MCP" },
      { href: "/docs/accessibility", label: "Accessibility statement" },
      { href: "/docs/compliance-india", label: "India compliance notes" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-[#0A0A0A] px-4 pt-20 pb-10 text-[#F5F5F2] sm:px-6 lg:px-8 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={28} className="rounded-md" />
              <span className="font-heading text-[15px] font-semibold tracking-[-0.015em]">Restaurant POS</span>
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-[#9A9A95]">
              Offline-first restaurant management, self-hosted on your own server.
              Designed and maintained by Abishek K.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="eyebrow text-[#77776F]">{col.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14px] text-[#D4D4CE] transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          aria-hidden
          className="mt-24 font-display text-[clamp(56px,13vw,200px)] leading-[0.82] font-semibold tracking-[-0.055em] text-[#F5F5F2]"
        >
          Restaurant POS<span className="text-brand">.</span>
        </p>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#262626] pt-6 sm:flex-row">
          <p className="eyebrow text-[#77776F]">&copy; {new Date().getFullYear()} Abishek K · Licensed AGPL-3.0</p>
          <p className="eyebrow text-[#77776F]">Self-hosted · Offline-first · Open source</p>
        </div>
      </div>
    </footer>
  );
}
