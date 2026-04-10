import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { KioskEntry } from "@/types/kiosk";

const FIRST_VISIBLE_ROW = 6;

const prefetched = new Set<string>();
function prefetchHero(url: string) {
  if (prefetched.has(url)) return;
  prefetched.add(url);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}

interface GridItemProps {
  entry: KioskEntry;
  aspect: string;
  dark: boolean;
  lazy: boolean;
  onTap: (id: string) => void;
}

const GridItem = memo(({ entry, aspect, dark, lazy, onTap }: GridItemProps) => (
  <button
    onClick={() => onTap(entry.id)}
    onTouchStart={() => prefetchHero(entry.hero)}
    onMouseEnter={() => prefetchHero(entry.hero)}
    className={`touch-press flex items-center justify-center ${aspect} min-h-[44px] min-w-[44px]`}
  >
    <img
      src={entry.logo}
      alt={entry.name}
      width={200}
      height={150}
      loading={lazy ? "lazy" : "eager"}
      className={`w-full h-full object-contain ${dark ? "brightness-0 invert" : ""}`}
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
        const fallback = document.createElement("span");
        fallback.textContent = entry.name;
        fallback.className = `text-xs font-medium tracking-wide ${dark ? "text-white/40" : "text-muted-foreground"}`;
        target.parentElement?.appendChild(fallback);
      }}
    />
  </button>
));

GridItem.displayName = "GridItem";

interface KioskGridProps {
  entries: KioskEntry[];
  columns: 2 | 3;
  fromParam: "partners" | "customers";
  dark?: boolean;
}

const KioskGrid = ({ entries, columns, fromParam, dark = false }: KioskGridProps) => {
  const navigate = useNavigate();

  const gridCols = columns === 3 ? "grid-cols-3" : "grid-cols-2";
  const gridGap = columns === 3 ? "gap-x-16 gap-y-10" : "gap-x-20 gap-y-10";
  const maxW = columns === 3 ? "max-w-3xl" : "max-w-2xl";
  const aspect = columns === 3 ? "aspect-[4/3]" : "aspect-[3/2]";
  const aboveFold = columns === 3 ? FIRST_VISIBLE_ROW : 4;

  const handleTap = useCallback(
    (id: string) => navigate(`/detail/${id}?from=${fromParam}`),
    [navigate, fromParam]
  );

  return (
    <div className={`grid ${gridCols} ${gridGap} ${maxW} w-full`}>
      {entries.map((entry, i) => (
        <GridItem
          key={entry.id}
          entry={entry}
          aspect={aspect}
          dark={dark}
          lazy={i >= aboveFold}
          onTap={handleTap}
        />
      ))}
    </div>
  );
};

export default KioskGrid;
