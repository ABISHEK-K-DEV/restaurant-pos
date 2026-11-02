"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@restaurant-pos/types";
import { hasPermission } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { useNavBadges } from "@/hooks/use-nav-badges";
import { NavDot } from "./nav-dot";
import { NAV_GROUPS, NAV_ITEMS } from "./nav-items";

/**
 * Sidebar navigation, Swiss layout: sections under small mono eyebrows, a
 * 2px signal-red bar marking the current page, and a faint running index on
 * the right edge. `collapsed` renders icons only (desktop rail).
 */
export function SidebarNav({
  user,
  onNavigate,
  collapsed = false,
}: {
  user?: SessionUser;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const badges = useNavBadges();

  const allowed = NAV_ITEMS.filter((item) => !item.permission || hasPermission(user, item.permission));
  // Running number shown on the right edge, in section order.
  const ordered = NAV_GROUPS.flatMap((g) => allowed.filter((item) => (item.group ?? "business") === g.id));
  const indexOf = new Map(ordered.map((item, i) => [item.href, i + 1]));

  return (
    <nav aria-label="Main" className={cn("flex flex-col gap-6", collapsed ? "px-2" : "px-3")}>
      {NAV_GROUPS.map((group) => {
        const items = allowed.filter((item) => (item.group ?? "business") === group.id);
        if (items.length === 0) return null;
        return (
          <div key={group.id} className="flex flex-col">
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" aria-hidden />
            ) : (
              <div className="eyebrow mb-2 px-3 text-sidebar-muted">{t(group.labelKey)}</div>
            )}
            <ul className="flex flex-col gap-px">
              {items.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;
                const label = t(item.labelKey);
                const attention = badges.nav[item.href] && !isActive;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "group/nav relative flex h-9 items-center gap-3 rounded-md text-[13.5px] font-medium outline-none transition-colors duration-150",
                        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                        collapsed ? "justify-center px-0" : "px-3",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full bg-sidebar-primary transition-opacity",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={isActive ? 2.1 : 1.8} />
                      {collapsed ? (
                        attention ? <NavDot className="absolute top-1.5 right-1.5 ml-0 h-2 w-2" /> : null
                      ) : (
                        <>
                          <span className="truncate">{label}</span>
                          {attention ? (
                            <NavDot />
                          ) : (
                            <span
                              aria-hidden
                              className={cn(
                                "ml-auto font-mono text-[10px] tabular-nums transition-colors",
                                isActive ? "text-sidebar-muted" : "text-sidebar-muted/50 group-hover/nav:text-sidebar-muted",
                              )}
                            >
                              {String(indexOf.get(item.href) ?? 0).padStart(2, "0")}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
