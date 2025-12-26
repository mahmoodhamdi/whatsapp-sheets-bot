"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MessageSquare } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-green-600" />
            {t("brand")}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-lg py-2 border-b hover:text-green-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 space-y-4">
            <LanguageSwitcher currentLocale={locale} />

            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" onClick={onClose}>
                {t("login")}
              </Link>
            </Button>

            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <Link href="/register" onClick={onClose}>
                {t("getStarted")}
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
