"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CONFIRMATION_TEXT = "DELETE";

export function DangerZone() {
  const t = useTranslations("accountSettings.dangerZone");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== CONFIRMATION_TEXT) {
      toast.error(t("confirmationMismatch"));
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(t("deleteSuccess"));
        // Sign out and redirect to home
        await signOut({ redirect: false });
        router.push("/");
      } else {
        const error = await response.json();
        toast.error(error.error || tErrors("general"));
      }
    } catch {
      toast.error(tErrors("general"));
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
      setConfirmText("");
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-destructive/10 p-4 text-sm">
          <p className="font-medium text-destructive">{t("warningTitle")}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>{t("warningItem1")}</li>
            <li>{t("warningItem2")}</li>
            <li>{t("warningItem3")}</li>
            <li>{t("warningItem4")}</li>
          </ul>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              {t("deleteButton")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                {t("dialogTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("dialogDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2 py-4">
              <Label htmlFor="confirm-delete">
                {t("confirmLabel", { text: CONFIRMATION_TEXT })}
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRMATION_TEXT}
                className="font-mono"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setConfirmText("")}
                disabled={isDeleting}
              >
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={confirmText !== CONFIRMATION_TEXT || isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {t("confirmDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
