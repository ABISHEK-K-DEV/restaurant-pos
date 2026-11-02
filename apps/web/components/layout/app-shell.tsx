"use client";

import type { SessionUser } from "@restaurant-pos/types";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { EntityDialogHost } from "@/components/layout/entity-dialog-host";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { useBranch } from "@/hooks/use-branch";
import { useDisplaySettings } from "@/hooks/use-settings";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { BrandFooter, SupportLink } from "./brand-footer";
import { BranchSwitcher } from "./branch-switcher";
import { CommandPalette, CommandPaletteTrigger } from "./command-palette";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { NAV_GROUPS, NAV_ITEMS } from "./nav-items";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

const COLLAPSE_KEY = "rpos.sidebar.collapsed";

// The restaurant's own logo + name lead the sidebar header — this is
// white-label self-hosted software, so the operator's branding takes the
// prime spot. The Restaurant POS mark falls back in only until the
// restaurant sets its own logo/name under Settings.
function RestaurantBrand({ collapsed = false }: { collapsed?: boolean }) {
  const { branchId } = useBranch();
  const { data } = useDisplaySettings(branchId);
  const restaurant = data?.restaurant;
  const name = restaurant?.name ?? "Restaurant POS";

  return (
    <div className={cn("flex min-w-0 items-center gap-3", collapsed && "justify-center")}>
      {restaurant?.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- uploaded asset served from the backend, not a Next-optimizable remote source
        <img src={restaurant.logoUrl} alt={name} className="h-8 w-8 shrink-0 rounded-md bg-white object-contain" />
      ) : (
        <Logo size={32} className="rounded-md" />
      )}
      {!collapsed && (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-heading text-[14px] font-semibold leading-tight tracking-[-0.01em] text-sidebar-foreground">
            {name}
          </span>
          <span className="eyebrow mt-1 text-sidebar-muted">Restaurant POS</span>
        </div>
      )}
    </div>
  );
}

/** HH:MM clock for the top bar — staff glance at it all shift. */
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}
const clockSnapshot = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function LiveClock() {
  const time = useSyncExternalStore(subscribeClock, clockSnapshot, () => "");
  if (!time) return null;
  return (
    <div className="hidden items-center gap-2 font-mono text-[12px] tabular-nums text-muted-foreground xl:flex" aria-hidden>
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {time}
    </div>
  );
}

// Sidebar collapse preference, kept in localStorage (per device). Read
// through useSyncExternalStore so the server render and first client render
// agree (expanded), then the saved value applies.
const collapseListeners = new Set<() => void>();
function subscribeCollapse(onChange: () => void) {
  collapseListeners.add(onChange);
  return () => collapseListeners.delete(onChange);
}
function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}
function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(COLLAPSE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable: preference lasts for this page only */
  }
  collapseOverride = value;
  collapseListeners.forEach((l) => l());
}
let collapseOverride: boolean | null = null;
const collapseSnapshot = () => collapseOverride ?? readCollapsed();

/** "Service / Point of Sale" — where am I, in the grid of the app. */
function Breadcrumb() {
  const pathname = usePathname() ?? "";
  const { t } = useI18n();
  const item = NAV_ITEMS.find((i) => pathname.startsWith(i.href));
  if (!item) return null;
  const group = NAV_GROUPS.find((g) => g.id === (item.group ?? "business"));
  return (
    <div className="hidden min-w-0 items-center gap-2 text-[13px] md:flex">
      {group && <span className="eyebrow text-muted-foreground">{t(group.labelKey)}</span>}
      <span className="text-border" aria-hidden>
        /
      </span>
      <span className="truncate font-medium text-foreground">{t(item.labelKey)}</span>
    </div>
  );
}

export function AppShell({
  user,
  children,
}: {
  user?: SessionUser;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const collapsed = useSyncExternalStore(subscribeCollapse, collapseSnapshot, () => false);
  const toggleCollapsed = () => writeCollapsed(!collapsed);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar — the ink column */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground dark:border-r dark:border-sidebar-border transition-[width] duration-200 ease-(--ease-swiss) lg:flex",
          collapsed ? "w-[68px]" : "w-[252px]",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center", collapsed ? "justify-center px-2" : "px-5")}>
          <RestaurantBrand collapsed={collapsed} />
        </div>
        {!collapsed && (
          <div className="px-3 pb-4">
            <BranchSwitcher />
          </div>
        )}
        <div className="flex-1 overflow-y-auto pt-2 pb-6 [scrollbar-color:#333_transparent]">
          <SidebarNav user={user} collapsed={collapsed} />
        </div>
        <div className={cn("flex items-center gap-1 border-t border-sidebar-border", collapsed ? "px-2 py-3" : "px-3 py-3")}>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? t("shell.expand") : t("shell.collapse")}
            title={collapsed ? t("shell.expand") : t("shell.collapse")}
            className={cn(
              "flex h-8 items-center gap-2 rounded-md text-[12px] whitespace-nowrap text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed ? "w-full justify-center" : "flex-1 px-3",
            )}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && <span>{t("shell.collapse")}</span>}
          </button>
          {!collapsed && <SupportLink iconOnly />}
        </div>
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[288px] border-0 bg-sidebar p-0 text-sidebar-foreground">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center px-5">
            <RestaurantBrand />
          </div>
          <div className="px-3 pb-4">
            <BranchSwitcher />
          </div>
          <div className="flex-1 overflow-y-auto pt-2 pb-6">
            <SidebarNav user={user} onNavigate={() => setMobileOpen(false)} />
          </div>
          <BrandFooter />
        </SheetContent>
      </Sheet>

      <CommandPalette user={user} open={paletteOpen} onOpenChange={setPaletteOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Breadcrumb />
          <div className="flex flex-1 justify-center">
            <CommandPaletteTrigger onOpen={() => setPaletteOpen(true)} className="hidden sm:flex" />
          </div>
          <div className="flex items-center gap-1">
            <LiveClock />
            <span className="mx-2 hidden h-5 w-px bg-border xl:block" aria-hidden />
            <LanguageSwitcher compact />
            <NotificationBell />
            <UserMenu user={user} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:px-10 lg:py-8">
          {children}
        </main>
        <EntityDialogHost />
      </div>
      <MobileBottomNav user={user} onMore={() => setMobileOpen(true)} />
    </div>
  );
}
