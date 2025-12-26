"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Rocket,
  Settings,
  MessageSquare,
  Table2,
  BarChart3,
  Key,
  Users,
  Mail,
  FileText,
} from "lucide-react";

interface DocsSidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  titleKey: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavSection {
  titleKey: string;
  items: NavItem[];
}

const docsNav: NavSection[] = [
  {
    titleKey: "gettingStarted",
    items: [
      {
        titleKey: "introduction",
        href: "/docs",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        titleKey: "quickStart",
        href: "/docs/quick-start",
        icon: <Rocket className="h-4 w-4" />,
      },
      {
        titleKey: "installation",
        href: "/docs/installation",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        titleKey: "configuration",
        href: "/docs/configuration",
        icon: <Key className="h-4 w-4" />,
      },
    ],
  },
  {
    titleKey: "features",
    items: [
      {
        titleKey: "autoReply",
        href: "/docs/features/auto-reply",
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        titleKey: "sheetsSync",
        href: "/docs/features/sheets-sync",
        icon: <Table2 className="h-4 w-4" />,
      },
      {
        titleKey: "analytics",
        href: "/docs/features/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
  {
    titleKey: "apiReference",
    items: [
      {
        titleKey: "authentication",
        href: "/docs/api/auth",
        icon: <Key className="h-4 w-4" />,
      },
      {
        titleKey: "contacts",
        href: "/docs/api/contacts",
        icon: <Users className="h-4 w-4" />,
      },
      {
        titleKey: "messages",
        href: "/docs/api/messages",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        titleKey: "rules",
        href: "/docs/api/rules",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
];

export function DocsSidebar({ onNavigate }: DocsSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("docs.nav");

  return (
    <nav className="sticky top-20 space-y-6">
      {docsNav.map((section) => (
        <div key={section.titleKey}>
          <h4 className="font-semibold mb-2 text-foreground">
            {t(`sections.${section.titleKey}`)}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 py-1.5 px-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    {t(`items.${item.titleKey}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
