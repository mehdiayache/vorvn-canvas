import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LanguageRoute from "./components/LanguageRoute";
import LanguageRedirect from "./components/LanguageRedirect";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageRedirect />} />
          <Route
            path="/:lang"
            element={
              <LanguageRoute>
                <Index />
              </LanguageRoute>
            }
          />
          <Route
            path="/:lang/contact"
            element={
              <LanguageRoute>
                <Contact />
              </LanguageRoute>
            }
          />
          <Route
            path="/:lang/*"
            element={
              <LanguageRoute>
                <NotFound />
              </LanguageRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
