import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index.tsx";
import Servers from "./pages/Servers.tsx";
import Deployments from "./pages/Deployments.tsx";
import Logs from "./pages/Logs.tsx";
import Alerts from "./pages/Alerts.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import Inventory from "./pages/Inventory.tsx";
import Reports from "./pages/Reports.tsx";
import IncidentTimeline from "./pages/IncidentTimeline.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import { AuthProvider } from "./components/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/servers" element={<Servers />} />
              <Route path="/deployments" element={<Deployments />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/incidents" element={<IncidentTimeline />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
