import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface Props {
  variant?: "symbol" | "wordmark" | "both";
  symbolSize?: number;
  className?: string;
  light?: boolean;
}

function NavkarSymbol({ size, light }: { size: number; light?: boolean }) {
  const navy  = light ? "#ffffff" : "#142850";
  const silver = light ? "rgba(255,255,255,0.55)" : "#8896b8";
  const grid  = light ? "rgba(255,255,255,0.22)" : "#9aaac0";

  return (
    <svg width={size} height={size} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Globe ring */}
      <circle cx="110" cy="100" r="83" fill="none" stroke={navy} strokeWidth="4"/>

      {/* Globe grid – latitudes */}
      <ellipse cx="110" cy="62"  rx="57" ry="9"  fill="none" stroke={grid} strokeWidth="0.9"/>
      <ellipse cx="110" cy="100" rx="68" ry="11" fill="none" stroke={grid} strokeWidth="0.9"/>
      <ellipse cx="110" cy="138" rx="57" ry="9"  fill="none" stroke={grid} strokeWidth="0.9"/>
      {/* Globe grid – longitudes */}
      <line x1="110" y1="20"  x2="110" y2="146" stroke={grid} strokeWidth="0.9"/>
      <line x1="83"  y1="26"  x2="83"  y2="146" stroke={grid} strokeWidth="0.9"/>
      <line x1="137" y1="26"  x2="137" y2="146" stroke={grid} strokeWidth="0.9"/>
      <line x1="60"  y1="46"  x2="60"  y2="140" stroke={grid} strokeWidth="0.9"/>
      <line x1="160" y1="46"  x2="160" y2="140" stroke={grid} strokeWidth="0.9"/>

      {/* N – left pillar (navy) */}
      <rect x="46" y="42" width="26" height="116" fill={navy}/>
      {/* N – diagonal (navy): top-right of left bar → bottom-left of right area */}
      <polygon points="72,42 98,42 150,158 124,158" fill={navy}/>
      {/* N – right pillar (silver) */}
      <rect x="148" y="42" width="26" height="116" fill={silver}/>
      {/* Cap the top of right pillar so it sits flush over diagonal */}
      <polygon points="148,42 174,42 174,76 148,60" fill={silver}/>

      {/* Orbit swoosh – from lower-left (ship) through bottom, up to upper-right (plane) */}
      <path d="M 28 148 C 55 192, 175 186, 196 110"
            stroke={navy} strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* Container ship at left end of orbit */}
      <g transform="translate(2,140)" fill={navy}>
        <path d="M 2 22 Q 2 28 5 28 L 50 28 Q 53 28 53 22 Z"/>
        <rect x="5"  y="10" width="45" height="14"/>
        <rect x="6"  y="2"  width="9" height="9"/>
        <rect x="17" y="2"  width="9" height="9"/>
        <rect x="28" y="2"  width="9" height="9"/>
        <rect x="39" y="2"  width="9" height="9"/>
        <rect x="7"  y="-5" width="3" height="8"/>
        <rect x="40" y="-5" width="3" height="8"/>
      </g>

      {/* Airplane at right end of orbit, pointing upper-right */}
      <g transform="translate(176,82) rotate(-35)" fill={navy}>
        <ellipse cx="14" cy="8" rx="18" ry="5.5"/>
        <path d="M 6 8 L -7 21 L -2 21 L 17 13 Z"/>
        <path d="M 22 8 L 35 21 L 30 21 L 11 13 Z"/>
        <path d="M 27 9 L 35 3 L 35 9 Z"/>
        <path d="M 27 10 L 33 14 L 31 16 Z"/>
      </g>
    </svg>
  );
}

function NavkarWordmark({ light, className }: { light?: boolean; className?: string }) {
  const navy = light ? "#ffffff" : "#1a2d5a";
  const gray = light ? "rgba(255,255,255,0.6)" : "#8c8fa4";
  const line = light ? "rgba(255,255,255,0.3)" : "#b0b3bc";

  return (
    <div className={`${raleway.className} leading-none select-none ${className ?? ""}`}>
      <div
        style={{
          fontWeight: 700,
          letterSpacing: "0.34em",
          color: navy,
          fontSize: "1em",
          lineHeight: 1,
          textTransform: "uppercase" as const,
        }}
      >
        NAVKAR
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginTop: "4px",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: line }} />
        <span
          style={{
            fontWeight: 400,
            fontSize: "0.4em",
            letterSpacing: "0.28em",
            color: gray,
            lineHeight: 1,
          }}
        >
          IMPEX
        </span>
        <div style={{ flex: 1, height: "1px", background: line }} />
      </div>
    </div>
  );
}

export default function NavkarLogo({
  variant = "both",
  symbolSize = 36,
  className = "",
  light = false,
}: Props) {
  if (variant === "symbol") {
    return <NavkarSymbol size={symbolSize} light={light} />;
  }

  if (variant === "wordmark") {
    return <NavkarWordmark light={light} className={className} />;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <NavkarSymbol size={symbolSize} light={light} />
      <NavkarWordmark light={light} />
    </div>
  );
}
