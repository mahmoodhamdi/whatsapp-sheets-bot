import { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  showLogo?: boolean;
  footer?: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  showLogo = true,
  footer,
}: AuthCardProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-4">
        {showLogo && (
          <Link href="/" className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center shadow-md">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
          </Link>
        )}
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="flex justify-center border-t pt-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
