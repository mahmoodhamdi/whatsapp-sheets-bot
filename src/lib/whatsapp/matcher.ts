import { TriggerType } from "@prisma/client";

interface Rule {
  id: string;
  trigger: string;
  triggerType: TriggerType;
  response: string;
  priority: number;
  isActive: boolean;
}

export function matchMessage(
  message: string,
  rules: Rule[]
): Rule | null {
  // Sort by priority (higher first)
  const sortedRules = [...rules]
    .filter((r) => r.isActive)
    .sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    if (isMatch(message, rule.trigger, rule.triggerType)) {
      return rule;
    }
  }

  return null;
}

export function isMatch(
  message: string,
  trigger: string,
  triggerType: TriggerType
): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  const normalizedTrigger = trigger.toLowerCase().trim();

  switch (triggerType) {
    case "EXACT":
      return normalizedMessage === normalizedTrigger;

    case "CONTAINS":
      return normalizedMessage.includes(normalizedTrigger);

    case "STARTS_WITH":
      return normalizedMessage.startsWith(normalizedTrigger);

    case "REGEX":
      try {
        const regex = new RegExp(trigger, "i");
        return regex.test(message);
      } catch {
        console.error("Invalid regex:", trigger);
        return false;
      }

    default:
      return false;
  }
}

export function testRule(
  testMessage: string,
  trigger: string,
  triggerType: TriggerType
): boolean {
  return isMatch(testMessage, trigger, triggerType);
}
