"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  drift: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const BLUE = "#1F6FFF";
const CHARCOAL = "#1F2328";
const LIGHT_GRAY = "#F4F6F8";
const WHITE = "#FFFFFF";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function NeuralCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
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

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;

      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      resizeCanvas();

      if (!reducedMotion) {
        animationRef.current = window.requestAnimationFrame(renderFrame);
      }
    };

    const buildNodes = (width: number, height: number) => {
      const area = width * height;
      const count = clamp(Math.round(area / 22000), 60, 120);
      const baseVelocity = reducedMotion ? 0.014 : 0.045;

      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * baseVelocity,
        vy: (Math.random() - 0.5) * baseVelocity,
        size: 1 + Math.random() * 1.8,
        drift: Math.random() * Math.PI * 2,
      }));
    };

    const resizeCanvas = () => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      sizeRef.current = { width, height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildNodes(width, height);
      renderFrame(performance.now(), true);
    };

    const requestResize = () => {
      if (resizeFrameRef.current !== null) return;

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        resizeCanvas();
      });
    };

    const syncPointer = () => {
      pointerFrameRef.current = null;
      const target = pointerTargetRef.current;

      if (!target) {
        pointerRef.current.active = false;
        return;
      }

      pointerRef.current = {
        x: target.x,
        y: target.y,
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
      if (pointerFrameRef.current === null) {
        pointerFrameRef.current = window.requestAnimationFrame(syncPointer);
      }
    };

    const renderFrame = (time: number, staticOnly = false) => {
      const { width, height } = sizeRef.current;
      const nodes = nodesRef.current;
      if (!width || !height || nodes.length === 0) return;

      context.clearRect(0, 0, width, height);

      context.fillStyle = LIGHT_GRAY;
      context.fillRect(0, 0, width, height);

      const topWash = context.createLinearGradient(0, 0, 0, height);
      topWash.addColorStop(0, "rgba(255,255,255,0.78)");
      topWash.addColorStop(0.6, "rgba(244,246,248,0.46)");
      topWash.addColorStop(1, "rgba(31,35,40,0.06)");
      context.fillStyle = topWash;
      context.fillRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const threshold = Math.min(168, width * 0.14);
      const thresholdSq = threshold * threshold;
      const parallaxX = pointer.active ? ((pointer.x / width) - 0.5) * 10 : 0;
      const parallaxY = pointer.active ? ((pointer.y / height) - 0.5) * 10 : 0;

      if (!staticOnly) {
        for (const node of nodes) {
          const driftFactor = reducedMotion ? 0.00008 : 0.0003;
          node.vx += Math.sin(time * driftFactor + node.drift) * (reducedMotion ? 0.00004 : 0.00014);
          node.vy += Math.cos(time * driftFactor + node.drift) * (reducedMotion ? 0.00004 : 0.00014);

          if (pointer.active) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < thresholdSq && distanceSq > 0.0001) {
              const distance = Math.sqrt(distanceSq);
              const influence = (1 - distance / threshold) * (reducedMotion ? 0.0028 : 0.009);
              node.vx += (dx / distance) * influence;
              node.vy += (dy / distance) * influence;
            }
          }

          const damping = reducedMotion ? 0.994 : 0.982;
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
          const targetX = target.x + parallaxX * 0.86;
          const targetY = target.y + parallaxY * 0.86;
          const dx = targetX - sourceX;
          const dy = targetY - sourceY;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > thresholdSq) continue;

          const distance = Math.sqrt(distanceSq);
          const alpha = (1 - distance / threshold) * (reducedMotion ? 0.11 : 0.18);
          context.strokeStyle = `rgba(31, 111, 255, ${alpha})`;
          context.lineWidth = 0.9;
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
        context.arc(x, y, node.size + 0.7, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = BLUE;
        context.beginPath();
        context.arc(x, y, node.size, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = "rgba(31,35,40,0.035)";
      context.fillRect(0, 0, width, height);

      if (!reducedMotion && !staticOnly) {
        animationRef.current = window.requestAnimationFrame(renderFrame);
      }
    };

    resizeCanvas();

    if (!reducedMotion) {
      animationRef.current = window.requestAnimationFrame(renderFrame);
    }

    window.addEventListener("resize", requestResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    mediaQuery.addEventListener("change", onReducedMotionChange);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }

      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }

      window.removeEventListener("resize", requestResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      mediaQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 h-screen w-screen" aria-hidden="true" />;
}
