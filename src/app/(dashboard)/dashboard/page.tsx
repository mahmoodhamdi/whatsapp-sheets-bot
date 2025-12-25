import { getTranslations } from "next-intl/server";
import { MessageSquare, Users, Bot, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [totalMessages, totalContacts, activeRules, todayMessages] =
    await Promise.all([
      prisma.message.count(),
      prisma.contact.count(),
      prisma.autoReplyRule.count({ where: { isActive: true } }),
      prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

  return { totalMessages, totalContacts, activeRules, todayMessages };
}

async function getRecentMessages() {
  return prisma.message.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { contact: true },
  });
}

async function getTopContacts() {
  return prisma.contact.findMany({
    take: 5,
    orderBy: { messageCount: "desc" },
  });
}

export default async function DashboardPage() {
  const t = await getTranslations();
  const [stats, recentMessages, topContacts] = await Promise.all([
    getStats(),
    getRecentMessages(),
    getTopContacts(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.totalMessages")}
          value={stats.totalMessages}
          icon={MessageSquare}
          testId="stats-total-messages"
        />
        <StatsCard
          title={t("dashboard.totalContacts")}
          value={stats.totalContacts}
          icon={Users}
          testId="stats-total-contacts"
        />
        <StatsCard
          title={t("dashboard.activeRules")}
          value={stats.activeRules}
          icon={Bot}
          testId="stats-active-rules"
        />
        <StatsCard
          title={t("dashboard.todayMessages")}
          value={stats.todayMessages}
          icon={TrendingUp}
          testId="stats-today-messages"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="recent-messages">
          <CardHeader>
            <CardTitle>{t("dashboard.recentMessages")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("messages.noMessages")}
              </p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {message.contact.name || message.contact.phone}
                        </span>
                        <Badge
                          variant={
                            message.direction === "INCOMING"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {message.direction === "INCOMING"
                            ? t("messages.incoming")
                            : t("messages.outgoing")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="top-contacts">
          <CardHeader>
            <CardTitle>{t("dashboard.topContacts")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topContacts.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("contacts.noContacts")}
              </p>
            ) : (
              <div className="space-y-4">
                {topContacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {contact.name || contact.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>
                    <Badge variant="outline">{contact.messageCount}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
