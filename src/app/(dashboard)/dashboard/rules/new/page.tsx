import { auth } from "@/lib/auth";
import { getCurrentUsage } from "@/lib/services/usage";
import { getSubscriptionLimits } from "@/lib/services/subscription";
import { RuleForm } from "@/components/rules/RuleForm";
import { RuleLimitWarning } from "@/components/subscription/UsageLimitWarning";

export default async function NewRulePage() {
  const session = await auth();
  const userId = session?.user?.id;

  let rulesUsed = 0;
  let rulesLimit = 1;

  if (userId) {
    const [usage, limits] = await Promise.all([
      getCurrentUsage(userId),
      getSubscriptionLimits(userId),
    ]);
    rulesUsed = usage.rulesCount;
    rulesLimit = limits.rulesLimit;
  }

  const isAtLimit = rulesLimit !== -1 && rulesUsed >= rulesLimit;

  return (
    <div className="max-w-2xl space-y-6">
      {isAtLimit && (
        <RuleLimitWarning currentRules={rulesUsed} maxRules={rulesLimit} />
      )}
      <RuleForm />
    </div>
  );
}
