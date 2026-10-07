import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST } from "@/app/api/contact/route";

const body = {
  name: "Fictional Contact QA",
  email: "contact-qa@example.invalid",
  message: "Synthetic contact acceptance test.",
  locale: "en",
};
const request = (payload: object = body) => new Request("https://example.invalid/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

describe("contact provider acknowledgement", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-only");
    send.mockReset();
    send.mockResolvedValue({ data: { id: "synthetic-message" }, error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("fails explicitly when provider configuration is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });

  it("acknowledges only after both messages are accepted", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0].to).toBe(body.email);
  });

  it("rejects resolved provider errors without exposing provider details", async () => {
    send.mockResolvedValue({ data: null, error: { message: "private-provider-detail" } });
    const response = await POST(request());
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Unable to send email." });
  });

  it("does not acknowledge a partial accept", async () => {
    send.mockResolvedValueOnce({ data: { id: "synthetic-first" }, error: null });
    send.mockResolvedValueOnce({ data: null, error: { message: "rejected" } });
    const response = await POST(request());
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.not.toHaveProperty("ok");
  });

  it("rejects an incomplete provider acknowledgement", async () => {
    send.mockResolvedValue({ data: null, error: null });
    expect((await POST(request())).status).toBe(500);
  });

  it("handles thrown provider failures with a generic response", async () => {
    send.mockRejectedValue(new Error("private-provider-detail"));
    const response = await POST(request());
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Unable to send email." });
  });

  it("rejects unknown client fields before sending", async () => {
    expect((await POST(request({ ...body, role: "admin" }))).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
});
