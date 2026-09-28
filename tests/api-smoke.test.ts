import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/chat/route";

describe("public API smoke", () => {
  it("rejects unknown input fields", async () => {
    const response = await POST(new Request("https://www.example/api/chat", { method: "POST", body: JSON.stringify({ message: "Hello", privileged: true }) }));
    expect(response.status).toBe(400);
  });

  it("returns a bounded local response without an API key", async () => {
    const previous = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      const response = await POST(new Request("https://www.example/api/chat", { method: "POST", body: JSON.stringify({ message: "What services do you offer?", locale: "en", history: [] }) }));
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toMatchObject({ source: "local", locale: "en" });
    } finally {
      if (previous) process.env.OPENAI_API_KEY = previous;
    }
  });
});
