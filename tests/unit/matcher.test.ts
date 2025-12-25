import { describe, it, expect } from "vitest";
import { matchMessage, isMatch, testRule } from "@/lib/whatsapp/matcher";
import { TriggerType } from "@prisma/client";

describe("isMatch", () => {
  describe("EXACT match", () => {
    it("should match exact text", () => {
      expect(isMatch("hello", "hello", TriggerType.EXACT)).toBe(true);
    });

    it("should be case insensitive", () => {
      expect(isMatch("Hello", "hello", TriggerType.EXACT)).toBe(true);
    });

    it("should not match partial text", () => {
      expect(isMatch("hello world", "hello", TriggerType.EXACT)).toBe(false);
    });
  });

  describe("CONTAINS match", () => {
    it("should match if text contains trigger", () => {
      expect(isMatch("hello world", "world", TriggerType.CONTAINS)).toBe(true);
    });

    it("should be case insensitive", () => {
      expect(isMatch("Hello World", "world", TriggerType.CONTAINS)).toBe(true);
    });

    it("should not match if trigger not found", () => {
      expect(isMatch("hello world", "foo", TriggerType.CONTAINS)).toBe(false);
    });
  });

  describe("STARTS_WITH match", () => {
    it("should match if text starts with trigger", () => {
      expect(isMatch("hello world", "hello", TriggerType.STARTS_WITH)).toBe(true);
    });

    it("should not match if trigger is in middle", () => {
      expect(isMatch("say hello", "hello", TriggerType.STARTS_WITH)).toBe(false);
    });
  });

  describe("REGEX match", () => {
    it("should match regex pattern", () => {
      expect(isMatch("price is 100", "\\d+", TriggerType.REGEX)).toBe(true);
    });

    it("should match Arabic regex", () => {
      expect(isMatch("ما هو السعر", "سعر|كم", TriggerType.REGEX)).toBe(true);
    });

    it("should handle invalid regex gracefully", () => {
      expect(isMatch("test", "[invalid", TriggerType.REGEX)).toBe(false);
    });
  });
});

describe("matchMessage", () => {
  const rules = [
    {
      id: "1",
      trigger: "سعر|كم",
      triggerType: TriggerType.REGEX,
      response: "Price response",
      priority: 10,
      isActive: true,
    },
    {
      id: "2",
      trigger: "مرحبا",
      triggerType: TriggerType.CONTAINS,
      response: "Hello response",
      priority: 5,
      isActive: true,
    },
    {
      id: "3",
      trigger: "inactive",
      triggerType: TriggerType.EXACT,
      response: "Should not match",
      priority: 100,
      isActive: false,
    },
  ];

  it("should match highest priority rule first", () => {
    const result = matchMessage("كم السعر مرحبا", rules);
    expect(result?.id).toBe("1");
  });

  it("should skip inactive rules", () => {
    const result = matchMessage("inactive", rules);
    expect(result).toBeNull();
  });

  it("should return null if no match", () => {
    const result = matchMessage("no match here", rules);
    expect(result).toBeNull();
  });
});

describe("testRule", () => {
  it("should test rule correctly", () => {
    expect(testRule("hello world", "world", TriggerType.CONTAINS)).toBe(true);
    expect(testRule("hello world", "foo", TriggerType.CONTAINS)).toBe(false);
  });
});
