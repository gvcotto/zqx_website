export const site = {
  name: "ZQX Digital Consulting",
  domain: "www.zqxconsulting.com",
  platformSystemUrl:
    process.env.NEXT_PUBLIC_PLATFORM_SYSTEM_URL ??
    (process.env.NODE_ENV === "development" ? "http://localhost:3007" : "https://system.zqxconsulting.com"),
  whatsapp: "https://wa.me/50200000000", // TODO: replace with the production number
  description:
    "AI orchestration, automation, and modern technology delivery for live operations.",
} as const;
