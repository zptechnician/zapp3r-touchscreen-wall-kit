import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PartnerWall from "./pages/PartnerWall";
import CustomerWall from "./pages/CustomerWall";
import DetailPage from "./pages/DetailPage";
import NotFound from "./pages/NotFound";
import { useIdleTimer } from "./hooks/use-idle-timer";

const queryClient = new QueryClient();

const IdleTimerWrapper = ({ children }: { children: React.ReactNode }) => {
  useIdleTimer(60000);
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <IdleTimerWrapper>
          <Routes>
            <Route path="/" element={<Navigate to="/partners" replace />} />
            <Route path="/partners" element={<PartnerWall />} />
            <Route path="/customers" element={<CustomerWall />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </IdleTimerWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
