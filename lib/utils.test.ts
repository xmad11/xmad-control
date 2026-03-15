import { describe, it, expect } from "vitest"
import { cn, debounce } from "@/lib/utils"

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", true && "visible")).toBe("base visible")
  })

  it("should merge tailwind classes correctly", () => {
    // tailwind-merge should keep the last class when conflicting
    expect(cn("p-4", "p-2")).toBe("p-2")
  })

  it("should handle undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end")
  })
})

describe("debounce utility", () => {
  it("should debounce function calls", async () => {
    let callCount = 0
    const increment = debounce(() => {
      callCount++
    }, 50)

    increment()
    increment()
    increment()

    // Should not have called yet
    expect(callCount).toBe(0)

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should have only called once
    expect(callCount).toBe(1)
  })
})
