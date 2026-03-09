"use client";

import NeuralCanvasBackground from "@/components/background/NeuralCanvasBackground";

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <NeuralCanvasBackground />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: "url('/images/lambdasight/network-field.svg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/images/lambdasight/neural-matrix.svg')",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-y",
          backgroundSize: "min(1400px, 100vw) auto",
        }}
      />
      <div className="absolute inset-0 bg-[rgba(244,246,248,0.2)]" />
    </div>
  );
}
