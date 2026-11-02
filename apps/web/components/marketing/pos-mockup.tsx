"use client";

import { motion } from "motion/react";

const tickets = [
  { table: "Table 4", items: ["2x Margherita", "1x Iced Latte"], status: "Preparing" },
  { table: "Table 9", items: ["1x Butter Chicken", "2x Naan"], status: "Ready" },
  { table: "Takeaway #182", items: ["1x Cold Brew"], status: "New" },
];

const statusColor: Record<string, string> = {
  New: "bg-brand text-brand-foreground",
  Preparing: "bg-warning/12 text-warning",
  Ready: "bg-success/12 text-success",
};

// A stylized, illustrative mockup of the KDS/POS surface — not a screenshot
// of a real customer's data, drawn purely from this app's own UI language
// (see DESIGN_SYSTEM.md) so the hero has something concrete to show without
// implying a claim about a specific deployment.
export function PosMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_40px_80px_-40px_rgba(10,10,10,0.35)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="eyebrow text-muted-foreground">Kitchen display · Live</span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {tickets.map((t, i) => (
            <motion.div
              key={t.table}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2 rounded-md border border-border bg-background p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{t.table}</span>
                <span className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${statusColor[t.status]}`}>
                  {t.status}
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {t.items.map((it) => (
                  <li key={it} className="text-xs text-muted-foreground">
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating KPI card — pure decoration, positioned to read as a
          companion dashboard glance, not a data claim. */}
      <motion.div
        initial={{ opacity: 0, x: 16, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-4 -bottom-6 hidden w-44 rounded-md bg-[#0A0A0A] p-4 text-[#F5F5F2] shadow-lg sm:block"
      >
        <p className="eyebrow text-[#9A9A95]">Table occupancy</p>
        <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] tabular-nums">72%</p>
        <div className="mt-3 h-1 w-full overflow-hidden bg-white/15">
          <motion.div
            className="h-full bg-brand"
            initial={{ width: 0 }}
            animate={{ width: "72%" }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
