"use client";

import type { SessionUser } from "@restaurant-pos/types";
import { ArrowRight, CornerDownLeft, Moon, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { hasPermission } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, NAV_ITEMS } from "./nav-items";

type Command = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
};

/** True on Apple platforms, where the palette shortcut is ⌘K rather than Ctrl K. */
const noopSubscribe = () => () => {};
function useIsMac() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => false,
  );
}

export function CommandPaletteTrigger({ onOpen, className }: { onOpen: () => void; className?: string }) {
  const { t } = useI18n();
  const mac = useIsMac();
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex h-9 w-full max-w-[340px] items-center gap-2.5 rounded-md border border-input bg-card px-3 text-left text-[13px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
        className,
      )}
    >
      <Search className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1 truncate">{t("shell.search")}</span>
      <kbd className="hidden shrink-0 items-center gap-0.5 rounded-[3px] border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
        {mac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}

/**
 * ⌘K / Ctrl+K palette: jump to any screen the signed-in role can open, plus
 * a few global actions. Fully keyboard driven (↑ ↓ Enter, Esc to close).
 */
export function CommandPalette({
  user,
  open,
  onOpenChange,
}: {
  user?: SessionUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const commands = useMemo<Command[]>(() => {
    const groupLabel = new Map(NAV_GROUPS.map((g) => [g.id, t(g.labelKey)]));
    const nav: Command[] = NAV_ITEMS.filter((i) => !i.permission || hasPermission(user, i.permission)).map((i) => ({
      id: i.href,
      label: t(i.labelKey),
      hint: groupLabel.get(i.group ?? "business") ?? "",
      icon: i.icon,
      run: () => router.push(i.href),
    }));
    const actions: Command[] = [
      {
        id: "theme",
        label: t("shell.toggleTheme"),
        hint: t("shell.actions"),
        icon: Moon,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
    ];
    return [...nav, ...actions];
  }, [t, user, router, setTheme, resolvedTheme]);

  const q = query.trim().toLowerCase();
  const results = q
    ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
    : commands;
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const choose = (cmd: Command | undefined) => {
    if (!cmd) return;
    onOpenChange(false);
    cmd.run();
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setQuery("");
      setActive(0);
    }
    onOpenChange(next);
  };

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${current}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-[560px]"
      >
        <DialogTitle className="sr-only">{t("shell.search")}</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(results[current]);
              }
            }}
            placeholder={t("shell.search")}
            aria-label={t("shell.search")}
            aria-controls="command-results"
            aria-activedescendant={results[current] ? `cmd-${current}` : undefined}
            className="h-13 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-[3px] border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        <ul
          id="command-results"
          ref={listRef}
          role="listbox"
          className="max-h-[min(60vh,420px)] overflow-y-auto p-1.5"
        >
          {results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-muted-foreground">{t("shell.noResults")}</li>
          )}
          {results.map((cmd, i) => {
            const Icon = cmd.icon;
            const selected = i === current;
            return (
              <li
                key={cmd.id}
                id={`cmd-${i}`}
                data-index={i}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(i)}
                onClick={() => choose(cmd)}
                className={cn(
                  "relative flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 text-sm",
                  selected ? "bg-muted text-foreground" : "text-foreground/80",
                )}
              >
                {selected && <span aria-hidden className="absolute top-2 bottom-2 left-0 w-[2px] rounded-full bg-brand" />}
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                <span className="flex-1 truncate font-medium">{cmd.label}</span>
                <span className="eyebrow text-muted-foreground">{cmd.hint}</span>
                {selected ? (
                  <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-transparent" />
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-border bg-muted/40 px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span>↑ ↓ {t("shell.navigate")}</span>
          <span>↵ Enter</span>
          <span className="ml-auto">Restaurant POS</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
