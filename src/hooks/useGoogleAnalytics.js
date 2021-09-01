import React from "react";
import { useLocation } from "react-router-dom";

import ReactGA from "react-ga4";
// Olympus-Image-Compositor tracking id
const TRACKING_ID = "G-H7FWT1CT6Q";

export default function useGoogleAnalytics() {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  React.useEffect(() => {
    const currentPath = location.pathname + location.search + location.hash;
    ReactGA.send({ hitType: "pageview", page: currentPath });
  }, [location]);
}
