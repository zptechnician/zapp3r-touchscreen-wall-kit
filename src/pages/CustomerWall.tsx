import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { useKioskData } from "@/hooks/use-kiosk-data";
import KioskGrid from "@/components/KioskGrid";
import NavButton from "@/components/NavButton";

const CustomerWall = () => {
  const { data, loading, auditError, fetchError } = useKioskData();
  const navigate = useNavigate();

  if (loading) return null;

  if (fetchError || auditError) {
    return (
      <div className="kiosk-page bg-navy flex items-center justify-center">
        <div className="max-w-lg text-center p-8">
          <p className="text-sm font-mono uppercase tracking-widest text-red-400 mb-3">
            {fetchError ? "Connection Error" : "Data Audit Failed"}
          </p>
          <p className="text-navy-foreground/60 text-sm whitespace-pre-wrap font-mono">
            {fetchError ?? auditError}
          </p>
        </div>
      </div>
    );
  }

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
