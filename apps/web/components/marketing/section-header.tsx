import { Reveal } from "@/components/marketing/reveal";

/**
 * Swiss section opener: a running number and label on a full-width rule,
 * the title on the left eight columns, the supporting line on the right four.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex items-center justify-between border-t border-foreground pt-4">
        <span className="eyebrow text-foreground">
          <span className="text-brand">{index}</span>&nbsp;&nbsp;{label}
        </span>
        <span className="eyebrow hidden text-muted-foreground sm:inline">Restaurant POS</span>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-[36px] leading-[1] font-semibold tracking-[-0.04em] text-foreground sm:text-[52px] lg:col-span-8">
          {title}
        </h2>
        <p className="text-[16px] leading-relaxed text-muted-foreground lg:col-span-4 lg:pb-1.5">
          {description}
        </p>
      </div>
    </Reveal>
  );
}
