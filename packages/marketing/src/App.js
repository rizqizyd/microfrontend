// Import React and its hooks
import React, { useState, useEffect } from "react";

// Import routing components from react-router-dom v6
// - Router: allows using a custom history object
// - Routes: wrapper for all routes
// - Route: defines a single route
import { Routes, Route, Router } from "react-router-dom";

// Import MUI's styled engine provider to control CSS injection order
import { StyledEngineProvider } from "@mui/material/styles";

// Import app pages/components
import Landing from "./components/Landing";
import Pricing from "./components/Pricing";

// Export default component, receives `history` from parent (container or mount)
export default ({ history }) => {
  // Store the current location in local state (initially from history)
  const [location, setLocation] = useState(history.location);

  // Listen for navigation changes in history
  useEffect(() => {
    // Subscribe to history changes
    const unlisten = history.listen((update) => {
      // Update location state whenever history changes
      setLocation(update.location);
    });

    // Return cleanup function to unsubscribe on unmount
    return unlisten;
  }, [history]);

  return (
    <div>
      {/* Ensure Material UI styles are injected before other styles */}
      <StyledEngineProvider injectFirst>
        {/* Router using a custom history and controlled location */}
        <Router location={location} navigator={history}>
          <Routes>
            {/* Route for the Pricing page */}
            <Route path="/pricing" element={<Pricing />} />
            {/* Default route (Landing page) */}
            <Route path="/" element={<Landing />} />
          </Routes>
        </Router>
      </StyledEngineProvider>
    </div>
  );
};
