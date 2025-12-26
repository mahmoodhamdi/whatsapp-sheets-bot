import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">التوثيق</h1>
        <p className="text-muted-foreground mb-8">
          صفحة التوثيق - سيتم إضافة المحتوى في Phase 5
        </p>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowRight className="me-2 h-4 w-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
}
