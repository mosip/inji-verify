import { useEffect } from "react";

const RedirectOnReload = () => {
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType("navigation");
    if (
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload"
    ) {
      window.location.replace("/"); // Redirect to home page
    }
  }, []);

  return null;
};

export default RedirectOnReload;
