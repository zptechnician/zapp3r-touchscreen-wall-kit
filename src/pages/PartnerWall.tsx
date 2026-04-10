import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useKioskData } from "@/hooks/use-kiosk-data";
import KioskGrid from "@/components/KioskGrid";
import NavButton from "@/components/NavButton";

const PartnerWall = () => {
  const data = useKioskData();
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div className="kiosk-page bg-background">
      <div className="kiosk-content">
        <h1 className="kiosk-heading text-primary">{data.settings.partnerWallTitle}</h1>
        <p className="kiosk-subtext text-muted-foreground">
          Tap a partner to explore their case study
        </p>
        <KioskGrid entries={data.partners} columns={3} fromParam="partners" />
      </div>

      <div className="kiosk-footer">
        <NavButton
          onClick={() => navigate("/customers")}
          icon={<MoveRight className="w-5 h-5" />}
          iconPosition="right"
          variant="dark"
        >
          Customer Wall
        </NavButton>
      </div>
    </div>
  );
};

export default PartnerWall;
