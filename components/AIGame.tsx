"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Point = {
  x: number;
  y: number;
};

type Signal = Point & {
  id: number;
  value: number;
  label: string;
};

type Field = Point & {
  id: number;
  rangeX: number;
  rangeY: number;
  speed: number;
  phase: number;
};

type JoystickThumb = Point & {
  active: boolean;
};

const SIGNALS: Signal[] = [
  { id: 1, x: 16, y: 24, value: 12, label: "API" },
  { id: 2, x: 31, y: 68, value: 16, label: "CRM" },
  { id: 3, x: 48, y: 31, value: 20, label: "KPI" },
  { id: 4, x: 67, y: 72, value: 18, label: "OPS" },
  { id: 5, x: 81, y: 36, value: 24, label: "AI" },
  { id: 6, x: 88, y: 82, value: 10, label: "QA" },
];

const FIELDS: Field[] = [
  { id: 1, x: 36, y: 42, rangeX: 7, rangeY: 11, speed: 0.028, phase: 0 },
  { id: 2, x: 60, y: 50, rangeX: 9, rangeY: 7, speed: 0.023, phase: 1.7 },
  { id: 3, x: 76, y: 58, rangeX: 6, rangeY: 10, speed: 0.031, phase: 3.2 },
];

const TEXT = {
  es: {
    eyebrow: "Juego IA",
    title: "ZQX AI Signal Sprint",
    subtitle: "Recolecta señales de datos, evita interferencias y deja que IA trace la ruta cuando quieras.",
    home: "Volver al home",
    reset: "Reiniciar",
    autopilot: "IA",
    manual: "Manual",
    joystick: "Joystick móvil",
    score: "Señales",
    stability: "Estabilidad",
    statusLive: "Ruta activa",
    statusWin: "Workflow completo",
    hint: "Usa flechas, WASD, click/touch, joystick móvil o activa IA.",
    complete: "Automatización lista",
  },
  en: {
    eyebrow: "AI game",
    title: "ZQX AI Signal Sprint",
    subtitle: "Collect data signals, avoid interference, and let AI route the work when you want.",
    home: "Back home",
    reset: "Reset",
    autopilot: "AI",
    manual: "Manual",
    joystick: "Mobile joystick",
    score: "Signals",
    stability: "Stability",
    statusLive: "Route active",
    statusWin: "Workflow complete",
    hint: "Use arrows, WASD, click/touch, mobile joystick, or turn on AI.",
    complete: "Automation ready",
  },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function fieldPosition(field: Field, tick: number): Point {
  return {
    x: field.x + Math.sin(tick * field.speed + field.phase) * field.rangeX,
    y: field.y + Math.cos(tick * field.speed * 1.14 + field.phase) * field.rangeY,
  };
}

function nearestSignal(player: Point, collected: number[]) {
  const remaining = SIGNALS.filter((signal) => !collected.includes(signal.id));
  return remaining.reduce<Signal | null>((nearest, signal) => {
    if (!nearest) return signal;
    return distance(player, signal) < distance(player, nearest) ? signal : nearest;
  }, null);
}

export default function AIGame({ locale }: { locale: Locale }) {
  const text = TEXT[locale];
  const boardRef = useRef<HTMLDivElement | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const targetRef = useRef<Point | null>(null);
  const playerRef = useRef<Point>({ x: 9, y: 52 });
  const collectedRef = useRef<number[]>([]);
  const autopilotRef = useRef(true);
  const joystickVectorRef = useRef<Point>({ x: 0, y: 0 });
  const tickRef = useRef(0);

  const [player, setPlayer] = useState<Point>(playerRef.current);
  const [collected, setCollected] = useState<number[]>([]);
  const [autopilot, setAutopilot] = useState(true);
  const [stability, setStability] = useState(100);
  const [tick, setTick] = useState(0);
  const [joystickThumb, setJoystickThumb] = useState<JoystickThumb>({ x: 0, y: 0, active: false });

  const score = useMemo(
    () => SIGNALS.filter((signal) => collected.includes(signal.id)).reduce((total, signal) => total + signal.value, 0),
    [collected],
  );
  const isComplete = collected.length === SIGNALS.length;
  const activeFields = useMemo(() => FIELDS.map((field) => ({ ...fieldPosition(field, tick), id: field.id })), [tick]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    collectedRef.current = collected;
  }, [collected]);

  useEffect(() => {
    autopilotRef.current = autopilot;
  }, [autopilot]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(event.key)) {
        event.preventDefault();
        keysRef.current[event.key.toLowerCase()] = true;
        targetRef.current = null;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || isComplete) return;

    const interval = window.setInterval(() => {
      tickRef.current += 1;
      const current = playerRef.current;
      const keys = keysRef.current;
      const joystick = joystickVectorRef.current;
      const fieldPositions = FIELDS.map((field) => fieldPosition(field, tickRef.current));
      let vx = 0;
      let vy = 0;

      if (Math.hypot(joystick.x, joystick.y) > 0.08) {
        vx += joystick.x;
        vy += joystick.y;
      } else {
        if (keys.arrowleft || keys.a) vx -= 1;
        if (keys.arrowright || keys.d) vx += 1;
        if (keys.arrowup || keys.w) vy -= 1;
        if (keys.arrowdown || keys.s) vy += 1;
      }

      if (vx === 0 && vy === 0) {
        const target = autopilotRef.current ? nearestSignal(current, collectedRef.current) : targetRef.current;
        if (target) {
          const dx = target.x - current.x;
          const dy = target.y - current.y;
          const length = Math.hypot(dx, dy) || 1;
          vx += dx / length;
          vy += dy / length;
        }
      }

      fieldPositions.forEach((field) => {
        const gap = distance(current, field);
        if (gap < 13) {
          vx += ((current.x - field.x) / Math.max(gap, 1)) * 1.35;
          vy += ((current.y - field.y) / Math.max(gap, 1)) * 1.35;
        }
      });

      const length = Math.hypot(vx, vy);
      const speed = autopilotRef.current ? 1.12 : 1.55;
      const next =
        length > 0
          ? {
              x: clamp(current.x + (vx / length) * speed, 4, 96),
              y: clamp(current.y + (vy / length) * speed, 8, 92),
            }
          : current;

      playerRef.current = next;
      setPlayer(next);
      setTick(tickRef.current);

      const isInField = fieldPositions.some((field) => distance(next, field) < 6.2);
      if (isInField) {
        setStability((value) => Math.max(0, value - 2));
      } else {
        setStability((value) => Math.min(100, value + 0.35));
      }

      setCollected((currentCollected) => {
        const nextCollected = [...currentCollected];
        SIGNALS.forEach((signal) => {
          if (!nextCollected.includes(signal.id) && distance(next, signal) < 5.4) {
            nextCollected.push(signal.id);
          }
        });
        return nextCollected.length === currentCollected.length ? currentCollected : nextCollected;
      });
    }, 42);

    return () => window.clearInterval(interval);
  }, [isComplete]);

  const moveTarget = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current = {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 4, 96),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 8, 92),
    };
    setAutopilot(false);
  };

  const moveJoystick = (clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDistance = rect.width * 0.34;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const length = Math.hypot(dx, dy);
    const limited = Math.min(length, maxDistance);
    const ratio = length > 0 ? limited / length : 0;
    const normalized = {
      x: (dx * ratio) / maxDistance,
      y: (dy * ratio) / maxDistance,
    };

    joystickVectorRef.current = normalized;
    targetRef.current = null;
    setAutopilot(false);
    setJoystickThumb({
      x: normalized.x * 30,
      y: normalized.y * 30,
      active: true,
    });
  };

  const clearJoystick = () => {
    joystickVectorRef.current = { x: 0, y: 0 };
    setJoystickThumb({ x: 0, y: 0, active: false });
  };

  const resetGame = () => {
    const start = { x: 9, y: 52 };
    playerRef.current = start;
    collectedRef.current = [];
    targetRef.current = null;
    joystickVectorRef.current = { x: 0, y: 0 };
    tickRef.current = 0;
    setPlayer(start);
    setCollected([]);
    setStability(100);
    setTick(0);
    setJoystickThumb({ x: 0, y: 0, active: false });
  };

  return (
    <main className="py-10 md:py-16">
      <div className="container">
        <section className="surface-card overflow-hidden rounded-[2rem] border border-brand-border p-5 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{text.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{text.title}</h1>
              <p className="mt-4 text-base leading-7 text-brand-muted md:text-lg">{text.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/${locale}`} className="focus-ring pressable rounded-full border border-brand-border bg-white/70 px-4 py-2 text-sm font-semibold text-brand-charcoal hover:border-brand-blue">
                {text.home}
              </Link>
              <button
                type="button"
                onClick={() => setAutopilot((value) => !value)}
                className={`focus-ring pressable rounded-full border px-4 py-2 text-sm font-semibold ${
                  autopilot ? "border-brand-blue bg-brand-blue text-white" : "border-brand-border bg-white/70 text-brand-charcoal hover:border-brand-blue"
                }`}
              >
                {autopilot ? text.autopilot : text.manual}
              </button>
              <button type="button" onClick={resetGame} className="focus-ring pressable rounded-full border border-brand-border bg-white/70 px-4 py-2 text-sm font-semibold text-brand-charcoal hover:border-brand-blue">
                {text.reset}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="grid gap-4">
              <div
                ref={boardRef}
                className="relative min-h-[24rem] touch-none overflow-hidden rounded-[1.6rem] border border-brand-border bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(244,244,244,0.34))] md:min-h-[26rem]"
                onPointerDown={(event) => moveTarget(event.clientX, event.clientY)}
                onPointerMove={(event) => {
                  if (event.buttons === 1) moveTarget(event.clientX, event.clientY);
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,98,254,0.12),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(36,214,138,0.13),transparent_25%)]" />
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
                  <path d="M9 52 C22 14 44 24 50 31 S74 81 81 36 S91 71 88 82" fill="none" stroke="rgba(15,98,254,0.16)" strokeWidth="0.8" strokeDasharray="1.2 2.2">
                    <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="2.8s" repeatCount="indefinite" />
                  </path>
                  <path d="M16 24 L31 68 L48 31 L67 72 L81 36 L88 82" fill="none" stroke="rgba(36,214,138,0.16)" strokeWidth="0.8" strokeDasharray="1.4 2.4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-13" dur="3.4s" repeatCount="indefinite" />
                  </path>
                </svg>

                {SIGNALS.map((signal) => {
                  const done = collected.includes(signal.id);
                  return (
                    <div
                      key={signal.id}
                      className={`absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border text-xs font-bold shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition-all duration-300 ${
                        done ? "scale-75 border-[#24D68A]/40 bg-[#24D68A]/16 text-[#17774f] opacity-60" : "border-brand-blue/30 bg-white/86 text-brand-blue"
                      }`}
                      style={{ left: `${signal.x}%`, top: `${signal.y}%` }}
                    >
                      {done ? "OK" : signal.label}
                    </div>
                  );
                })}

                {activeFields.map((field) => (
                  <div key={field.id} className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-charcoal/10 bg-brand-charcoal/[0.06]" style={{ left: `${field.x}%`, top: `${field.y}%` }}>
                    <div className="absolute inset-2 rounded-full border border-brand-blue/20" />
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-muted" />
                  </div>
                ))}

                <div
                  className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-blue/40 bg-brand-blue text-sm font-bold text-white shadow-[0_18px_36px_rgba(15,98,254,0.28)] transition-[left,top] duration-100"
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                >
                  AI
                </div>

                {isComplete ? (
                  <div className="absolute inset-x-5 top-5 rounded-2xl border border-[#24D68A]/35 bg-white/88 px-4 py-3 text-sm font-semibold text-brand-charcoal shadow-[0_16px_34px_rgba(15,23,42,0.12)] backdrop-blur-md">
                    {text.complete}
                  </div>
                ) : null}
              </div>

              <div className="surface-soft flex items-center justify-between gap-4 rounded-[1.4rem] border border-brand-border p-4 md:hidden">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{text.joystick}</div>
                  <div className="mt-1 text-sm text-brand-muted">{autopilot ? text.autopilot : text.manual}</div>
                </div>
                <div
                  className="relative h-28 w-28 shrink-0 touch-none rounded-full border border-brand-border bg-white/72 shadow-[0_14px_28px_rgba(15,23,42,0.12)]"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    moveJoystick(event.clientX, event.clientY, event.currentTarget);
                  }}
                  onPointerMove={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                      moveJoystick(event.clientX, event.clientY, event.currentTarget);
                    }
                  }}
                  onPointerUp={clearJoystick}
                  onPointerCancel={clearJoystick}
                >
                  <div className="absolute left-1/2 top-3 h-[5.5rem] w-px -translate-x-1/2 rounded-full bg-brand-border" />
                  <div className="absolute left-3 top-1/2 h-px w-[5.5rem] -translate-y-1/2 rounded-full bg-brand-border" />
                  <div
                    className={`absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-[0_12px_24px_rgba(15,98,254,0.28)] ${
                      joystickThumb.active ? "" : "transition-transform duration-150"
                    }`}
                    style={{ transform: `translate(calc(-50% + ${joystickThumb.x}px), calc(-50% + ${joystickThumb.y}px))` }}
                  >
                    AI
                  </div>
                </div>
              </div>
            </div>

            <aside className="grid gap-3">
              <div className="surface-soft rounded-[1.4rem] border border-brand-border p-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{text.score}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-brand-charcoal">{score}</div>
              </div>
              <div className="surface-soft rounded-[1.4rem] border border-brand-border p-4">
                <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">
                  <span>{text.stability}</span>
                  <span>{Math.round(stability)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-gray">
                  <div className="h-full rounded-full bg-[#24D68A]" style={{ width: `${stability}%` }} />
                </div>
              </div>
              <div className="surface-soft rounded-[1.4rem] border border-brand-border p-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-muted">{isComplete ? text.statusWin : text.statusLive}</div>
                <p className="mt-3 text-sm leading-6 text-brand-muted">{text.hint}</p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
