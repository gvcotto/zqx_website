"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const CHARCOAL = "#1F2328";
const BLUE = "#1F6FFF";
const LIGHT_GRAY = "#F4F6F8";
const WHITE = "#FFFFFF";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<{ x: number; y: number } | null>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const nodesRef = useRef<Node[]>([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;

    const setReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    const buildNodes = (width: number, height: number) => {
      const area = width * height;
      const count = clamp(Math.round(area / 18000), 60, 120);

      nodesRef.current = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const velocityScale = reducedMotion ? 0.03 : 0.12;

        return {
          x,
          y,
          vx: (Math.random() - 0.5) * velocityScale,
          vy: (Math.random() - 0.5) * velocityScale,
          baseX: x,
          baseY: y,
          size: 1.2 + Math.random() * 1.8,
        };
      });
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const dpr = window.devicePixelRatio || 1;

      sizeRef.current = { width, height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildNodes(width, height);

      if (reducedMotion) {
        renderFrame(performance.now(), true);
      }
    };

    const scheduleResize = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        resizeCanvas();
        resizeTimeoutRef.current = null;
      }, 80);
    };

    const syncPointer = () => {
      pointerFrameRef.current = null;
      const target = pointerTargetRef.current;
      if (!target) return;

      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: target.x - rect.left,
        y: target.y - rect.top,
        active: true,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTargetRef.current = { x: event.clientX, y: event.clientY };
      if (pointerFrameRef.current === null) {
        pointerFrameRef.current = window.requestAnimationFrame(syncPointer);
      }
    };

    const onPointerLeave = () => {
      pointerTargetRef.current = null;
      pointerRef.current.active = false;
    };

    const renderFrame = (time: number, staticOnly = false) => {
      const { width, height } = sizeRef.current;
      const nodes = nodesRef.current;
      if (!width || !height || nodes.length === 0) return;

      context.clearRect(0, 0, width, height);

      context.fillStyle = LIGHT_GRAY;
      context.fillRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.92)");
      gradient.addColorStop(1, "rgba(244,246,248,0.82)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const threshold = Math.min(180, width * 0.16);
      const thresholdSq = threshold * threshold;
      const parallaxX = pointer.active ? ((pointer.x / width) - 0.5) * 14 : 0;
      const parallaxY = pointer.active ? ((pointer.y / height) - 0.5) * 14 : 0;

      if (!staticOnly) {
        for (const node of nodes) {
          const drift = reducedMotion ? 0.0004 : 0.0016;
          node.vx += Math.sin((time * drift) + node.baseY * 0.01) * (reducedMotion ? 0.0002 : 0.0007);
          node.vy += Math.cos((time * drift) + node.baseX * 0.01) * (reducedMotion ? 0.0002 : 0.0007);

          if (pointer.active) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < thresholdSq && distanceSq > 0.001) {
              const distance = Math.sqrt(distanceSq);
              const pull = (1 - distance / threshold) * (reducedMotion ? 0.004 : 0.018);
              node.vx += (dx / distance) * pull;
              node.vy += (dy / distance) * pull;
            }
          }

          const damping = reducedMotion ? 0.985 : 0.965;
          node.vx *= damping;
          node.vy *= damping;
          node.x += node.vx;
          node.y += node.vy;

          if (node.x <= 0 || node.x >= width) {
            node.vx *= -1;
            node.x = clamp(node.x, 0, width);
          }

          if (node.y <= 0 || node.y >= height) {
            node.vy *= -1;
            node.y = clamp(node.y, 0, height);
          }
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const source = nodes[i];
        const sourceX = source.x + parallaxX;
        const sourceY = source.y + parallaxY;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const target = nodes[j];
          const targetX = target.x + parallaxX * 0.85;
          const targetY = target.y + parallaxY * 0.85;
          const dx = targetX - sourceX;
          const dy = targetY - sourceY;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > thresholdSq) continue;

          const distance = Math.sqrt(distanceSq);
          const alpha = (1 - distance / threshold) * (reducedMotion ? 0.16 : 0.24);
          context.strokeStyle = `rgba(31, 111, 255, ${alpha})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(sourceX, sourceY);
          context.lineTo(targetX, targetY);
          context.stroke();
        }
      }

      for (const node of nodes) {
        const x = node.x + parallaxX;
        const y = node.y + parallaxY;

        context.fillStyle = WHITE;
        context.beginPath();
        context.arc(x, y, node.size + 0.8, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = BLUE;
        context.beginPath();
        context.arc(x, y, node.size, 0, Math.PI * 2);
        context.fill();
      }

      const overlay = context.createLinearGradient(0, 0, 0, height);
      overlay.addColorStop(0, "rgba(255,255,255,0.14)");
      overlay.addColorStop(1, "rgba(31,35,40,0.08)");
      context.fillStyle = overlay;
      context.fillRect(0, 0, width, height);

      if (!reducedMotion && !staticOnly) {
        animationRef.current = window.requestAnimationFrame(renderFrame);
      }
    };

    resizeCanvas();

    if (!reducedMotion) {
      animationRef.current = window.requestAnimationFrame(renderFrame);
    }

    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    mediaQuery.addEventListener("change", setReducedMotion);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }

      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      mediaQuery.removeEventListener("change", setReducedMotion);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(244,246,248,0.04)_55%,rgba(31,35,40,0.08))]" />
    </div>
  );
}
