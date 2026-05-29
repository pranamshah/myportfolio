interface Props {
  variant?: "symbol" | "wordmark" | "both";
  symbolSize?: number;
  className?: string;
  /** White/inverted version for dark backgrounds */
  light?: boolean;
}

export default function NavkarLogo({ variant = "both", symbolSize = 36, className = "", light = false }: Props) {
  const filter = light ? "brightness(0) invert(1)" : undefined;

  if (variant === "symbol") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-symbol.svg"
        alt="Navkar Impex"
        width={symbolSize}
        height={symbolSize}
        className={className}
        style={filter ? { filter } : undefined}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-wordmark.svg"
        alt="Navkar Impex"
        className={className}
        style={filter ? { filter } : undefined}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-symbol.svg" alt="" width={symbolSize} height={symbolSize}
           style={filter ? { filter } : undefined} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-wordmark.svg" alt="Navkar Impex" className="h-7 w-auto"
           style={filter ? { filter } : undefined} />
    </div>
  );
}
