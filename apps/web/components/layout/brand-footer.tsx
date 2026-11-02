import { LifeBuoy } from "lucide-react";

const REPO = "https://github.com/ABISHEK-K-DEV/restaurant-pos";

export function SupportLink({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <a
      href={`${REPO}/issues`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={iconOnly ? "Support" : undefined}
      title={iconOnly ? "Support" : undefined}
      className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[12px] whitespace-nowrap text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
    >
      <LifeBuoy className="h-3.5 w-3.5" />
      {!iconOnly && "Support"}
    </a>
  );
}

/** Bottom row of the mobile navigation drawer. */
export function BrandFooter() {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-sidebar-border px-5 py-3">
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        className="eyebrow text-sidebar-muted transition-colors hover:text-sidebar-foreground"
      >
        Restaurant POS
      </a>
      <SupportLink />
    </div>
  );
}
