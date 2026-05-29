interface Props {
  variant?: "symbol" | "wordmark" | "both";
  symbolSize?: number;
  className?: string;
}

export default function NavkarLogo({
  variant = "both",
  symbolSize = 36,
  className = "",
}: Props) {
  if (variant === "symbol") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Navkar Impex"
        width={symbolSize}
        height={symbolSize}
        style={{ objectFit: "contain" }}
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
        style={{ display: "block" }}
        className={className || "h-8 w-auto"}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        width={symbolSize}
        height={symbolSize}
        style={{ objectFit: "contain" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/name.png"
        alt="Navkar Impex"
        style={{ height: symbolSize * 0.72, width: "auto" }}
      />
    </div>
  );
}
