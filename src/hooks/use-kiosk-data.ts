import { useEffect, useState } from "react";
import type { KioskData } from "@/types/kiosk";

let cache: KioskData | null = null;

export function useKioskData() {
  const [data, setData] = useState<KioskData | null>(cache);

  useEffect(() => {
    if (cache) return;
    fetch("/kiosk-data.json")
      .then((r) => r.json())
      .then((d: KioskData) => {
        cache = d;
        setData(d);
      });
  }, []);

  return data;
}
