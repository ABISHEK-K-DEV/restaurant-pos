"use client";

import { BranchNotice } from "@/components/layout/branch-notice";
import { AlertTriangle, ArrowUpRight, ChefHat, SlidersHorizontal, ClipboardList, Flame, Globe, HandCoins, ReceiptText, Store, Timer, TrendingUp, Trash2, UserRound, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { OrderDetailDialog } from "@/components/orders/order-detail-dialog";
import { RefundDialog } from "@/components/orders/refund-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import { useBranch } from "@/hooks/use-branch";
import { useManagedOrders } from "@/hooks/use-orders";
import { openEntity } from "@/lib/entity-events";
import { CustomizePanel } from "@/components/dashboard/customize-panel";
import {
  DEFAULT_DASHBOARD_PREFS,
  useDashboardPrefs,
  useDashboardSummary,
  useDashboardTrends,
  useSaveDashboardPrefs,
} from "@/hooks/use-dashboard";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const ONLINE_ORDER_TYPES = new Set(["QR_ORDER", "KIOSK"]);

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  href,
  size = "default",
  className,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  accent?: "success" | "warning";
  /** Where the full records behind this number live. */
  href: string;
  /** hero = the one number to look at first; compact = supporting figures. */
  size?: "hero" | "default" | "compact";
  className?: string;
}) {
  const hero = size === "hero";
  const compact = size === "compact";
  return (
    <Link
      href={href}
      aria-label={`${label}: ${value}. Open details`}
      className={cn(
        "group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Card
        className={cn(
          "relative flex h-full flex-col justify-between transition-colors duration-150",
          hero
            ? "gap-8 bg-primary p-6 text-primary-foreground ring-0 sm:p-7"
            : compact
              ? "gap-4 p-4 group-hover:ring-foreground/30"
              : "gap-6 p-5 group-hover:ring-foreground/30 sm:p-6",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "eyebrow flex items-center gap-2",
              hero ? "text-primary-foreground/60" : "text-muted-foreground",
            )}
          >
            {hero && <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />}
            {accent === "warning" && !hero && value !== "0" && (
              <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden />
            )}
            {label}
          </span>
          <Icon
            className={cn(
              "shrink-0 transition-colors",
              compact ? "h-3.5 w-3.5" : "h-4 w-4",
              hero ? "text-primary-foreground/50" : "text-muted-foreground/70 group-hover:text-foreground",
            )}
            strokeWidth={1.8}
          />
        </div>
        <div className="flex items-end justify-between gap-3">
          <span
            className={cn(
              "font-display leading-none font-semibold tracking-[-0.04em] tabular-nums",
              hero ? "text-5xl sm:text-6xl" : compact ? "text-2xl" : "text-4xl",
              accent === "warning" && !hero && value !== "0" ? "text-warning" : undefined,
            )}
          >
            {value}
          </span>
          <ArrowUpRight
            aria-hidden
            className={cn(
              "h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100",
              hero ? "text-primary-foreground/70" : "text-foreground",
            )}
          />
        </div>
      </Card>
    </Link>
  );
}

function TableStatusRow({
  label,
  count,
  dotClass,
  href,
}: {
  label: string;
  count: number;
  dotClass: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label}: ${count}. Open`}
      className="-mx-2 flex items-center justify-between rounded-md border-b border-border/70 px-2 py-2.5 text-sm outline-none transition last:border-0 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("h-2 w-2 rounded-[2px]", dotClass)} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono text-[13px] font-medium tabular-nums text-foreground">{count}</span>
    </Link>
  );
}

export default function DashboardPage() {
  const { branchId } = useBranch();
  const { data, isLoading } = useDashboardSummary(branchId);
  const { data: prefsData } = useDashboardPrefs();
  const prefs = prefsData ?? DEFAULT_DASHBOARD_PREFS;
  const savePrefs = useSaveDashboardPrefs();
  const { data: trends, isLoading: trendsLoading } = useDashboardTrends(branchId, prefs.trendDays);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const { data: me } = useCurrentUser();
  const [now] = useState(() => new Date());
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (me?.user?.name ?? "").trim().split(/\s+/)[0];
  const today = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  // Layout only: where a widget sits and whether it shows. CSS `order` keeps
  // the existing markup in place, and a hidden widget is simply not displayed.
  const slot = (group: "top" | "card", id: string, className = "") => {
    const list = group === "top" ? prefs.topOrder : prefs.cardOrder;
    const index = Math.max(list.indexOf(id), 0);
    // Inline display:none always beats a utility class like `flex` or `grid`.
    return {
      className,
      style: {
        order: (group === "top" ? 10 : 100) + index,
        ...(prefs.hidden.includes(id) ? { display: "none" } : {}),
      },
    };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-3">
          <p className="eyebrow flex items-center gap-2 text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Live · {today}
          </p>
          <h1 className="text-[40px] text-foreground sm:text-[48px]">
            {greeting}
            {firstName ? `, ${firstName}` : ""}
            <span className="text-brand">.</span>
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          aria-expanded={customizing}
          onClick={() => setCustomizing((v) => !v)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Customize
        </Button>
      </div>

      {customizing && (
        <CustomizePanel
          prefs={prefs}
          saving={savePrefs.isPending}
          onChange={(next) => savePrefs.mutate(next)}
          onClose={() => setCustomizing(false)}
        />
      )}

      <OrderDetailDialog
        branchId={branchId}
        orderId={viewingOrderId}
        open={!!viewingOrderId}
        onOpenChange={(open) => !open && setViewingOrderId(null)}
      />

      <BranchNotice />

      <PendingOrdersBanner branchId={branchId} />

      <QuickActions />

      <div {...slot("top", "kpis")}>
      {isLoading || !data ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className={cn("h-[168px] rounded-lg", i === 0 && "col-span-2 xl:col-span-2")} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
          <StatCard
            label="Today's Revenue"
            value={formatCurrency(data.todayRevenue)}
            icon={Wallet}
            accent="success"
            href="/reports"
            size="hero"
            className="col-span-2 xl:col-span-2"
          />
          <StatCard
            label="Today's Orders"
            value={String(data.todayOrders)}
            icon={ReceiptText}
            href="/orders?tab=history"
          />
          <StatCard
            label="Occupied Tables"
            value={String(data.tables.occupied)}
            icon={ClipboardList}
            href="/tables"
          />
          <StatCard
            label="Kitchen Queue"
            value={String(
              data.kitchenQueue.new + data.kitchenQueue.accepted + data.kitchenQueue.preparing,
            )}
            icon={Flame}
            accent="warning"
            href="/kds"
            className="col-span-2 xl:col-span-1"
          />
        </div>
      )}
      </div>

      {data && (
        <div {...slot("top", "attention", "grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5")}>
          <StatCard
            size="compact"
            label="Pending payments"
            value={
              data.pendingPayments.count === 0
                ? "0"
                : `${data.pendingPayments.count} · ${formatCurrency(data.pendingPayments.balance)}`
            }
            icon={HandCoins}
            accent={data.pendingPayments.count > 0 ? "warning" : undefined}
            href="/orders?tab=active"
          />
          {data.lowStock !== null && (
            <StatCard
            size="compact"
              label="Low stock"
              value={String(data.lowStock)}
              icon={AlertTriangle}
              accent={data.lowStock > 0 ? "warning" : undefined}
              href="/inventory?filter=low"
            />
          )}
          {data.customers !== null && (
            <StatCard size="compact" label="Customers" value={String(data.customers)} icon={Users} href="/customers" />
          )}
          {data.employees !== null && (
            <StatCard size="compact" label="Team members" value={String(data.employees)} icon={UserRound} href="/team" />
          )}
          {data.unpaidPayrollRuns !== null && (
            <StatCard
            size="compact"
              label="Payroll to pay"
              value={String(data.unpaidPayrollRuns)}
              icon={Wallet}
              accent={data.unpaidPayrollRuns > 0 ? "warning" : undefined}
              href="/team?tab=payroll"
            />
          )}
        </div>
      )}

      <div {...slot("top", "charts", "grid grid-cols-1 gap-4 lg:grid-cols-2")}>
        <TrendChart
          title={`Revenue — last ${prefs.trendDays} days`}
          icon={TrendingUp}
          data={trends?.revenue ?? []}
          valueKey="amount"
          color="var(--foreground)"
          valueFormatter={(v) => formatCurrency(v)}
          isLoading={trendsLoading}
          emptyMessage={`No paid orders in the last ${prefs.trendDays} days yet.`}
        />
        <TrendChart
          title={`Food waste cost — last ${prefs.trendDays} days`}
          icon={Trash2}
          data={trends?.waste ?? []}
          valueKey="cost"
          color="var(--brand)"
          valueFormatter={(v) => formatCurrency(v)}
          isLoading={trendsLoading}
          emptyMessage={`No waste logged in the last ${prefs.trendDays} days — nice.`}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ order: 100 }}>
        <Card {...slot("card", "tables", "flex flex-col gap-1 p-6 lg:col-span-1")}>
          <h2 className="mb-3 eyebrow text-muted-foreground">Tables</h2>
          {data && (
            <>
              <TableStatusRow label="Available" count={data.tables.available} dotClass="bg-success" href="/tables" />
              <TableStatusRow label="Occupied" count={data.tables.occupied} dotClass="bg-brand" href="/tables" />
              <TableStatusRow label="Reserved" count={data.tables.reserved} dotClass="bg-warning" href="/tables" />
              <TableStatusRow label="Cleaning" count={data.tables.cleaning} dotClass="bg-muted-foreground" href="/tables" />
            </>
          )}
        </Card>

        <Card {...slot("card", "kitchen", "flex flex-col gap-1 p-6 lg:col-span-1")}>
          <h2 className="mb-3 flex items-center gap-2 eyebrow text-muted-foreground">
            <ChefHat className="h-3.5 w-3.5" />
            Kitchen queue
          </h2>
          {data && (
            <>
              <TableStatusRow label="New" count={data.kitchenQueue.new} dotClass="bg-brand" href="/kds" />
              <TableStatusRow label="Accepted" count={data.kitchenQueue.accepted} dotClass="bg-warning" href="/kds" />
              <TableStatusRow label="Preparing" count={data.kitchenQueue.preparing} dotClass="bg-warning" href="/kds" />
              <TableStatusRow label="Ready" count={data.kitchenQueue.ready} dotClass="bg-success" href="/kds" />
            </>
          )}
        </Card>

        <Card {...slot("card", "recent", "flex flex-col gap-3 p-6 lg:col-span-1")}>
          <h2 className="flex items-center gap-2 eyebrow text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            Recent transactions
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {data?.recentOrders.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">No sales yet today.</p>
            )}
            {data?.recentOrders.map((order) => {
              const isOnline = ONLINE_ORDER_TYPES.has(order.type);
              return (
                <div key={order.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <button
                    type="button"
                    onClick={() => setViewingOrderId(order.id)}
                    className="flex min-w-0 flex-1 flex-col text-left transition hover:opacity-70"
                    title="View order details"
                  >
                    <span className="font-mono text-[13px] font-medium text-foreground">#{order.orderNumber}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mt-0.5 w-fit text-[11px] font-normal",
                        isOnline && "bg-brand/10 text-brand",
                      )}
                    >
                      {order.type.replace("_", " ")}
                    </Badge>
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[13px] font-medium tabular-nums text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <RefundDialog
                      branchId={branchId}
                      orderId={order.id}
                      orderNumber={order.orderNumber}
                      maxAmount={Number(order.totalAmount)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card {...slot("card", "channels", "flex flex-col gap-3 p-6 lg:col-span-1")}>
          <h2 className="flex items-center gap-2 eyebrow text-muted-foreground">
            <ReceiptText className="h-3.5 w-3.5" />
            Order channels
          </h2>
          <p className="text-xs text-muted-foreground">Today, self-serve vs staff-entered</p>
          {data && (
            <>
              <Link
                href="/orders?tab=history&filter=online"
                aria-label={`Online orders today: ${data.channels.online}. Open`}
                className="-mx-2 flex items-center justify-between rounded-lg px-2 py-1.5 text-sm outline-none transition hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  Online (QR / kiosk)
                </div>
                <span className="font-medium tabular-nums text-foreground">
                  {data.channels.online}
                </span>
              </Link>
              <Link
                href="/orders?tab=history&filter=offline"
                aria-label={`Offline orders today: ${data.channels.offline}. Open`}
                className="-mx-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Store className="h-3.5 w-3.5" />
                  Offline (dine-in / takeaway / phone)
                </div>
                <span className="font-medium tabular-nums text-foreground">
                  {data.channels.offline}
                </span>
              </Link>
              <div className="mt-2 h-1.5 overflow-hidden rounded-[2px] bg-secondary">
                <div
                  className="h-full bg-brand transition-all duration-500"
                  style={{
                    width: `${
                      data.channels.online + data.channels.offline === 0
                        ? 0
                        : (data.channels.online / (data.channels.online + data.channels.offline)) * 100
                    }%`,
                  }}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// Online orders waiting for a decision — shown on top so they can't be missed.
function PendingOrdersBanner({ branchId }: { branchId: string | null }) {
  const { data } = useManagedOrders(branchId, "pending");
  if (!data || data.length === 0) return null;
  return (
    <Card className="flex flex-col gap-3 border-l-[3px] border-l-brand p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow mb-1.5 text-brand">Action needed</p>
        <p className="text-sm font-semibold text-foreground">
          {data.length} online order{data.length === 1 ? "" : "s"} waiting for you
        </p>
        <p className="text-xs text-muted-foreground">Accept or reject so the kitchen can start.</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openEntity("Order", data[0].id)}
          className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          Review #{data[0].orderNumber}
        </button>
        <Link href="/orders" className="rounded-md border border-input bg-card px-3 py-1.5 text-sm hover:border-foreground/40">
          All orders
        </Link>
      </div>
    </Card>
  );
}
