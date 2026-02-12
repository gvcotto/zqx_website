export const en = {
  nav: {
    services: "Services",
    about: "About",
    contact: "Contact",
    whatsapp: "WhatsApp",
  },
  hero: {
    badge: "Modern-tech • Serious • Business-focused",
    title: "ZQX Consulting S.A.",
    tagline:
      "Boutique technology partner for business-critical systems, with senior-led execution across software, automation, data and cloud.",
    ctaPrimary: "Request a proposal",
    ctaSecondary: "View services",
    highlights: [
      { title: "Fast delivery", desc: "Weekly iterations with visible outcomes for stakeholders." },
      { title: "Senior-led execution", desc: "Hands-on technical leadership from discovery to production." },
      { title: "Business-critical focus", desc: "Reliable systems built for continuity, scale and control." },
    ],
  },
  sections: {
    servicesTitle: "Services",
    servicesSubtitle: "End-to-end delivery: product, automation, data and cloud.",
    processTitle: "How we work",
    processSubtitle: "Clear process, constant communication, measurable deliverables.",
    aboutVisionTitle: "About & Vision",
    contactTitle: "Contact",
    contactSubtitle: "Tell us what you need. We’ll reply with a clear plan, timeline and deliverables.",
  },
  aboutVision: {
    about: {
      title: "About",
      paragraphs: [
        "ZQX is a boutique technology partner for organizations running high-impact operations.",
        "Our senior-led teams turn business priorities into dependable systems with clear scope, cadence and ownership.",
      ],
    },
    vision: {
      title: "Vision",
      paragraphs: [
        "We believe business-critical systems should be resilient, understandable and ready to evolve.",
        "Our vision is to help companies move faster with stronger technical decisions and durable digital foundations.",
      ],
    },
  },
  services: [
    { title: "Web & App Development", desc: "Next.js, React, APIs, admin panels, internal apps and SaaS products." },
    { title: "Automation & Integrations", desc: "Workflows, bots, integrations with Sheets/CRM/ERP, webhooks, lightweight RPA." },
    { title: "Data & Dashboards", desc: "ETL, KPIs, BI, reporting and visualization for decision-making." },
    { title: "Infra, Cloud & DevOps", desc: "Deployments, CI/CD, observability, containers and operational best practices." },
    { title: "Architecture & IT Consulting", desc: "System design, baseline security, performance and technical roadmap." },
  ],
  servicesAccordion: {
    title: "Delivery details",
    subtitle: "Expand each service to see typical scope, stack and engagement mode.",
    deliverables: "Typical deliverables",
    tools: "Tools & stack",
    engagement: "Engagement model",
    items: [
      {
        id: "svc-web-app",
        title: "Web & App Development",
        deliverables: ["Product requirements", "Core user journeys", "Admin panel and APIs"],
        tools: ["Next.js", "React", "Node.js", "PostgreSQL"],
        engagement: "Senior-led squad working in weekly cycles with clear acceptance criteria.",
      },
      {
        id: "svc-automation",
        title: "Automation & Integrations",
        deliverables: ["Workflow mapping", "System connectors", "Operational runbooks"],
        tools: ["Webhook orchestration", "REST APIs", "Queue workers", "Automation scripts"],
        engagement: "Targeted implementation focused on reducing manual effort and process risk.",
      },
      {
        id: "svc-data",
        title: "Data & Dashboards",
        deliverables: ["KPI model", "ETL pipelines", "Executive dashboards"],
        tools: ["SQL", "dbt", "BI platforms", "Cloud storage"],
        engagement: "Iterative rollout with business stakeholders to align metrics and reporting cadence.",
      },
      {
        id: "svc-infra",
        title: "Infra, Cloud & DevOps",
        deliverables: ["Deployment pipelines", "Monitoring baseline", "Environment hardening"],
        tools: ["Docker", "CI/CD", "Cloud services", "Observability stack"],
        engagement: "Practical reliability program balancing speed, governance and cost.",
      },
      {
        id: "svc-architecture",
        title: "Architecture & IT Consulting",
        deliverables: ["Architecture blueprint", "Risk register", "Technical roadmap"],
        tools: ["Architecture reviews", "Security baseline", "Performance profiling"],
        engagement: "Advisory plus execution support for decisions that affect long-term scalability.",
      },
    ],
  },
  process: [
    { title: "Discovery", desc: "Goals, scope, risks and definition of success." },
    { title: "Design", desc: "Architecture, UX/UI and implementation plan." },
    { title: "Build", desc: "Iterative development with frequent deliverables." },
    { title: "Deploy", desc: "Release, documentation, training and handover." },
    { title: "Support", desc: "Maintenance, improvements and scaling." },
  ],
  cta: {
    title: "Ready to build something solid?",
    desc: "Share your idea or need. We’ll return a clear plan with timelines and deliverables.",
    button: "Contact",
  },
  aboutPage: {
    title: "About",
    subtitle:
      "Our mission is to operate as your boutique technology partner, delivering senior-led execution for business-critical initiatives.",
    pillars: [
      {
        title: "Clarity",
        desc: "Clear scope, priorities and reporting so decisions are faster and risks are visible early.",
      },
      {
        title: "Craft",
        desc: "High engineering standards across architecture, code quality, security basics and performance.",
      },
      {
        title: "Commitment",
        desc: "Consistent execution with ownership from planning to production and post-launch support.",
      },
    ],
    contactCta: "Contact",
  },
  contact: {
    formTitle: "Send a message",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    orEmail: "or email us at",
    success: "✅ Received. (We’ll connect real delivery next.)",
    details: "Details",
    location: "Location",
  },
  footer: {
    rights: "All rights reserved.",
  },
  language: {
    label: "Language",
    en: "English",
    es: "Español",
  },
} as const;
