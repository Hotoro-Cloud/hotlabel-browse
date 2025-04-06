import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import IntegrationTimer from "./pages/IntegrationTimer";
import NotFound from "./pages/NotFound";
import PublisherDashboard from "@/components/PublisherDashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/publisher",
    element: <PublisherDashboard />
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/integration-timer" element={<IntegrationTimer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;