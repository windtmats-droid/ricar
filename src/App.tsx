import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAppearance } from "@/hooks/useAppearance";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Ankauf from "./pages/Ankauf.tsx";
import Fahrzeuge from "./pages/Fahrzeuge.tsx";
import Verkauf from "./pages/Verkauf.tsx";
import FahrzeugDetail from "./pages/FahrzeugDetail.tsx";
import Postfach from "./pages/Postfach.tsx";
import Leads from "./pages/Leads.tsx";
import MarktScan from "./pages/MarktScan.tsx";
import Einstellungen from "./pages/Einstellungen.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Analytics from "./pages/Analytics.tsx";
import Kalkulation from "./pages/Kalkulation.tsx";
import Dokumente from "./pages/Dokumente.tsx";
import Chat from "./pages/Chat.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppearanceInit = () => { useAppearance(); return null; };

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppearanceInit />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ankauf" element={<Ankauf />} />
            <Route path="/fahrzeuge" element={<Fahrzeuge />} />
            <Route path="/verkauf" element={<Verkauf />} />
            <Route path="/fahrzeuge/:id" element={<FahrzeugDetail />} />
            <Route path="/postfach" element={<Postfach />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/markt-scan" element={<MarktScan />} />
            <Route path="/einstellungen" element={<Einstellungen />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/kalkulation" element={<Kalkulation />} />
            <Route path="/dokumente" element={<Dokumente />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
