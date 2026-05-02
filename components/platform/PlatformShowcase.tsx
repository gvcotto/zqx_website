"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { titleCase } from "@/lib/text";
import Reveal from "@/components/Reveal";

type PlatformShowcaseProps = {
  locale: Locale;
  platform: Dictionary["platformPage"];
};

type PreviewTab = keyof Dictionary["platformPage"]["previewTabs"];

type ChartPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
};

type WorkflowStep = {
  label: string;
  value: number;
  unit: string;
  tone: "blue" | "green" | "muted";
};

const DASHBOARD_SERIES = [2480, 2620, 1040, 1960, 1810, 2250, 990, 3050, 1420, 1880, 1705, 2140, 4250, 1790, 2280, 1650, 2040, 1980];
const DASHBOARD_LABELS = [
  "01 Sep",
  "02 Sep",
  "03 Sep",
  "04 Sep",
  "05 Sep",
  "06 Sep",
  "07 Sep",
  "08 Sep",
  "09 Sep",
  "10 Sep",
  "11 Sep",
  "12 Sep",
  "13 Sep",
  "14 Sep",
  "15 Sep",
  "16 Sep",
  "17 Sep",
  "18 Sep",
];

const FORECAST_HISTORY = [1000, 1820, 980, 1600, 2220, 1480, 1800, 1180, 1000, 1760];
const FORECAST_PREDICTION = [1200, 1080, 2120, 940, 2360, 1740, 1560, 2280];

const CHART_COLORS = {
  blue: "#0F62FE",
  blueStroke: "rgba(15,98,254,0.9)",
  green: "#24D68A",
  greenStroke: "rgba(36,214,138,0.95)",
  muted: "#525252",
  grid: "rgba(22,22,22,0.12)",
};

const WORKFLOW_TONES: Record<WorkflowStep["tone"], { fill: string; glow: string; stroke: string }> = {
  blue: {
    fill: "#0F62FE",
    glow: "rgba(15,98,254,0.18)",
    stroke: "rgba(15,98,254,0.58)",
  },
  green: {
    fill: "#24D68A",
    glow: "rgba(36,214,138,0.2)",
    stroke: "rgba(36,214,138,0.68)",
  },
  muted: {
    fill: "#525252",
    glow: "rgba(82,82,82,0.14)",
    stroke: "rgba(82,82,82,0.42)",
  },
};

type PlatformUiStrings = {
  revenue: string;
  capabilities: string;
  liveContext: string;
  actionStream: string;
  ready: string;
  queued: string;
  assistantPrompt: string;
  assistantReply: string;
  actionItems: string[];
  forecastAxis: string[];
  workflow: {
    laneLabel: string;
    throughputLabel: string;
    liveLabel: string;
    steps: WorkflowStep[];
  };
};

function getPlatformUi(locale: Locale): PlatformUiStrings {
  if (locale === "es") {
    return {
      revenue: "Ingresos",
      capabilities: "Capacidades",
      liveContext: "Contexto activo",
      actionStream: "Flujo de acciones",
      ready: "Listo",
      queued: "En cola",
      assistantPrompt: "Genera un resumen de la ultima tendencia.",
      assistantReply: "Resumen listo. Incluye acciones sugeridas y anomalias detectadas.",
      actionItems: ["Sincronizar resumen predictivo", "Actualizar workspace comercial", "Compartir reporte semanal"],
      forecastAxis: ["Ago '23", "08 Ago", "16 Ago", "24 Ago", "Sep", "04 Sep", "12 Sep", "16 Sep"],
      workflow: {
        laneLabel: "Workflow vivo",
        throughputLabel: "datos/min",
        liveLabel: "Activo",
        steps: [
          { label: "Entrada", value: 72, unit: "docs", tone: "blue" },
          { label: "Validar", value: 48, unit: "checks", tone: "green" },
          { label: "Aprobar", value: 31, unit: "ok", tone: "blue" },
          { label: "Reporte", value: 96, unit: "sync", tone: "green" },
        ],
      },
    };
  }

  return {
    revenue: "Revenue",
    capabilities: "Capabilities",
    liveContext: "Live context",
    actionStream: "Action stream",
    ready: "Ready",
    queued: "Queued",
    assistantPrompt: "Generate a summary for the latest trend.",
    assistantReply: "Summary ready. Suggested actions and anomalies are included.",
    actionItems: ["Sync forecast summary", "Update sales workspace", "Share weekly report"],
    forecastAxis: ["Aug '23", "08 Aug", "16 Aug", "24 Aug", "Sep", "04 Sep", "12 Sep", "16 Sep"],
    workflow: {
      laneLabel: "Live workflow",
      throughputLabel: "data/min",
      liveLabel: "Live",
      steps: [
        { label: "Intake", value: 72, unit: "docs", tone: "blue" },
        { label: "Validate", value: 48, unit: "checks", tone: "green" },
        { label: "Approve", value: 31, unit: "ok", tone: "blue" },
        { label: "Report", value: 96, unit: "sync", tone: "green" },
      ],
    },
  };
}

function buildPoints(
  values: number[],
  labels: string[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  options?: { minValue?: number; maxValue?: number; startIndex?: number; totalCount?: number },
) {
  const minValue = options?.minValue ?? Math.min(...values);
  const maxValue = options?.maxValue ?? Math.max(...values);
  const startIndex = options?.startIndex ?? 0;
  const totalCount = options?.totalCount ?? values.length;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const scale = Math.max(maxValue - minValue, 1);
  const denominator = Math.max(totalCount - 1, 1);

  return values.map((value, index) => {
    const x = padding.left + ((startIndex + index) / denominator) * innerWidth;
    const normalized = (value - minValue) / scale;
    const y = padding.top + (1 - normalized) * innerHeight;

    return {
      x,
      y,
      value,
      label: labels[startIndex + index] ?? labels[labels.length - 1] ?? "",
    };
  });
}

function toLinePath(points: ChartPoint[]) {
  if (points.length === 0) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function toAreaPath(points: ChartPoint[], baseline: number) {
  if (points.length === 0) return "";
  const line = toLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

function DashboardVisualization({
  platform,
  ui,
  compact = false,
}: {
  platform: Dictionary["platformPage"];
  ui: PlatformUiStrings;
  compact?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(12);
  const [isPaused, setIsPaused] = useState(false);
  const width = compact ? 560 : 720;
  const height = compact ? 280 : 360;
  const padding = useMemo(
    () => (compact ? { top: 22, right: 18, bottom: 28, left: 40 } : { top: 26, right: 18, bottom: 34, left: 52 }),
    [compact],
  );

  const points = useMemo(() => buildPoints(DASHBOARD_SERIES, DASHBOARD_LABELS, width, height, padding), [height, padding, width]);
  const areaPath = useMemo(() => toAreaPath(points, height - padding.bottom), [height, padding.bottom, points]);
  const linePath = useMemo(() => toLinePath(points), [points]);
  const activePoint = points[activeIndex] ?? points[points.length - 1];
  const minValue = Math.min(...DASHBOARD_SERIES);
  const maxValue = Math.max(...DASHBOARD_SERIES);
  const dashboardPathId = compact ? "dashboard-live-path-compact" : "dashboard-live-path";

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % DASHBOARD_SERIES.length);
    }, compact ? 1350 : 1550);

    return () => window.clearInterval(interval);
  }, [compact, isPaused]);

  return (
    <article
      className={`surface-card relative overflow-hidden rounded-[2rem] border border-brand-border ${compact ? "p-5" : "p-6 md:p-7"}`}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,98,254,0.12),transparent_32%)]" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-blue">{platform.dashboard.eyebrow}</p>
            {!compact ? <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{titleCase(platform.dashboard.title)}</h2> : null}
            {!compact ? <p className="mt-3 text-sm leading-6 text-brand-muted md:text-base">{platform.dashboard.body}</p> : null}
          </div>

          <div className="surface-soft min-w-[11rem] rounded-[1.4rem] border border-brand-border px-4 py-3">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{platform.dashboard.totalLabel}</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-charcoal">{platform.dashboard.totalValue}</div>
            <div className="mt-2 text-sm text-brand-blue">{activePoint?.label}</div>
          </div>
        </div>

        <div className={`mt-5 ${compact ? "" : "grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-start"}`}>
          <div className="surface-soft relative overflow-hidden rounded-[1.6rem] border border-brand-border px-3 py-3 md:px-4 md:py-4" onMouseLeave={() => setIsPaused(false)}>
            <div className="flex items-center justify-between gap-4 px-2 pb-2">
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{platform.dashboard.chartLabel}</div>
                <div className="mt-1 text-sm text-brand-blue">{activePoint?.label}</div>
              </div>
              <div className="text-right">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{ui.revenue}</div>
                <div className="mt-1 text-lg font-semibold text-brand-charcoal">{activePoint?.value.toLocaleString()}</div>
              </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={titleCase(platform.dashboard.title)}>
              <defs>
                <linearGradient id={compact ? "dashboard-area-compact" : "dashboard-area"} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(15,98,254,0.30)" />
                  <stop offset="100%" stopColor="rgba(15,98,254,0.04)" />
                </linearGradient>
              </defs>

              {Array.from({ length: 5 }).map((_, index) => {
                const y = padding.top + ((height - padding.top - padding.bottom) / 4) * index;
                const value = Math.round(maxValue - ((maxValue - minValue) / 4) * index);

                return (
                  <g key={value}>
                    <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={CHART_COLORS.grid} strokeDasharray="3 10" />
                    {!compact ? (
                      <text x={6} y={y + 4} fill={CHART_COLORS.muted} fontSize="12">
                        {value.toLocaleString()}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              <path d={areaPath} fill={`url(#${compact ? "dashboard-area-compact" : "dashboard-area"})`}>
                <animate attributeName="opacity" values="0.68;1;0.68" dur="4.8s" repeatCount="indefinite" />
              </path>
              <path id={dashboardPathId} d={linePath} fill="none" stroke={CHART_COLORS.blueStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d={linePath} fill="none" stroke="rgba(15,98,254,0.34)" strokeWidth="9" strokeDasharray="1 28" strokeLinecap="round" strokeLinejoin="round">
                <animate attributeName="stroke-dashoffset" from="0" to="-58" dur="2.6s" repeatCount="indefinite" />
              </path>

              {activePoint ? (
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={padding.top}
                  y2={height - padding.bottom}
                  stroke="rgba(15,98,254,0.18)"
                  strokeWidth="2"
                  strokeDasharray="5 7"
                  className="transition-all duration-700 ease-out"
                />
              ) : null}

              {[0, 1].map((packetIndex) => (
                <circle key={`dashboard-packet-${packetIndex}`} r={packetIndex === 0 ? 4.5 : 3.5} fill={packetIndex === 0 ? CHART_COLORS.blue : CHART_COLORS.green} opacity="0.86">
                  <animateMotion dur={packetIndex === 0 ? "5.8s" : "7.1s"} begin={`${packetIndex * 1.4}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${dashboardPathId}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.9;0.9;0" dur={packetIndex === 0 ? "5.8s" : "7.1s"} begin={`${packetIndex * 1.4}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {points.map((point, index) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r={index === activeIndex ? 8 : 0} fill="rgba(15,98,254,0.14)" />
                  <circle cx={point.x} cy={point.y} r={index === activeIndex ? 5 : 3} fill={CHART_COLORS.blue} />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="14"
                    fill="transparent"
                    onMouseEnter={() => {
                      setIsPaused(true);
                      setActiveIndex(index);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </g>
              ))}

              {["01 Sep", "06 Sep", "11 Sep", "16 Sep"].map((label, index) => {
                const target = points[[0, 5, 10, 15][index]];
                if (!target) return null;

                return (
                  <text key={label} x={target.x - 16} y={height - 6} fill={CHART_COLORS.muted} fontSize="12">
                    {label}
                  </text>
                );
              })}
            </svg>

            {activePoint ? (
              <div
                className="pointer-events-none absolute z-10 hidden min-w-[10rem] -translate-x-1/2 rounded-2xl border border-brand-border bg-white/92 px-4 py-3 text-sm shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-700 ease-out md:block"
                style={{
                  left: `${(activePoint.x / width) * 100}%`,
                  top: `calc(${(activePoint.y / height) * 100}% - 1.5rem)`,
                }}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">{activePoint.label}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-brand-blue" />
                  <span className="font-medium text-brand-charcoal">{activePoint.value.toLocaleString()}</span>
                </div>
              </div>
            ) : null}
          </div>

          {!compact ? (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {platform.dashboard.metrics.map((metric) => (
                <div key={metric.label} className="surface-soft rounded-[1.4rem] border border-brand-border px-4 py-4">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{metric.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-charcoal">{metric.value}</div>
                </div>
              ))}
              <div className="surface-soft rounded-[1.4rem] border border-brand-border px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{ui.capabilities}</div>
                <div className="mt-3 space-y-2">
                  {platform.dashboard.bullets.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-brand-muted">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-blue" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ForecastVisualization({
  platform,
  ui,
  compact = false,
}: {
  platform: Dictionary["platformPage"];
  ui: PlatformUiStrings;
  compact?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const width = compact ? 560 : 700;
  const height = compact ? 280 : 360;
  const padding = useMemo(
    () => (compact ? { top: 22, right: 24, bottom: 30, left: 40 } : { top: 26, right: 24, bottom: 34, left: 52 }),
    [compact],
  );
  const joinedValues = [...FORECAST_HISTORY, ...FORECAST_PREDICTION];
  const labels = Array.from(
    { length: joinedValues.length },
    (_, index) => ui.forecastAxis[Math.floor((index / (joinedValues.length - 1)) * (ui.forecastAxis.length - 1))],
  );
  const minValue = Math.min(...joinedValues);
  const maxValue = Math.max(...joinedValues);
  const totalCount = joinedValues.length;

  const historyPoints = useMemo(
    () => buildPoints(FORECAST_HISTORY, labels, width, height, padding, { minValue, maxValue, totalCount }),
    [height, labels, maxValue, minValue, padding, totalCount, width],
  );
  const predictionPoints = useMemo(
    () =>
      buildPoints(FORECAST_PREDICTION, labels, width, height, padding, {
        minValue,
        maxValue,
        startIndex: FORECAST_HISTORY.length,
        totalCount,
      }),
    [height, labels, maxValue, minValue, padding, totalCount, width],
  );

  const historyArea = useMemo(() => toAreaPath(historyPoints, height - padding.bottom), [height, historyPoints, padding.bottom]);
  const historyLine = useMemo(() => toLinePath(historyPoints), [historyPoints]);
  const predictionArea = useMemo(() => toAreaPath(predictionPoints, height - padding.bottom), [height, padding.bottom, predictionPoints]);
  const predictionLine = useMemo(() => toLinePath(predictionPoints), [predictionPoints]);
  const activePoint = predictionPoints[activeIndex] ?? predictionPoints[0];
  const projectionX = predictionPoints[0]?.x ?? width / 2;

  return (
    <article className={`surface-card relative overflow-hidden rounded-[2rem] border border-brand-border ${compact ? "p-5" : "p-6 md:p-7"}`} onMouseLeave={() => setActiveIndex(0)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(36,214,138,0.16),transparent_30%)]" />
      <div className="relative">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-blue">{platform.forecast.eyebrow}</p>
        {!compact ? <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{titleCase(platform.forecast.title)}</h2> : null}
        {!compact ? <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted md:text-base">{platform.forecast.body}</p> : null}

        {!compact ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {platform.forecast.bullets.map((item) => (
              <span key={item} className="surface-soft rounded-full border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-muted">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        <div className="surface-soft relative mt-5 overflow-hidden rounded-[1.6rem] border border-brand-border px-3 py-3 md:px-4 md:py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 px-2 pb-2">
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-brand-blue" />
                <span>{platform.forecast.historicalLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#24D68A]" />
                <span>{platform.forecast.forecastLabel}</span>
              </div>
            </div>
            {!compact ? <div className="text-sm text-brand-muted">{platform.forecast.tooltipDate}</div> : null}
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={titleCase(platform.forecast.title)}>
            <defs>
              <linearGradient id={compact ? "forecast-history-compact" : "forecast-history"} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(15,98,254,0.22)" />
                <stop offset="100%" stopColor="rgba(15,98,254,0.04)" />
              </linearGradient>
              <linearGradient id={compact ? "forecast-projection-compact" : "forecast-projection"} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(36,214,138,0.22)" />
                <stop offset="100%" stopColor="rgba(36,214,138,0.04)" />
              </linearGradient>
            </defs>

            {Array.from({ length: 5 }).map((_, index) => {
              const y = padding.top + ((height - padding.top - padding.bottom) / 4) * index;
              const value = Math.round(maxValue - ((maxValue - minValue) / 4) * index);

              return (
                <g key={value}>
                  <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={CHART_COLORS.grid} strokeDasharray="3 10" />
                  {!compact ? (
                    <text x={8} y={y + 4} fill={CHART_COLORS.muted} fontSize="12">
                      {value.toLocaleString()}
                    </text>
                  ) : null}
                </g>
              );
            })}

            <rect x={projectionX} y={padding.top} width={width - padding.right - projectionX} height={height - padding.top - padding.bottom} fill="rgba(36,214,138,0.05)" />
            <line x1={projectionX} x2={projectionX} y1={padding.top} y2={height - padding.bottom} stroke={CHART_COLORS.grid} strokeDasharray="6 8" />

            <path d={historyArea} fill={`url(#${compact ? "forecast-history-compact" : "forecast-history"})`} />
            <path d={historyLine} fill="none" stroke={CHART_COLORS.blueStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            <path d={predictionArea} fill={`url(#${compact ? "forecast-projection-compact" : "forecast-projection"})`} />
            <path d={predictionLine} fill="none" stroke={CHART_COLORS.greenStroke} strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round" strokeLinejoin="round" />

            {predictionPoints.map((point, index) => (
              <g key={`${point.label}-${index}`}>
                <circle cx={point.x} cy={point.y} r={index === activeIndex ? 8 : 0} fill="rgba(36,214,138,0.18)" />
                <circle cx={point.x} cy={point.y} r={index === activeIndex ? 5 : 3.5} fill={CHART_COLORS.green} />
                <circle cx={point.x} cy={point.y} r="14" fill="transparent" onMouseEnter={() => setActiveIndex(index)} style={{ cursor: "pointer" }} />
              </g>
            ))}

            {ui.forecastAxis.map((label, index) => {
              const x = padding.left + (index / (ui.forecastAxis.length - 1)) * (width - padding.left - padding.right);
              return (
                <text key={label} x={x - 18} y={height - 6} fill={CHART_COLORS.muted} fontSize="12">
                  {label}
                </text>
              );
            })}
          </svg>

          {activePoint ? (
            <div
              className="pointer-events-none absolute z-10 hidden min-w-[11rem] -translate-x-1/2 rounded-2xl border border-brand-border bg-white/92 px-4 py-3 text-sm shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-md md:block"
              style={{
                left: `${(activePoint.x / width) * 100}%`,
                top: `calc(${(activePoint.y / height) * 100}% - 1.6rem)`,
              }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">{platform.forecast.tooltipDate}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#24D68A]" />
                <span className="font-medium text-brand-charcoal">
                  {platform.forecast.tooltipValueLabel}: {activePoint.value.toLocaleString()}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function AssistantVisualization({
  platform,
  ui,
  compact = false,
}: {
  platform: Dictionary["platformPage"];
  ui: PlatformUiStrings;
  compact?: boolean;
}) {
  return (
    <article className={`surface-card relative overflow-hidden rounded-[2rem] border border-brand-border ${compact ? "p-5" : "p-6 md:p-7"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(15,98,254,0.12),transparent_34%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-blue">{platform.assistant.eyebrow}</p>
            {!compact ? <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{titleCase(platform.assistant.title)}</h2> : null}
            {!compact ? <p className="mt-3 text-sm leading-6 text-brand-muted md:text-base">{platform.assistant.body}</p> : null}
          </div>
          <div className="surface-soft rounded-full border border-brand-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">{ui.liveContext}</div>
        </div>

        <div className={`mt-5 ${compact ? "" : "grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]"}`}>
          <div className="surface-soft rounded-[1.6rem] border border-brand-border p-4">
            <div className="space-y-3">
              {platform.assistant.messages.map((message, index) => {
                const isAssistant = message.role === "assistant";
                return (
                  <div key={`${message.role}-${index}`} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[86%] rounded-[1.3rem] px-4 py-3 text-sm leading-6 ${
                        isAssistant ? "bg-white/78 text-brand-charcoal shadow-[0_10px_24px_rgba(15,23,42,0.08)]" : "bg-brand-blue text-white"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`grid gap-3 ${compact ? "mt-4" : ""}`}>
            <div className="surface-soft rounded-[1.4rem] border border-brand-border px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{platform.assistant.actionsTitle}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {platform.assistant.actions.map((action) => (
                  <button key={action} type="button" className="focus-ring pressable rounded-full border border-brand-border bg-white/75 px-3 py-2 text-sm font-medium text-brand-charcoal hover:border-brand-blue">
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {!compact ? (
              <div className="surface-soft rounded-[1.4rem] border border-brand-border px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{ui.actionStream}</div>
                <div className="mt-3 space-y-3">
                  {ui.actionItems.map((item, index) => (
                    <div key={item} className="flex items-center justify-between gap-3 text-sm text-brand-muted">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-[#24D68A]" : "bg-brand-blue"}`} />
                        <span>{item}</span>
                      </div>
                      <span className="text-brand-charcoal">{index === 0 ? ui.ready : ui.queued}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ModuleVisual({ index, ui }: { index: number; ui: PlatformUiStrings }) {
  if (index === 0) {
    const dashboardPreviewValues = DASHBOARD_SERIES.slice(10, 16);
    const maxDashboardPreviewValue = Math.max(...dashboardPreviewValues);
    const dashboardPreviewPath = "M20 84L66 64L112 78L158 38L204 90L252 54";

    return (
      <div className="relative h-28 overflow-hidden rounded-[1.2rem] border border-brand-border bg-[linear-gradient(180deg,rgba(15,98,254,0.10),rgba(15,98,254,0.02))]">
        <svg viewBox="0 0 280 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="dashboard-module-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(15,98,254,0.28)" />
              <stop offset="100%" stopColor="rgba(15,98,254,0.03)" />
            </linearGradient>
          </defs>

          <path d={`${dashboardPreviewPath} L252 101 L20 101 Z`} fill="url(#dashboard-module-fill)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4.6s" repeatCount="indefinite" />
          </path>
          <path id="dashboard-module-path" d={dashboardPreviewPath} fill="none" stroke="#0F62FE" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={dashboardPreviewPath} fill="none" stroke="rgba(15,98,254,0.28)" strokeWidth="8" strokeDasharray="1 24" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="2.8s" repeatCount="indefinite" />
          </path>

          {dashboardPreviewValues.map((value, pointIndex) => {
            const barHeight = 20 + (value / maxDashboardPreviewValue) * 50;
            const x = 24 + pointIndex * 40;
            const y = 102 - barHeight;

            return (
              <rect key={value} x={x} y={y} width="18" height={barHeight} rx="5" fill="rgba(15,98,254,0.22)">
                <animate attributeName="height" values={`${barHeight * 0.72};${barHeight};${barHeight * 0.84};${barHeight}`} dur={`${3 + pointIndex * 0.25}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${102 - barHeight * 0.72};${y};${102 - barHeight * 0.84};${y}`} dur={`${3 + pointIndex * 0.25}s`} repeatCount="indefinite" />
              </rect>
            );
          })}

          <circle r="4.5" fill="#24D68A">
            <animateMotion dur="5.2s" repeatCount="indefinite" rotate="auto">
              <mpath href="#dashboard-module-path" />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.95;0.95;0" dur="5.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="relative h-28 overflow-hidden rounded-[1.2rem] border border-brand-border bg-[linear-gradient(180deg,rgba(36,214,138,0.10),rgba(36,214,138,0.02))]">
        <svg viewBox="0 0 280 120" className="h-full w-full">
          <path d="M12 90L60 32L90 96L128 50L170 82L208 40L268 70" fill="none" stroke="#0F62FE" strokeWidth="4" strokeLinecap="round" />
          <path d="M168 78L188 92L208 36L232 100L268 20" fill="none" stroke="#24D68A" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="relative h-28 overflow-hidden rounded-[1.2rem] border border-brand-border bg-[linear-gradient(180deg,rgba(255,255,255,0.70),rgba(255,255,255,0.18))] p-3">
        <div className="ml-auto w-[72%] rounded-2xl bg-brand-blue px-3 py-2 text-xs text-white">{ui.assistantPrompt}</div>
        <div className="mt-2 w-[78%] rounded-2xl bg-white/90 px-3 py-2 text-xs text-brand-charcoal shadow-[0_8px_18px_rgba(15,23,42,0.08)]">{ui.assistantReply}</div>
      </div>
    );
  }

  const workflowSteps = ui.workflow.steps.slice(0, 4);
  const maxWorkflowValue = Math.max(...workflowSteps.map((step) => step.value), 1);
  const workflowThroughput = Math.max(...workflowSteps.map((step) => step.value));
  const workflowRoute = "M22 68 C70 38 104 38 138 68 S210 98 258 62";
  const nodePositions = [
    { x: 30, y: 68 },
    { x: 104, y: 42 },
    { x: 178, y: 86 },
    { x: 250, y: 62 },
  ];

  return (
    <div className="relative h-32 overflow-hidden rounded-[1.2rem] border border-brand-border bg-[linear-gradient(180deg,rgba(15,98,254,0.08),rgba(36,214,138,0.06))]">
      <div className="absolute inset-x-3 top-2.5 z-10 flex items-center justify-between gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.15em]">
        <span className="inline-flex items-center gap-1.5 text-brand-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-[#24D68A]" />
          {ui.workflow.liveLabel}
        </span>
        <span className="text-brand-blue">
          {workflowThroughput} {ui.workflow.throughputLabel}
        </span>
      </div>

      <svg viewBox="0 0 280 136" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="workflow-route-gradient" x1="20" x2="260" y1="0" y2="136" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(15,98,254,0.76)" />
            <stop offset="100%" stopColor="rgba(36,214,138,0.82)" />
          </linearGradient>
          <filter id="workflow-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="rgba(15,23,42,0.18)" />
          </filter>
        </defs>

        <path d={workflowRoute} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="10" strokeLinecap="round" />
        <path id="workflow-data-route" d={workflowRoute} fill="none" stroke="url(#workflow-route-gradient)" strokeWidth="3.2" strokeDasharray="7 9" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="0" to="-45" dur="2.8s" repeatCount="indefinite" />
        </path>

        {workflowSteps.map((step, stepIndex) => {
          const tone = WORKFLOW_TONES[step.tone];
          const position = nodePositions[stepIndex] ?? nodePositions[nodePositions.length - 1];
          const weight = step.value / maxWorkflowValue;
          const radius = 5.5 + weight * 3.8;

          return (
            <g key={step.label} filter="url(#workflow-soft-shadow)">
              <circle cx={position.x} cy={position.y} r={radius + 5} fill={tone.glow}>
                <animate attributeName="r" values={`${radius + 4};${radius + 7};${radius + 4}`} dur={`${3.2 + stepIndex * 0.35}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={position.x} cy={position.y} r={radius + 3} fill="rgba(255,255,255,0.94)" stroke={tone.stroke} strokeWidth="1.5" />
              <circle cx={position.x} cy={position.y} r={radius} fill={tone.fill} />
              <text x={position.x} y={position.y + 2.5} fill="#FFFFFF" textAnchor="middle" fontSize="6.5" fontWeight="700">
                {step.value}
              </text>
            </g>
          );
        })}

        {workflowSteps.map((step, stepIndex) => {
          const tone = WORKFLOW_TONES[step.tone];
          const weight = step.value / maxWorkflowValue;
          const duration = Math.max(4.2, 8.2 - weight * 2.6);

          return (
            <circle key={`${step.label}-packet`} r={2.2 + weight * 1.5} fill={tone.fill}>
              <animateMotion dur={`${duration}s`} begin={`${stepIndex * 0.55}s`} repeatCount="indefinite" rotate="auto">
                <mpath href="#workflow-data-route" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur={`${duration}s`} begin={`${stepIndex * 0.55}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {workflowSteps.map((step, stepIndex) => {
          const tone = WORKFLOW_TONES[step.tone];
          const weight = step.value / maxWorkflowValue;
          const position = nodePositions[stepIndex] ?? nodePositions[nodePositions.length - 1];
          const barWidth = 36;

          return (
            <g key={`${step.label}-metric`}>
              <text x={position.x} y="117" fill="#161616" textAnchor="middle" fontSize="8" fontWeight="700">
                {step.label}
              </text>
              <text x={position.x} y="127" fill="#525252" textAnchor="middle" fontSize="7">
                {step.value} {step.unit}
              </text>
              <rect x={position.x - barWidth / 2} y="130" width={barWidth} height="3" rx="1.5" fill="rgba(22,22,22,0.08)" />
              <rect x={position.x - barWidth / 2} y="130" width={Math.max(6, barWidth * weight)} height="3" rx="1.5" fill={tone.fill} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ModuleGrid({ platform, ui }: { platform: Dictionary["platformPage"]; ui: PlatformUiStrings }) {
  return (
    <article id="platform-modules" className="surface-card rounded-[2rem] border border-brand-border p-6 md:p-7">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-blue">{platform.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{titleCase(platform.modules.title)}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted md:text-base">{platform.modules.subtitle}</p>

      <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2">
        {platform.modules.items.map((item, index) => (
          <div key={item.title} className="hover-lift surface-soft flex h-full min-h-[18rem] flex-col rounded-[1.6rem] border border-brand-border p-4">
            <ModuleVisual index={index} ui={ui} />
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-brand-charcoal">{titleCase(item.title)}</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function PlatformShowcase({ locale, platform }: PlatformShowcaseProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("dashboards");
  const ui = getPlatformUi(locale);

  return (
    <>
      <section className="border-b border-brand-border/80 py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
            <Reveal className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{platform.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{titleCase(platform.title)}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-muted md:text-xl">{platform.subtitle}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={site.platformSystemUrl} target="_blank" rel="noreferrer" className="focus-ring pressable inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#0043ce]">
                  See our demo
                </a>
                <Link href={`/${locale}/contact`} className="focus-ring pressable inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#0043ce]">
                  {platform.ctaPrimary}
                </Link>
                <a href="#platform-modules" className="focus-ring pressable surface-soft inline-flex rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-charcoal hover:border-brand-blue">
                  {platform.ctaSecondary}
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {platform.bullets.map((item, index) => (
                  <div key={item} className="surface-soft flex items-start gap-3 rounded-[1.4rem] border border-brand-border px-4 py-4">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-blue text-sm font-semibold text-white">{index + 1}</div>
                    <p className="text-sm leading-6 text-brand-muted">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="surface-card rounded-[2rem] border border-brand-border p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(platform.previewTabs).map(([key, label]) => {
                    const isActive = activeTab === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          startTransition(() => {
                            setActiveTab(key as PreviewTab);
                          });
                        }}
                        className={`focus-ring pressable rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          isActive ? "border-brand-blue bg-brand-blue text-white" : "surface-soft border-brand-border text-brand-charcoal hover:border-brand-blue"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  {activeTab === "dashboards" ? <DashboardVisualization platform={platform} ui={ui} compact /> : null}
                  {activeTab === "forecasting" ? <ForecastVisualization platform={platform} ui={ui} compact /> : null}
                  {activeTab === "assistants" ? <AssistantVisualization platform={platform} ui={ui} compact /> : null}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="container">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <Reveal>
              <DashboardVisualization platform={platform} ui={ui} />
            </Reveal>
            <Reveal delay={70}>
              <ForecastVisualization platform={platform} ui={ui} />
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
            <Reveal>
              <AssistantVisualization platform={platform} ui={ui} />
            </Reveal>
            <Reveal delay={70}>
              <ModuleGrid platform={platform} ui={ui} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
