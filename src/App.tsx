
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from './context/RestaurantContext';
import { ThemeProvider } from './hooks/use-theme';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InventoryPage from "./pages/InventoryPage";
import RecipesPage from "./pages/RecipesPage";
import SpoilagePage from "./pages/SpoilagePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <RestaurantProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/spoilage" element={<SpoilagePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RestaurantProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
