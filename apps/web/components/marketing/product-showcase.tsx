"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeader } from "@/components/marketing/section-header";

const views = [
  { id: "dashboard", label: "Dashboard", src: "/screenshots/dashboard-light.png" },
  { id: "pos", label: "POS", src: "/screenshots/pos-light.png" },
  { id: "kds", label: "Kitchen display", src: "/screenshots/kds-light.png" },
  { id: "tables", label: "Tables", src: "/screenshots/tables-light.png" },
] as const;

// Real product screenshots (docs/screenshots/*.png, the same images the
// repo README uses) — not mockups. A crossfade, not a hard cut, when
// switching tabs.
export function ProductShowcase() {
  const [active, setActive] = useState<(typeof views)[number]["id"]>("dashboard");
  const current = views.find((v) => v.id === active)!;

  return (
    <section id="product" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionHeader
        index="01"
        label="Product"
        title={
          <>
            See it in action<span className="text-brand">.</span>
          </>
        }
        description="The actual app — real screens from a running install, not mock-ups."
      />

      <Reveal delay={0.1} className="mt-12">
        <div
          role="tablist"
          aria-label="Product views"
          className="flex gap-8 overflow-x-auto border-b border-border"
        >
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={active === v.id}
              onClick={() => setActive(v.id)}
              className={cn(
                "relative -mb-px flex shrink-0 items-baseline gap-2 border-b-2 py-3 text-sm font-medium transition-colors",
                active === v.id
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {String(views.indexOf(v) + 1).padStart(2, "0")}
              </span>
              {v.label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.16} className="relative mt-10">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_40px_80px_-40px_rgba(10,10,10,0.35)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="eyebrow text-muted-foreground">{current.label}</span>
            <span className="eyebrow text-muted-foreground">localhost:1995</span>
          </div>
          <div className="relative aspect-[1440/900] w-full bg-muted/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={`${current.label} screen`}
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover object-top"
                  priority={current.id === "dashboard"}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
