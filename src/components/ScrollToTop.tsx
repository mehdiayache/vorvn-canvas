import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll to the top whenever the route's pathname changes.
 * Mounted once inside <BrowserRouter>. Renders nothing.
 *
 * - Listens to `pathname` only — query/hash changes do not trigger a reset.
 * - Instant jump (no smooth scroll) to mimic a real page load.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
