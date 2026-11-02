"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatDayLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Axis ticks are short (10K); the tooltip carries the exact currency value.
const compactNumber = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

export function TrendChart({
  title,
  icon: Icon,
  data,
  valueKey,
  color,
  valueFormatter,
  isLoading,
  emptyMessage,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data: Record<string, string | number>[];
  valueKey: string;
  color: string;
  valueFormatter: (value: number) => string;
  isLoading: boolean;
  emptyMessage: string;
}) {
  const hasData = data.some((d) => Number(d[valueKey]) > 0);
  const total = data.reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0);
  const gradientId = `trend-${valueKey}`;

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="eyebrow flex items-center gap-2 text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            {title}
          </h2>
          <span className="font-display text-[28px] leading-none font-semibold tracking-[-0.03em] tabular-nums text-foreground">
            {isLoading ? "—" : valueFormatter(total)}
          </span>
        </div>
        <span aria-hidden className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      </div>

      {isLoading ? (
        <Skeleton className="h-56 rounded-md" />
      ) : !hasData ? (
        <div className="swiss-grid flex h-56 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDayLabel}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => compactNumber.format(v)}
              />
              <Tooltip
                formatter={(value: number) => valueFormatter(value)}
                labelFormatter={(label: string) => formatDayLabel(label)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 12,
                  boxShadow: "var(--shadow-pop)",
                }}
                cursor={{ stroke: "var(--foreground)", strokeOpacity: 0.25, strokeDasharray: "2 3" }}
              />
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke={color}
                strokeWidth={1.75}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 3.5, strokeWidth: 0, fill: color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
