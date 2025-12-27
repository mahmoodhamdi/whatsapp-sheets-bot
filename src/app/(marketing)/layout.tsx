import { ReactNode } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { AuthProvider } from "@/components/providers";
import {
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/seo/StructuredData";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <OrganizationSchema />
        <SoftwareApplicationSchema />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
