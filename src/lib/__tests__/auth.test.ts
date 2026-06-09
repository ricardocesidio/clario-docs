import { describe, it, expect } from "vitest"
import jwt from "jsonwebtoken"
import { signToken, verifyToken } from "../auth"

describe("auth", () => {
  const payload = { userId: "test-id", email: "test@example.com", role: "USER" }

  it("signs and verifies a valid token", () => {
    const token = signToken(payload)
    expect(typeof token).toBe("string")
    expect(token.split(".").length).toBe(3)

    const decoded = verifyToken(token)
    expect(decoded).not.toBeNull()
    expect(decoded!.userId).toBe(payload.userId)
    expect(decoded!.email).toBe(payload.email)
    expect(decoded!.role).toBe(payload.role)
  })

  it("returns null for invalid token", () => {
    const decoded = verifyToken("invalid.token.here")
    expect(decoded).toBeNull()
  })

  it("returns null for malformed token", () => {
    const decoded = verifyToken("not-a-token")
    expect(decoded).toBeNull()
  })

  it("rejects token signed with different secret", () => {
    const token = jwt.sign(payload, "different-secret")
    const decoded = verifyToken(token)
    expect(decoded).toBeNull()
  })
})
