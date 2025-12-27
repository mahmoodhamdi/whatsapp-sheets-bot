import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { getUserSubscription } from "@/lib/services/subscription";
import { getFreePlan } from "@/lib/services/plan";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get subscription data for header plan badge
  const subscription = await getUserSubscription(session.user.id);
  const planData = subscription?.plan || (await getFreePlan());

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header
          user={session.user}
          plan={{ name: planData.name, slug: planData.slug }}
        />
        <main className="flex-1 p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
