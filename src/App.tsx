import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import Index from "./pages/Index";
import CatalogPage from "./pages/CatalogPage";
import ChannelPage from "./pages/ChannelPage";
import AdsPage from "./pages/AdsPage";
import RankingsPage from "./pages/RankingsPage";
import SpyPage from "./pages/SpyPage";
import AccountPage from "./pages/AccountPage";
import MiniAppsPage from "./pages/MiniAppsPage";
import AdvertisersPage from "./pages/AdvertisersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <LoginDialog />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/ads" element={<AdsPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/spy" element={<SpyPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/mini-apps" element={<MiniAppsPage />} />
            <Route path="/advertisers" element={<AdvertisersPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
