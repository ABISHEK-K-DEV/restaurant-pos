"use client";

import type { SessionUser } from "@restaurant-pos/types";
import { LogOut, Moon, Server, Sun, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteAccountDialog } from "@/components/layout/delete-account-dialog";
import { useLogout } from "@/hooks/use-auth";
import { changeServer, isNativeApp } from "@/lib/native";

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user }: { user?: SessionUser }) {
  const { theme, setTheme } = useTheme();
  const logout = useLogout();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Toggle theme"
      >
        <Sun className="h-[18px] w-[18px] dark:hidden" />
        <Moon className="hidden h-[18px] w-[18px] dark:block" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-md py-1 pr-2 pl-1 transition-colors hover:bg-secondary">
          <Avatar className="h-7 w-7 rounded-md after:rounded-md">
            <AvatarFallback className="rounded-md bg-primary font-mono text-[11px] font-medium text-primary-foreground">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col text-left leading-tight sm:flex"><span className="text-[13px] font-medium">{user?.name}</span><span className="text-[11px] text-muted-foreground">{user?.roleName?.replace(/_/g, " ").toLowerCase()}</span></span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{user?.roleName}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
          {isNativeApp() && (
            <DropdownMenuItem
              onClick={() => logout.mutate(undefined, { onSuccess: () => changeServer() })}
            >
              <Server className="h-4 w-4" />
              Change server
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setDeleting(true)} className="text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete my account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAccountDialog open={deleting} onOpenChange={setDeleting} />
    </div>
  );
}
