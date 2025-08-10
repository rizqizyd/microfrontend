// Import the mount function from the remote Marketing microfrontend
// mount is a simple function that takes in a reference to an HTML element
import { mount } from "marketing/MarketingApp";

// Import React hooks
import React, { useRef, useEffect } from "react";

// Import router hooks for navigation and getting current location
import { useNavigate, useLocation } from "react-router-dom";

// Default export: a wrapper component for mounting the Marketing MFE (microfrontend)
export default () => {
  // `ref` will point to the DOM element where the Marketing app will be mounted
  const ref = useRef(null);

  // Current location object from the container's router
  const location = useLocation();

  // Navigation function from the container's router
  const navigate = useNavigate();

  // Store the `onParentNavigate` function returned by the child MFE
  // so we can call it later when the container navigates
  const onParentNavigateRef = useRef(null);

  // Mount the microfrontend once when this wrapper first renders
  useEffect(() => {
    // Call the child MFE's mount() function, passing:
    // - The DOM element (`ref.current`) to render into
    // - The initial path (so child starts at the same route as container)
    // - An onNavigate callback (child → container sync)
    const { onParentNavigate } = mount(ref.current, {
      initialPath: location.pathname,
      onNavigate: ({ pathname: nextPathname }) => {
        // If child navigates, tell container's router to navigate
        navigate(nextPathname);
      },
    });

    // Save the returned `onParentNavigate` (container → child sync)
    onParentNavigateRef.current = onParentNavigate;
  }, []); // Empty dependency → only run once after initial render

  // Whenever the container's location changes,
  // tell the child MFE to navigate to the same route
  useEffect(() => {
    if (onParentNavigateRef.current) {
      onParentNavigateRef.current({ pathname: location.pathname });
    }
  }, [location]); // Run whenever container's location changes

  // Render an empty <div> as a mount point for the child MFE
  return <div ref={ref} />;
};
