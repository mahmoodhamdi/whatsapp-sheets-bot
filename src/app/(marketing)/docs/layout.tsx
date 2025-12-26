"use client";

import { ReactNode, useState } from "react";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface DocsLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="gap-2"
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
          {isSidebarOpen ? "Close Menu" : "Documentation Menu"}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 shrink-0`}
        >
          <DocsSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main
          className={`${
            isSidebarOpen ? "hidden" : "block"
          } md:block flex-1 min-w-0 max-w-none`}
        >
          <article className="prose prose-green dark:prose-invert max-w-none">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
