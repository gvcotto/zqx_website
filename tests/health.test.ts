import { describe, expect, it } from "vitest";
import { GET as live } from "@/app/api/health/live/route";
import { GET as ready } from "@/app/api/health/ready/route";

describe("portable web health", () => {
  it("reports process health without calling optional external providers", async () => {
    const response = await live();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "alive" });
  });

  it("limits readiness to public content, without promising email or AI health", async () => {
    const response = await ready();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ready", scope: "public-content" });
  });
});
