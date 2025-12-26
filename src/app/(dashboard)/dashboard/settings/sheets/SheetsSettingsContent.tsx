"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, RefreshCw, Check, X, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface SyncLog {
  id: string;
  type: string;
  status: string;
  details: string | null;
  createdAt: string;
}

export function SheetsSettingsContent() {
  const t = useTranslations();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/sheets/status");
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.connected);
      }
    } catch {
      setIsConnected(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/sheets/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      console.error("Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sheets/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          toast.success(t("settings.syncSuccess"));
        } else {
          toast.error(t("settings.syncError"));
        }
        fetchLogs();
      }
    } catch {
      toast.error(t("settings.syncError"));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">{t("settings.sheets")}</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle>{t("settings.sheetsIntegration")}</CardTitle>
                <CardDescription>
                  {t("settings.sheetsDescription")}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? (
                <>
                  <Check className="me-1 h-3 w-3" />
                  {t("settings.connected")}
                </>
              ) : (
                <>
                  <X className="me-1 h-3 w-3" />
                  {t("settings.disconnected")}
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected && (
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">{t("settings.setupInstructions")}:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>{t("settings.setupStep1")}</li>
                <li>{t("settings.setupStep2")}</li>
                <li>{t("settings.setupStep3")}</li>
                <li>{t("settings.setupStep4")}</li>
                <li>{t("settings.setupStep5")}</li>
              </ol>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleSync}
              disabled={!isConnected || isSyncing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSyncing ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="me-2 h-4 w-4" />
              )}
              {t("settings.syncNow")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.syncHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("settings.noSyncHistory")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>{t("settings.details")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "SUCCESS"
                            ? "default"
                            : log.status === "FAILED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {log.details || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
