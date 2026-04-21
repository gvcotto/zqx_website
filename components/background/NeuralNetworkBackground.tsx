"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  seed: number;
  energy: number;
};

type Pointer = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
};

const BLUE = "#0F62FE";
const WHITE = "#FFFFFF";

const MIN_NODES = 80;
const MAX_NODES = 120;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const resizeRef = useRef<number | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const pointerTargetRef = useRef<{ x: number; y: number } | null>(null);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, vx: 0, vy: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;

    const buildNodes = (width: number, height: number) => {
      const areaFactor = Math.round((width * height) / 16000);
      const count = clamp(areaFactor, MIN_NODES, MAX_NODES);
      const baseSpeed = reducedMotion ? 0.09 : 0.18;

      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: (Math.random() - 0.5) * baseSpeed,
        radius: 1.3 + Math.random() * 1,
        seed: Math.random() * Math.PI * 2,
        energy: 0,
      }));
    };

    const render = (time: number) => {
      const { width, height } = sizeRef.current;
      const nodes = nodesRef.current;
      if (!width || !height || nodes.length === 0) return;

      context.clearRect(0, 0, width, height);

      const topWash = context.createLinearGradient(0, 0, 0, height);
      topWash.addColorStop(0, "rgba(255,255,255,0.08)");
      topWash.addColorStop(0.45, "rgba(255,255,255,0.02)");
      topWash.addColorStop(1, "rgba(15,98,254,0.03)");
      context.fillStyle = topWash;
      context.fillRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const linkDistance = Math.max(130, width * 0.17);
      const connectionDistanceSq = linkDistance * linkDistance;
      const pointerSpeed = Math.min(Math.hypot(pointer.vx, pointer.vy), 42);
      const parallax = reducedMotion
        ? 0
        : pointer.active
          ? ((pointer.x / width) - 0.5) * 7
          : 0;
      const parallaxY = reducedMotion
        ? 0
        : pointer.active
          ? ((pointer.y / height) - 0.5) * 7
          : 0;

      const drift = reducedMotion ? 0.0002 : 0.0005;
      const interactionRadius = 190;
      const interactionRadiusSq = interactionRadius * interactionRadius;

      for (const node of nodes) {
        if (!reducedMotion) {
          const angle = (time * drift + node.radius * 40 + node.seed) % (Math.PI * 2);
          node.vx += Math.sin(angle) * 0.00011;
          node.vy += Math.cos(angle) * 0.00009;
        }

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > 0 && distanceSq < interactionRadiusSq) {
            const distance = Math.sqrt(distanceSq);
            const falloff = 1 - distance / interactionRadius;
            const awayX = dx / distance;
            const awayY = dy / distance;
            const swirlDirection = Math.sin(node.seed + time * 0.0016) >= 0 ? 1 : -1;
            const tangentX = -awayY * swirlDirection;
            const tangentY = awayX * swirlDirection;
            const repel = (reducedMotion ? 0.008 : 0.022) * falloff * (1 + pointerSpeed * 0.05);
            const swirl = (reducedMotion ? 0.004 : 0.015) * falloff * (0.75 + pointerSpeed * 0.03);
            const jitter = reducedMotion ? 0.0015 : 0.0055;
            const jitterX = Math.sin(time * 0.008 + node.seed * 13) * jitter * falloff;
            const jitterY = Math.cos(time * 0.007 + node.seed * 11) * jitter * falloff;

            node.vx += awayX * repel + tangentX * swirl + jitterX + pointer.vx * 0.0028 * falloff;
            node.vy += awayY * repel + tangentY * swirl + jitterY + pointer.vy * 0.0028 * falloff;
            node.energy = clamp(node.energy + falloff * 0.14, 0, 1);
          } else {
            node.energy *= 0.965;
          }
        } else {
          node.energy *= 0.958;
        }

        node.x += node.vx * (reducedMotion ? 0.16 : 1);
        node.y += node.vy * (reducedMotion ? 0.16 : 1);

        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;

        if (node.x < 0) node.x = 0;
        if (node.x > width) node.x = width;
        if (node.y < 0) node.y = 0;
        if (node.y > height) node.y = height;

        node.vx *= reducedMotion ? 0.997 : 0.992;
        node.vy *= reducedMotion ? 0.997 : 0.992;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const source = nodes[i];
        const sourceX = source.x + parallax;
        const sourceY = source.y + parallaxY;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const target = nodes[j];
          const targetX = target.x + parallax * 0.72;
          const targetY = target.y + parallaxY * 0.72;
          const dx = targetX - sourceX;
          const dy = targetY - sourceY;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > connectionDistanceSq) continue;

          const distance = Math.sqrt(distanceSq);
          const baseAlpha = 1 - distance / linkDistance;
          const pointerBoost = pointer.active
            ? Math.max(0, 1 - Math.sqrt((sourceX - pointer.x) ** 2 + (sourceY - pointer.y) ** 2) / interactionRadius)
            : 0;
          const energyBoost = Math.max(source.energy, target.energy);
          const alpha = reducedMotion
            ? baseAlpha * 0.1
            : clamp(0.16 * baseAlpha * (1 + pointerBoost * 0.7 + energyBoost * 0.9), 0, 0.42);
          if (alpha <= 0) continue;

          context.strokeStyle = pointer.active
            ? `rgba(15, 98, 254, ${alpha})`
            : `rgba(15, 98, 254, ${alpha * 0.78})`;
          context.lineWidth = reducedMotion ? 0.9 : 1 + energyBoost * 0.45;
          context.beginPath();
          context.moveTo(sourceX, sourceY);
          context.lineTo(targetX, targetY);
          context.stroke();
        }
      }

      for (const node of nodes) {
        const x = node.x + parallax;
        const y = node.y + parallaxY;
        const pulse = node.radius + node.energy * 1.2;

        context.fillStyle = WHITE;
        context.beginPath();
        context.arc(x, y, pulse + 1.2, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = BLUE;
        context.beginPath();
        context.arc(x, y, pulse, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = "rgba(255,255,255,0.02)";
      context.fillRect(0, 0, width, height);
    };

    const animate = (time: number) => {
      render(time);
      animationRef.current = window.requestAnimationFrame(animate);
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
      render(performance.now());
    };

    const scheduleResize = () => {
      if (resizeRef.current !== null) return;
      resizeRef.current = window.requestAnimationFrame(() => {
        resizeRef.current = null;
        resizeCanvas();
      });
    };

    const syncPointer = () => {
      pointerFrameRef.current = null;
      if (!pointerTargetRef.current) {
        pointerRef.current = { ...pointerRef.current, vx: 0, vy: 0, active: false };
        return;
      }

      const previous = pointerRef.current;
      pointerRef.current = {
        x: pointerTargetRef.current.x,
        y: pointerTargetRef.current.y,
        vx: pointerTargetRef.current.x - previous.x,
        vy: pointerTargetRef.current.y - previous.y,
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

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      resizeCanvas();
      animationRef.current = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = window.requestAnimationFrame(animate);

    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    mediaQuery.addEventListener("change", onReducedMotionChange);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      if (resizeRef.current !== null) {
        window.cancelAnimationFrame(resizeRef.current);
      }

      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }

      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      mediaQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="neural-bg fixed inset-0 z-0 h-screen w-screen pointer-events-none"
      aria-hidden="true"
    />
  );
}
