import { cn } from "@/lib/utils";

// Signal dot shown next to a nav item / settings tab that has something the
// user should look at (a new order, an update, a failed backup). Brand red,
// with a slow pulse ring — the one place the UI is allowed to move on its own.
export function NavDot({ className, label }: { className?: string; label?: string }) {
  return (
    <span
      role="status"
      aria-label={label ?? "Needs attention"}
      className={cn("relative ml-auto flex h-2 w-2 shrink-0", className)}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 [animation-duration:1.6s] motion-reduce:animate-none" />
      <span className="relative inline-flex h-full w-full rounded-full bg-brand" />
    </span>
  );
}
