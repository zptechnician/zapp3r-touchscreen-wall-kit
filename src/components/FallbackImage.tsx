import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  dark?: boolean;
  width?: number;
  height?: number;
  lazy?: boolean;
}

const FallbackImage = ({
  src,
  alt,
  className = "",
  dark = false,
  width,
  height,
  lazy = false,
}: FallbackImageProps) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${className} ${
          dark
            ? "bg-navy-foreground/5 border border-navy-foreground/20"
            : "bg-muted border border-primary/10"
        }`}
        
      >
        <span
          className={`text-xs font-medium tracking-wide ${
            dark ? "text-navy-foreground/40" : "text-muted-foreground"
          }`}
        >
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? "lazy" : "eager"}
      className={`rounded-lg ${className}`}
      onError={() => setFailed(true)}
    />
  );
};

export default FallbackImage;
