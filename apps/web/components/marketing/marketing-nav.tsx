"use client";

import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { downloadHref } from "@/lib/downloads";

const links = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
  { href: "#get-started", label: "Install" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} className="rounded-md" />
          <span className="font-heading text-[15px] font-semibold tracking-[-0.015em] text-foreground">
            Restaurant POS
          </span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="group flex items-baseline gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-mono text-[10px] text-muted-foreground/60 group-hover:text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <a
            href={downloadHref("github")}
            aria-label="GitHub"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="size-4" />
          </a>
          <Button variant="ghost" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button render={<Link href="/signup" />}>Get started</Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <nav className="flex flex-col pt-2">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-3 border-b border-border py-3 text-[15px] text-foreground"
              >
                <span className="font-mono text-[10px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" render={<Link href="/login" />}>
                Sign in
              </Button>
              <Button render={<Link href="/signup" />}>Get started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
