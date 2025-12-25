"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import QRCode from "qrcode";

export default function WhatsAppSettingsPage() {
  const t = useTranslations();
  const [status, setStatus] = useState<{
    connected: boolean;
    qr?: string;
  } | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.qr) {
          const qrDataUrl = await QRCode.toDataURL(data.qr, {
            width: 300,
            margin: 2,
          });
          setQrImage(qrDataUrl);
        } else {
          setQrImage(null);
        }
      }
    } catch {
      console.error("Failed to fetch status");
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // Poll for status updates
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch("/api/whatsapp/connect", { method: "POST" });
      if (res.ok) {
        toast.success(t("settings.connectionInitiated"));
        // Start polling more frequently
        setTimeout(fetchStatus, 1000);
      } else {
        throw new Error();
      }
    } catch {
      toast.error(t("errors.general"));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const res = await fetch("/api/whatsapp/disconnect", { method: "POST" });
      if (res.ok) {
        toast.success(t("settings.disconnectedSuccess"));
        setStatus({ connected: false });
        setQrImage(null);
      } else {
        throw new Error();
      }
    } catch {
      toast.error(t("errors.general"));
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("settings.whatsapp")}</h1>
        <Button variant="outline" size="icon" onClick={fetchStatus}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("settings.connectionStatus")}</CardTitle>
            <Badge variant={status?.connected ? "default" : "secondary"}>
              {status?.connected ? (
                <>
                  <Wifi className="me-1 h-3 w-3" />
                  {t("settings.connected")}
                </>
              ) : (
                <>
                  <WifiOff className="me-1 h-3 w-3" />
                  {t("settings.disconnected")}
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            {status?.connected
              ? t("settings.connectedDesc")
              : t("settings.scanQRDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!status?.connected && qrImage && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="font-medium">{t("settings.scanQR")}</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImage}
                  alt="WhatsApp QR Code"
                  className="w-[300px] h-[300px]"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {t("settings.scanQRDesc")}
              </p>
            </div>
          )}

          {!status?.connected && !qrImage && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {t("settings.clickToConnect")}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            {status?.connected ? (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {t("settings.disconnect")}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isConnecting && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {t("settings.connect")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
