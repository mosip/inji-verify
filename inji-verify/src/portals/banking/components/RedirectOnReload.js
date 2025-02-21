import { useEffect } from "react";

const RedirectOnReload = () => {
  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType("navigation");
    if (
      (navigationEntries.length > 0 &&
        navigationEntries[0].type === "reload") ||
      (!userInfo &&
        (window.location.pathname === "/verification" ||
          window.location.pathname === "/application"))
    ) {
      window.location.replace("/"); // Redirect to home page
    }
  }, []);

  return null;
};

export default RedirectOnReload;
