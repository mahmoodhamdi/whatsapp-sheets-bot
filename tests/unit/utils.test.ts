import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge class names", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      "base-class",
      isActive && "active",
      isDisabled && "disabled"
    );

    expect(result).toBe("base-class active");
  });

  it("should handle tailwind conflicts - padding", () => {
    // twMerge should resolve conflicting Tailwind classes
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("should handle tailwind conflicts - colors", () => {
    const result = cn("bg-red-500", "bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("should handle tailwind conflicts - text size", () => {
    const result = cn("text-sm", "text-lg");
    expect(result).toBe("text-lg");
  });

  it("should handle array of classes", () => {
    const result = cn(["class1", "class2"]);
    expect(result).toBe("class1 class2");
  });

  it("should handle empty strings", () => {
    const result = cn("class1", "", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle null and undefined", () => {
    const result = cn("class1", null, undefined, "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle object syntax", () => {
    const result = cn({
      "base-class": true,
      "active-class": true,
      "disabled-class": false,
    });

    expect(result).toContain("base-class");
    expect(result).toContain("active-class");
    expect(result).not.toContain("disabled-class");
  });

  it("should handle mixed inputs", () => {
    const result = cn(
      "base",
      ["array-class"],
      { "object-class": true },
      false && "conditional"
    );

    expect(result).toContain("base");
    expect(result).toContain("array-class");
    expect(result).toContain("object-class");
  });
});
