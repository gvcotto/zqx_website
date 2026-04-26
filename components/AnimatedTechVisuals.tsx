type VisualProps = {
  id: string;
  className?: string;
};

const NETWORK_NODES = [
  { x: 68, y: 62, r: 16, delay: "0s" },
  { x: 112, y: 128, r: 15, delay: "0.4s" },
  { x: 176, y: 42, r: 13, delay: "0.8s" },
  { x: 224, y: 126, r: 20, delay: "1.2s" },
  { x: 282, y: 84, r: 16, delay: "1.6s" },
  { x: 310, y: 124, r: 11, delay: "2s" },
] as const;

const NETWORK_ROUTES = [
  { id: "route-a", path: "M68 62L112 128L224 126L282 84", color: "#0F62FE", duration: "4.2s", delay: "0s" },
  { id: "route-b", path: "M68 62L176 42L282 84L310 124", color: "#24D68A", duration: "4.8s", delay: "0.8s" },
  { id: "route-c", path: "M112 128L176 42L224 126L310 124", color: "#0F62FE", duration: "5.2s", delay: "1.4s" },
] as const;

export function NetworkIntelligenceVisual({ id, className = "" }: VisualProps) {
  return (
    <svg viewBox="0 0 360 220" className={className} role="img" aria-label="Animated AI network visualization">
      <defs>
        <linearGradient id={`${id}-network-gradient`} x1="52" x2="320" y1="42" y2="142" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(15,98,254,0.94)" />
          <stop offset="100%" stopColor="rgba(36,214,138,0.88)" />
        </linearGradient>
        <filter id={`${id}-soft-shadow`} x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="rgba(15,23,42,0.16)" />
        </filter>
      </defs>

      <rect x="1" y="1" width="358" height="218" rx="20" fill="rgba(255,255,255,0.58)" />
      <g stroke="#161616" strokeWidth="3" strokeLinecap="round" opacity="0.72">
        {NETWORK_ROUTES.map((route) => (
          <path key={route.id} id={`${id}-${route.id}`} d={route.path} fill="none" />
        ))}
      </g>
      <g stroke={`url(#${id}-network-gradient)`} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="8 13" opacity="0.92">
        {NETWORK_ROUTES.map((route, index) => (
          <path key={`${route.id}-active`} d={route.path} fill="none">
            <animate attributeName="stroke-dashoffset" from="0" to="-42" dur={`${3.1 + index * 0.35}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>

      {NETWORK_ROUTES.map((route) => (
        <circle key={`${route.id}-packet`} r="6" fill={route.color}>
          <animateMotion dur={route.duration} begin={route.delay} repeatCount="indefinite" rotate="auto">
            <mpath href={`#${id}-${route.id}`} />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur={route.duration} begin={route.delay} repeatCount="indefinite" />
        </circle>
      ))}

      <g filter={`url(#${id}-soft-shadow)`}>
        {NETWORK_NODES.map((node) => (
          <g key={`${node.x}-${node.y}`}>
            <circle cx={node.x} cy={node.y} r={node.r + 10} fill="rgba(15,98,254,0.13)">
              <animate attributeName="r" values={`${node.r + 4};${node.r + 12};${node.r + 4}`} dur="4.4s" begin={node.delay} repeatCount="indefinite" />
            </circle>
            <circle cx={node.x} cy={node.y} r={node.r} fill="#edf5ff" stroke="#0F62FE" strokeWidth="4.5" />
            <circle cx={node.x} cy={node.y} r="4" fill="#24D68A">
              <animate attributeName="opacity" values="0.35;1;0.35" dur="3.4s" begin={node.delay} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function NeuralSystemsVisual({ id, className = "" }: VisualProps) {
  return (
    <svg viewBox="0 0 360 220" className={className} role="img" aria-label="Animated neural systems visualization">
      <defs>
        <linearGradient id={`${id}-neural-gradient`} x1="76" x2="284" y1="42" y2="172" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(15,98,254,0.96)" />
          <stop offset="100%" stopColor="rgba(36,214,138,0.9)" />
        </linearGradient>
        <filter id={`${id}-neural-shadow`} x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="rgba(15,23,42,0.16)" />
        </filter>
      </defs>

      <rect x="1" y="1" width="358" height="218" rx="20" fill="rgba(255,255,255,0.58)" />
      <circle cx="178" cy="110" r="78" fill="rgba(15,98,254,0.06)" stroke="#0F62FE" strokeWidth="3" strokeDasharray="12 12">
        <animateTransform attributeName="transform" type="rotate" from="0 178 110" to="360 178 110" dur="18s" repeatCount="indefinite" />
      </circle>
      <circle cx="178" cy="110" r="52" fill="none" stroke="rgba(36,214,138,0.42)" strokeWidth="2.5" strokeDasharray="5 10">
        <animateTransform attributeName="transform" type="rotate" from="360 178 110" to="0 178 110" dur="12s" repeatCount="indefinite" />
      </circle>

      <g filter={`url(#${id}-neural-shadow)`}>
        <path
          d="M122 126C101 121 92 106 97 90C102 72 120 70 132 78C140 57 163 50 181 64C193 46 224 54 228 80C250 78 265 94 263 113C261 133 244 143 226 138C214 157 188 160 172 144C154 157 130 149 122 126Z"
          fill="#FFFFFF"
          stroke="#161616"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M128 122C152 109 167 92 181 66M165 142C164 114 173 98 199 84M194 140C198 116 214 102 239 96" fill="none" stroke="url(#${id}-neural-gradient)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {[
        { x: 142, y: 101, delay: "0s" },
        { x: 176, y: 82, delay: "0.45s" },
        { x: 212, y: 101, delay: "0.9s" },
        { x: 160, y: 130, delay: "1.35s" },
        { x: 220, y: 129, delay: "1.8s" },
      ].map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <circle cx={node.x} cy={node.y} r="9" fill="rgba(15,98,254,0.16)">
            <animate attributeName="r" values="7;13;7" dur="3.2s" begin={node.delay} repeatCount="indefinite" />
          </circle>
          <circle cx={node.x} cy={node.y} r="5" fill="#0F62FE">
            <animate attributeName="opacity" values="0.45;1;0.45" dur="2.8s" begin={node.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {[
        { path: "M100 110C126 62 236 58 258 110", color: "#0F62FE", delay: "0s" },
        { path: "M116 150C160 182 226 168 250 118", color: "#24D68A", delay: "1.1s" },
      ].map((signal, index) => (
        <g key={signal.path}>
          <path id={`${id}-neural-orbit-${index}`} d={signal.path} fill="none" stroke="transparent" />
          <circle r="5.5" fill={signal.color}>
            <animateMotion dur={index === 0 ? "5.2s" : "6s"} begin={signal.delay} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${id}-neural-orbit-${index}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur={index === 0 ? "5.2s" : "6s"} begin={signal.delay} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
