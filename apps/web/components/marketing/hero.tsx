"use client";

import { ArrowRight, Github } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { downloadHref } from "@/lib/downloads";
import { PosMockup } from "@/components/marketing/pos-mockup";

const EASE = [0.2, 0, 0, 1] as const;

const FACTS = [
  ["18", "modules, one stack"],
  ["0", "subscription fees"],
  ["100%", "works with the internet down"],
  ["3", "languages: EN · ES · FR"],
] as const;

const lines = ["Restaurant software", "you actually own"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="eyebrow flex items-center gap-2.5 text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 bg-brand" />
          Open source · AGPL-3.0 · Self-hosted
        </motion.p>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="font-display text-[44px] leading-[0.95] font-semibold tracking-[-0.045em] text-foreground sm:text-[72px] lg:col-span-8 lg:text-[96px]">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 + i * 0.09, ease: EASE }}
                >
                  {line}
                  {i === lines.length - 1 && <span className="text-brand">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            className="flex flex-col gap-7 lg:col-span-4 lg:pb-3"
          >
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Point of sale, kitchen display, tables, reservations, inventory and CRM — one
              self-hosted system on your own network. No subscription, no lock-in. Your
              orders, your guests&rsquo; data, your server.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-[15px]" render={<Link href="/signup" />}>
                Get started free
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-6 text-[15px]"
                render={<a href={downloadHref("github")} />}
              >
                <Github className="size-4" data-icon="inline-start" />
                Source code
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 border-t border-foreground lg:grid-cols-4"
        >
          {FACTS.map(([value, label], i) => (
            <div
              key={label}
              className="flex flex-col gap-2 border-border py-6 pr-6 max-lg:even:pl-6 max-lg:even:border-l lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="eyebrow text-muted-foreground">{String(i + 1).padStart(2, "0")}</dt>
              <dd className="flex flex-col gap-1">
                <span className="font-display text-4xl font-semibold tracking-[-0.04em] tabular-nums text-foreground">
                  {value}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <PosMockup />
      </div>
    </section>
  );
}
