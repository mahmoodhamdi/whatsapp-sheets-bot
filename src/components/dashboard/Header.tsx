"use client";

import { useTranslations, useLocale } from "next-intl";
import { signOut } from "next-auth/react";
import { LogOut, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PlanBadge } from "@/components/subscription/PlanBadge";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  plan?: {
    name: string;
    slug: string;
  };
}

export function Header({ user, plan }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {plan && (
          <PlanBadge
            planName={plan.name}
            planSlug={plan.slug}
            showUpgradeLink={plan.slug === "free"}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLocale={locale} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
              data-testid="user-menu"
            >
              <Avatar>
                <AvatarFallback className="bg-green-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-500 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings/account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("nav.settings")}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings/billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t("nav.billing")}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 focus:text-red-600"
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4 me-2" />
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
