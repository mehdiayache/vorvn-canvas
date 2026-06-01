import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LanguageRoute from "./components/LanguageRoute";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Newsroom from "./pages/Newsroom";
import NewsroomArticle from "./pages/NewsroomArticle";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import LegalNotice from "./pages/legal/LegalNotice";

const queryClient = new QueryClient();

// Toggle to `true` once a non-essential tracker (e.g. Meta Pixel) is wired up.
// While false the banner stays hidden — the site sets zero non-essential cookies.
const COOKIE_CONSENT_REQUIRED = false;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Production: Netlify 301-redirects / -> /en before this route is hit.
              In Lovable preview (no Netlify), this in-app redirect keeps the
              root URL pointing at the English home. */}
          <Route path="/" element={<Navigate to="/en" replace />} />

          {/* Legal pages — English only, outside /:lang */}
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/notice" element={<LegalNotice />} />

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
            path="/:lang/newsroom"
            element={
              <LanguageRoute>
                <Newsroom />
              </LanguageRoute>
            }
          />
          <Route
            path="/:lang/newsroom/:slug"
            element={
              <LanguageRoute>
                <NewsroomArticle />
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
        <CookieBanner enabled={COOKIE_CONSENT_REQUIRED} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
