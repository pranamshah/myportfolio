interface Props {
  variant?: "symbol" | "wordmark" | "both";
  symbolSize?: number;
  /** className applied to the img / wrapper */
  className?: string;
  /** White/inverted version for dark backgrounds */
  light?: boolean;
}

export default function NavkarLogo({
  variant = "both",
  symbolSize = 36,
  className = "",
  light = false,
}: Props) {
  const filterStyle = light ? { filter: "brightness(0) invert(1)" } : {};

  if (variant === "symbol") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Navkar Impex"
        width={symbolSize}
        height={symbolSize}
        style={{ objectFit: "contain", ...filterStyle }}
        className={className}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/name.png"
        alt="Navkar Impex"
        style={{ display: "block", ...filterStyle }}
        className={className || "h-8 w-auto"}
      />
    );
  }

  // "both" – symbol + wordmark side by side
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        width={symbolSize}
        height={symbolSize}
        style={{ objectFit: "contain", ...filterStyle }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/name.png"
        alt="Navkar Impex"
        style={{ height: symbolSize * 0.72, width: "auto", ...filterStyle }}
      />
    </div>
  );
}
