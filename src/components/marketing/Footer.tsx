"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MessageSquare, Twitter, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { href: "/#features", label: t("features") },
      { href: "/#pricing", label: t("pricing") },
      { href: "/docs", label: t("docs") },
    ],
    support: [
      { href: "/docs", label: t("gettingStarted") },
      { href: "/#faq", label: t("faq") },
      { href: "mailto:support@example.com", label: t("contact") },
    ],
    legal: [
      { href: "/privacy", label: t("privacy") },
      { href: "/terms", label: t("terms") },
    ],
  };

  const socialLinks = [
    {
      href: "https://twitter.com",
      icon: Twitter,
      label: "Twitter",
    },
    {
      href: "mailto:support@example.com",
      icon: Mail,
      label: "Email",
    },
    {
      href: "https://wa.me/966000000000",
      icon: MessageCircle,
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <MessageSquare className="h-6 w-6 text-green-600" />
              {t("brand")}
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              {t("description")}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("product")}</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("support")}</h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}
