import {
  ChefHat,
  GitBranch,
  Gift,
  Package,
  Plug,
  QrCode,
  ShieldCheck,
  UtensilsCrossed,
  WifiOff,
} from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { SectionHeader } from "@/components/marketing/section-header";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Dine-in POS & billing",
    description:
      "Modifiers, combos, split & merge bills, tips, gift cards, multi-payment checkout, and tax-inclusive GST pricing done right.",
  },
  {
    icon: ChefHat,
    title: "Live Kitchen Display",
    description:
      "KOTs auto-routed to the right kitchen station, reprint & priority controls, and per-station prep-time reporting.",
  },
  {
    icon: QrCode,
    title: "Tables & reservations",
    description:
      "Visual floor plan, booking with waitlist, table transfer, and per-table QR codes for a read-only public menu.",
  },
  {
    icon: Package,
    title: "Inventory & procurement",
    description:
      "Ingredients, weighted-average recipe costing, purchase orders, goods receipt with batch/lot tracking, and FIFO waste logging.",
  },
  {
    icon: Gift,
    title: "CRM, loyalty & gift cards",
    description:
      "Customer profiles, earn-and-redeem loyalty points, gift card issuance, and full visit history.",
  },
  {
    icon: WifiOff,
    title: "Offline-first by design",
    description:
      "The whole stack runs on one local server. Order-taking, billing, KDS, and printing keep working with the WAN cable unplugged.",
  },
  {
    icon: ShieldCheck,
    title: "RBAC on every action",
    description:
      "Granular, individually toggleable permissions and strict multi-tenant isolation — never a hardcoded role check.",
  },
  {
    icon: GitBranch,
    title: "Open source, no lock-in",
    description:
      "AGPL-3.0 licensed. Self-host on Docker, CasaOS/ZimaOS, or a Windows client — your data never has to leave your building.",
  },
  {
    icon: Plug,
    title: "API & MCP integrations",
    description:
      "Connect an MCP client like Claude Desktop with your own permissions, or issue a scoped API key so your website can browse the menu, place orders, and book tables through Restaurant POS directly.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionHeader
        index="02"
        label="Features"
        title={
          <>
            Everything a real dine&#8209;in operation needs<span className="text-brand">.</span>
          </>
        }
        description="Not a retail POS bolted onto a restaurant — built for dine-in, takeaway and kitchen operations from day one."
      />

      <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <RevealItem key={f.title} className="group relative flex flex-col bg-card p-7 transition-colors duration-200 hover:bg-background">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-brand">{String(i + 1).padStart(2, "0")}</span>
              <f.icon className="size-[18px] text-muted-foreground transition-colors group-hover:text-foreground" strokeWidth={1.6} />
            </div>
            <h3 className="mt-10 font-heading text-[19px] font-semibold tracking-[-0.02em] text-foreground">{f.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{f.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
