import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { useKioskData } from "@/hooks/use-kiosk-data";
import FallbackImage from "@/components/FallbackImage";
import NavButton from "@/components/NavButton";
import type { KioskEntry } from "@/types/kiosk";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "partners";
  const navigate = useNavigate();
  const data = useKioskData();

  if (!data) {
    return (
      <div className="kiosk-page bg-background items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const all: KioskEntry[] = [...data.partners, ...data.customers];
  const entry = all.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="kiosk-page bg-background items-center justify-center">
        <p className="text-muted-foreground">Entry not found</p>
      </div>
    );
  }

  // Resolve header logo: prefer logoHeader if present, fall back to logo
  const headerLogoSrc = entry.logoHeader ?? entry.logo;

  return (
    <div className="kiosk-page bg-background px-12 py-10">
      {/* Header row: 'Case study' left, brand logo right */}
      <div className="flex items-center justify-between mb-8">
        <span className="section-label !mb-0">Case study</span>
        <FallbackImage
          src={headerLogoSrc}
          alt={entry.name}
          height={48}
          className="h-12 w-auto max-w-[220px] object-contain rounded-none"
        />
      </div>

      {/* Full-width hero — eager load, aspect-video */}
      <div className="mb-10">
        <FallbackImage
          src={entry.hero}
          alt={entry.name}
          width={1200}
          height={675}
          className="w-full aspect-video object-cover rounded-lg"
        />
      </div>

      {/* Intro paragraph — no heading, 1.25rem bold */}
      <p className="text-foreground text-xl font-bold leading-relaxed mb-12 max-w-4xl">
        {entry.challenge}
      </p>

      {/* Two-column: Solution | Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
        <div>
          <h2 className="section-label">Solution</h2>
          <p className="text-foreground leading-relaxed">{entry.solution}</p>
        </div>
        <div>
          <h2 className="section-label">Impact</h2>
          <p className="text-foreground leading-relaxed">{entry.impact}</p>
        </div>
      </div>

      {/* Back button — bottom-left, rectangular */}
      <div className="mt-12 pt-8 border-t border-border">
        <NavButton
          onClick={() => navigate(`/${from}`)}
          icon={<MoveLeft className="w-5 h-5" />}
          iconPosition="left"
        >
          Back
        </NavButton>
      </div>
    </div>
  );
};

export default DetailPage;
