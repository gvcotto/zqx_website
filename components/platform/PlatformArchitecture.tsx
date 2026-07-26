import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";

type PlatformArchitectureProps = {
  locale: Locale;
};

type Node = {
  id: string;
  icon: string;
  iconAlt: string;
  title: string;
  desc: string;
  tone: string;
  className: string;
};

const copy = {
  es: {
    eyebrow: "Arquitectura operativa",
    title: "Como se conecta ZQX con cada empresa cliente.",
    body: "La plataforma separa gobierno ZQX, administracion de empresas y operacion diaria para que todos entiendan que ven, que administran y donde viven los datos.",
    zqxTitle: "ZQX administra empresas cliente",
    companyTitle: "Cada empresa opera sus clientes",
    zqxFlow: "Superusuario -> Admins ZQX -> Empresas -> Datos",
    companyFlow: "Login -> Usuarios -> Clientes -> Operacion -> APIs",
  },
  en: {
    eyebrow: "Operating architecture",
    title: "How ZQX connects with every client company.",
    body: "The platform separates ZQX governance, company administration, and daily operations so every stakeholder understands what they see, manage, and where data belongs.",
    zqxTitle: "ZQX manages client companies",
    companyTitle: "Each company runs its clients",
    zqxFlow: "Super user -> ZQX admins -> Companies -> Data",
    companyFlow: "Login -> Users -> Clients -> Operations -> APIs",
  },
} as const;

const toneClass: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

const markerDefs = (
  <defs>
    <marker id="pa-blue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M1,1 L11,6 L1,11 Z" fill="#2563eb" />
    </marker>
    <marker id="pa-green" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M1,1 L11,6 L1,11 Z" fill="#16a34a" />
    </marker>
    <marker id="pa-cyan" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M1,1 L11,6 L1,11 Z" fill="#0891b2" />
    </marker>
    <marker id="pa-amber" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M1,1 L11,6 L1,11 Z" fill="#d97706" />
    </marker>
  </defs>
);

function Dot({ pathId, color, delay = "0s" }: { pathId: string; color: string; delay?: string }) {
  return (
    <circle r="6" fill={color} className="drop-shadow-[0_0_9px_rgba(8,145,178,0.65)]">
      <animateMotion dur="3s" begin={delay} repeatCount="indefinite">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

function NodeCard({ node }: { node: Node }) {
  return (
    <article className={`absolute z-10 flex min-h-20 w-48 items-center gap-3 rounded-lg border border-brand-border bg-white p-3 shadow-[0_16px_34px_rgba(15,23,42,0.10)] ${node.className}`}>
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${toneClass[node.tone]}`}>
        <Image src={node.icon} alt={node.iconAlt} width={24} height={24} className="h-6 w-6 object-contain" />
      </div>
      <div>
        <h3 className="text-sm font-black leading-tight text-brand-charcoal">{node.title}</h3>
        <p className="mt-1 text-xs font-semibold leading-5 text-brand-muted">{node.desc}</p>
      </div>
    </article>
  );
}

function Lanes() {
  return (
    <>
      <div className="absolute left-5 right-5 top-6 h-28 rounded-lg border border-brand-border/80 bg-white/65" />
      <div className="absolute left-5 right-5 top-44 h-28 rounded-lg border border-brand-border/80 bg-white/65" />
      <div className="absolute bottom-6 left-5 right-5 h-28 rounded-lg border border-brand-border/80 bg-white/65" />
    </>
  );
}

function ZqxMap() {
  const nodes: Node[] = [
    { id: "owner", icon: "/images/architecture/user-cog.svg", iconAlt: "Superusuario", title: "Superusuario", desc: "Owner ZQX", tone: "blue", className: "left-[5%] top-[13%]" },
    { id: "admins", icon: "/images/architecture/users.svg", iconAlt: "Admins ZQX", title: "Admins ZQX", desc: "Asignan empresas", tone: "slate", className: "left-[38%] top-[42%]" },
    { id: "google", icon: "/images/architecture/google.svg", iconAlt: "Google OAuth", title: "Google OAuth", desc: "Identidad", tone: "green", className: "left-[70%] top-[13%]" },
    { id: "next", icon: "/images/architecture/nextdotjs.svg", iconAlt: "Next.js", title: "Next.js + Vercel", desc: "Dashboard y APIs", tone: "blue", className: "left-[70%] top-[42%]" },
    { id: "biz", icon: "/images/architecture/building-2.svg", iconAlt: "Empresas", title: "Empresas", desc: "Workspaces", tone: "green", className: "left-[64%] top-[70%]" },
    { id: "db", icon: "/images/architecture/postgresql.svg", iconAlt: "Postgres", title: "Postgres", desc: "RLS", tone: "cyan", className: "left-[84%] top-[70%] w-36" },
  ];

  return (
    <div className="relative hidden min-h-[29rem] overflow-hidden rounded-lg border border-brand-border bg-brand-surface md:block">
      <Lanes />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 390" aria-hidden="true">
        {markerDefs}
        <path id="z1" d="M210 95 C300 115 330 180 390 195" className="fill-none stroke-blue-600 stroke-[4] [marker-end:url(#pa-blue)]" />
        <path id="z2" d="M560 195 C650 180 640 100 705 92" className="fill-none stroke-emerald-600 stroke-[4] [marker-end:url(#pa-green)]" />
        <path id="z3" d="M560 205 L705 205" className="fill-none stroke-slate-400 stroke-[4] [stroke-dasharray:10_10] [marker-end:url(#pa-blue)]" />
        <path id="z4" d="M555 210 C615 245 630 295 680 310" className="fill-none stroke-blue-600 stroke-[4] [marker-end:url(#pa-blue)]" />
        <path id="z5" d="M815 310 L855 310" className="fill-none stroke-cyan-600 stroke-[4] [marker-end:url(#pa-cyan)]" />
        <Dot pathId="z1" color="#2563eb" />
        <Dot pathId="z2" color="#16a34a" delay=".4s" />
        <Dot pathId="z3" color="#94a3b8" delay=".7s" />
        <Dot pathId="z4" color="#2563eb" delay=".2s" />
        <Dot pathId="z5" color="#0891b2" delay=".5s" />
      </svg>
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}

function CompanyMap() {
  const nodes: Node[] = [
    { id: "login", icon: "/images/architecture/log-in.svg", iconAlt: "Login", title: "Login", desc: "Google o email", tone: "green", className: "left-[5%] top-[12%]" },
    { id: "users", icon: "/images/architecture/users.svg", iconAlt: "Usuarios", title: "Usuarios", desc: "Roles por empresa", tone: "slate", className: "left-[30%] top-[12%]" },
    { id: "clients", icon: "/images/architecture/building-2.svg", iconAlt: "Clientes", title: "Clientes", desc: "Leads y cuentas", tone: "green", className: "left-[49%] top-[42%]" },
    { id: "calendar", icon: "/images/architecture/calendar-days.svg", iconAlt: "Agenda", title: "Agenda", desc: "Citas y reuniones", tone: "blue", className: "left-[73%] top-[12%]" },
    { id: "billing", icon: "/images/architecture/credit-card.svg", iconAlt: "Cobros", title: "Cobros", desc: "Pagos y saldos", tone: "amber", className: "left-[73%] top-[42%]" },
    { id: "api", icon: "/images/architecture/route.svg", iconAlt: "APIs", title: "APIs", desc: "Routes", tone: "cyan", className: "left-[49%] top-[71%] w-36" },
    { id: "assistant", icon: "/images/architecture/bot.svg", iconAlt: "Asistente", title: "Asistente", desc: "FAQ / intake", tone: "blue", className: "left-[73%] top-[71%]" },
  ];

  return (
    <div className="relative hidden min-h-[31rem] overflow-hidden rounded-lg border border-brand-border bg-brand-surface md:block">
      <Lanes />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 430" aria-hidden="true">
        {markerDefs}
        <path id="c1" d="M195 95 L310 95" className="fill-none stroke-emerald-600 stroke-[4] [marker-end:url(#pa-green)]" />
        <path id="c2" d="M485 100 C510 145 500 205 525 230" className="fill-none stroke-blue-600 stroke-[4] [marker-end:url(#pa-blue)]" />
        <path id="c3" d="M650 235 C700 195 715 120 760 92" className="fill-none stroke-amber-600 stroke-[4] [marker-end:url(#pa-amber)]" />
        <path id="c4" d="M650 240 L760 240" className="fill-none stroke-amber-600 stroke-[4] [marker-end:url(#pa-amber)]" />
        <path id="c5" d="M650 245 C700 290 715 335 760 350" className="fill-none stroke-amber-600 stroke-[4] [marker-end:url(#pa-amber)]" />
        <path id="c6" d="M760 350 L650 350" className="fill-none stroke-cyan-600 stroke-[4] [marker-end:url(#pa-cyan)]" />
        <Dot pathId="c1" color="#16a34a" />
        <Dot pathId="c2" color="#2563eb" delay=".3s" />
        <Dot pathId="c3" color="#d97706" delay=".2s" />
        <Dot pathId="c4" color="#d97706" delay=".5s" />
        <Dot pathId="c5" color="#d97706" delay=".7s" />
        <Dot pathId="c6" color="#0891b2" delay=".4s" />
      </svg>
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}

function MobileList({ nodes }: { nodes: Node[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {nodes.map((node) => (
        <div key={node.id} className="flex items-center gap-3 rounded-lg border border-brand-border bg-white p-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${toneClass[node.tone]}`}>
            <Image src={node.icon} alt={node.iconAlt} width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-black">{node.title}</h3>
            <p className="text-xs font-semibold leading-5 text-brand-muted">{node.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PlatformArchitecture({ locale }: PlatformArchitectureProps) {
  const t = copy[locale];
  const zqxMobile = [
    { id: "owner", icon: "/images/architecture/user-cog.svg", iconAlt: "Superusuario", title: locale === "es" ? "Superusuario" : "Super user", desc: "Owner ZQX", tone: "blue", className: "" },
    { id: "admins", icon: "/images/architecture/users.svg", iconAlt: "Admins ZQX", title: "Admins ZQX", desc: locale === "es" ? "Asignan empresas" : "Assign companies", tone: "slate", className: "" },
    { id: "biz", icon: "/images/architecture/building-2.svg", iconAlt: "Empresas", title: locale === "es" ? "Empresas" : "Companies", desc: "Workspaces", tone: "green", className: "" },
    { id: "db", icon: "/images/architecture/postgresql.svg", iconAlt: "Postgres", title: "Postgres", desc: "RLS", tone: "cyan", className: "" },
  ];
  const companyMobile = [
    { id: "login", icon: "/images/architecture/log-in.svg", iconAlt: "Login", title: "Login", desc: locale === "es" ? "Google o email" : "Google or email", tone: "green", className: "" },
    { id: "clients", icon: "/images/architecture/building-2.svg", iconAlt: "Clientes", title: locale === "es" ? "Clientes" : "Clients", desc: locale === "es" ? "Leads y cuentas" : "Leads and accounts", tone: "green", className: "" },
    { id: "billing", icon: "/images/architecture/credit-card.svg", iconAlt: "Cobros", title: locale === "es" ? "Cobros" : "Billing", desc: locale === "es" ? "Pagos y saldos" : "Payments", tone: "amber", className: "" },
    { id: "assistant", icon: "/images/architecture/bot.svg", iconAlt: "Asistente", title: locale === "es" ? "Asistente" : "Assistant", desc: "FAQ / intake", tone: "blue", className: "" },
  ];

  return (
    <section className="border-y border-brand-border/80 py-14 md:py-20">
      <div className="container">
        <Reveal>
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{t.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{t.title}</h2>
            <p className="mt-5 text-base leading-8 text-brand-muted md:text-lg">{t.body}</p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6">
          <Reveal>
            <article className="rounded-lg border border-brand-border bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.08)]">
              <h3 className="text-2xl font-black tracking-tight">{t.zqxTitle}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-muted">{t.zqxFlow}</p>
              <div className="mt-5">
                <ZqxMap />
                <MobileList nodes={zqxMobile} />
              </div>
            </article>
          </Reveal>

          <Reveal delay={80}>
            <article className="rounded-lg border border-brand-border bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.08)]">
              <h3 className="text-2xl font-black tracking-tight">{t.companyTitle}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-muted">{t.companyFlow}</p>
              <div className="mt-5">
                <CompanyMap />
                <MobileList nodes={companyMobile} />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
