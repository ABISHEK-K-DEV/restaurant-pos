"use client";

import { Check, Copy, Github, HardDrive, Terminal } from "lucide-react";
import { useState } from "react";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { SectionHeader } from "@/components/marketing/section-header";
import { downloadHref, totalDownloads } from "@/lib/downloads";
import { useDownloadStats } from "@/hooks/use-download-stats";

const INSTALL_COMMAND =
  "git clone https://github.com/ABISHEK-K-DEV/restaurant-pos.git && cd restaurant-pos && ./install.sh";

const channels = [
  {
    channel: "install-script" as const,
    icon: Terminal,
    title: "One-click install",
    description: "Clone the repo and run install.sh — generates secrets, builds, and seeds nothing but a real signup.",
  },
  {
    channel: "docker" as const,
    icon: HardDrive,
    title: "Docker Compose",
    description: "Postgres, API, and web app — three services, one docker compose up.",
  },
  {
    channel: "casaos" as const,
    icon: HardDrive,
    title: "CasaOS / ZimaOS",
    description: "Install from the official CasaOS App Store on your home server or NAS.",
  },
  {
    channel: "github" as const,
    icon: Github,
    title: "View source",
    description: "AGPL-3.0 licensed. Read the code, fork it, self-host it — nothing hidden.",
  },
];

function CopyCommand() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(INSTALL_COMMAND);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="group flex w-full items-center justify-between gap-3 rounded-md bg-[#0A0A0A] px-5 py-4 text-left font-mono text-[13px] text-[#F5F5F2] transition-colors hover:bg-[#161616] dark:bg-[#161616]"
    >
      <span className="truncate">
        <span className="text-brand select-none">$ </span>
        {INSTALL_COMMAND}
      </span>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-white/70 transition-colors group-hover:text-white">
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </span>
    </button>
  );
}

export function InstallSection() {
  const { data: stats } = useDownloadStats();
  const total = totalDownloads(stats);

  return (
    <section id="get-started" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionHeader
        index="04"
        label="Install"
        title={
          <>
            Running in minutes, not a sales call<span className="text-brand">.</span>
          </>
        }
        description="Pick a path. Every route lands on the exact same self-hosted stack."
      />

      <Reveal delay={0.1} className="mt-12">
        <CopyCommand />
      </Reveal>

      <RevealGroup className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c) => (
          <RevealItem key={c.channel}>
            <a
              href={downloadHref(c.channel)}
              className="group flex h-full flex-col bg-card p-6 transition-colors hover:bg-background"
            >
              <c.icon className="size-[18px] text-muted-foreground transition-colors group-hover:text-foreground" strokeWidth={1.6} />
              <h3 className="mt-8 font-heading text-[17px] font-semibold tracking-[-0.02em] text-foreground">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {c.description}
              </p>
              <span className="mt-6 text-sm font-medium text-foreground underline decoration-brand decoration-2 underline-offset-[6px] opacity-0 transition-opacity group-hover:opacity-100">
                Continue &rarr;
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.15} className="mt-14 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-end sm:gap-6">
        <p className="font-display text-5xl font-semibold tracking-[-0.04em] tabular-nums text-foreground sm:text-6xl">
          <AnimatedCounter value={total} />
        </p>
        <p className="max-w-md pb-1.5 text-sm text-muted-foreground">
          real link click-throughs tracked since launch &mdash; no pre-seeded number, see{" "}
          <a
            href="/api/v1/downloads/stats"
            className="underline underline-offset-4 hover:text-foreground"
          >
            the live counter API
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
