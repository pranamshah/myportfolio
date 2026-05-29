interface Props {
  variant?: "symbol" | "wordmark" | "both";
  symbolSize?: number;
  className?: string;
}

export default function NavkarLogo({ variant = "both", symbolSize = 36, className = "" }: Props) {
  if (variant === "symbol") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-symbol.svg"
        alt="Navkar Impex"
        width={symbolSize}
        height={symbolSize}
        className={className}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-wordmark.svg"
        alt="Navkar Impex"
        className={`${className}`}
        style={{ height: "inherit" }}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-symbol.svg" alt="" width={symbolSize} height={symbolSize} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-wordmark.svg" alt="Navkar Impex" className="h-7 w-auto" />
    </div>
  );
}
