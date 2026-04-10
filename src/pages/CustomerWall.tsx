import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { useKioskData } from "@/hooks/use-kiosk-data";
import KioskGrid from "@/components/KioskGrid";
import NavButton from "@/components/NavButton";

const CustomerWall = () => {
  const data = useKioskData();
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div className="kiosk-page bg-navy">
      <div className="kiosk-content">
        <h1 className="kiosk-heading text-navy-foreground">
          {data.settings.customerWallTitle}
        </h1>
        <p className="kiosk-subtext text-navy-foreground/50">
          Tap a retailer to explore their case study
        </p>
        <KioskGrid entries={data.customers} columns={2} fromParam="customers" dark />
      </div>

      <div className="kiosk-footer">
        <NavButton
          onClick={() => navigate("/partners")}
          icon={<MoveLeft className="w-5 h-5" />}
          iconPosition="left"
          variant="inverted"
        >
          Partner Wall
        </NavButton>
      </div>
    </div>
  );
};

export default CustomerWall;
