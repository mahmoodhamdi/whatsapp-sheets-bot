import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RuleForm } from "@/components/rules/RuleForm";

interface EditRulePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRulePage({ params }: EditRulePageProps) {
  const { id } = await params;

  const rule = await prisma.autoReplyRule.findUnique({
    where: { id },
  });

  if (!rule) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <RuleForm rule={rule} />
    </div>
  );
}
