"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  triggerType: string;
  response: string;
  priority: number;
  isActive: boolean;
}

export default function RulesPage() {
  const t = useTranslations();
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rules");
      const data = await res.json();
      setRules(data);
    } catch {
      toast.error(t("errors.general"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/rules/${id}/toggle`, { method: "PATCH" });
      if (res.ok) {
        const updated = await res.json();
        setRules(rules.map((r) => (r.id === id ? updated : r)));
      }
    } catch {
      toast.error(t("errors.general"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/rules/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(t("rules.deleted"));
        setRules(rules.filter((r) => r.id !== deleteId));
      }
    } catch {
      toast.error(t("errors.general"));
    } finally {
      setDeleteId(null);
    }
  };

  const getTriggerTypeBadge = (type: string) => {
    const typeKey = type.toLowerCase() as "exact" | "contains" | "startswith" | "regex";
    const labels: Record<string, string> = {
      exact: t("rules.types.exact"),
      contains: t("rules.types.contains"),
      starts_with: t("rules.types.startsWith"),
      regex: t("rules.types.regex"),
    };
    return labels[typeKey] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("rules.title")}</h1>
        <Button asChild data-testid="create-rule-button">
          <Link href="/dashboard/rules/new">
            <Plus className="h-4 w-4 me-2" />
            {t("rules.create")}
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("rules.name")}</TableHead>
              <TableHead>{t("rules.trigger")}</TableHead>
              <TableHead>{t("rules.triggerType")}</TableHead>
              <TableHead>{t("rules.response")}</TableHead>
              <TableHead>{t("rules.priority")}</TableHead>
              <TableHead>{t("rules.active")}</TableHead>
              <TableHead className="w-[100px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("rules.noRules")}
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule, index) => (
                <TableRow key={rule.id} data-testid={`rule-row-${index}`}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="font-mono text-sm max-w-[200px] truncate">
                    {rule.trigger}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTriggerTypeBadge(rule.triggerType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {rule.response}
                  </TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggle(rule.id)}
                      data-testid={`toggle-rule-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild data-testid={`edit-rule-${index}`}>
                        <Link href={`/dashboard/rules/${rule.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(rule.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`delete-rule-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.confirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("rules.deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="confirm-delete"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
