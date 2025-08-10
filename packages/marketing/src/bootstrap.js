// Import React library (needed for JSX and components)
import React from "react";

// Import the new React 18+ rendering API for mounting the app
import { createRoot } from "react-dom/client";

// Import both memory history (for microfrontend integration)
// and browser history (for standalone development)
import { createMemoryHistory, createBrowserHistory } from "history";

// Import the main App component
import App from "./App";

/**
 * Mount function — starts up the React app inside a given DOM element.
 * This is used by both the container app (remote mounting)
 * and local development (standalone running).
 *
 * @param {HTMLElement} el - The DOM element where the app will be mounted
 * @param {Object} options - Configuration options for mounting
 * @param {Function} options.onNavigate - Callback fired when navigation happens inside the microfrontend
 * @param {Object} options.defaultHistory - Optional browser history object for standalone mode
 * @param {string} options.initialPath - Initial route path for memory history
 */
const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
  // If defaultHistory is provided (standalone mode), use it;
  // otherwise, create a memory history (for being controlled by a container)
  const history =
    defaultHistory ||
    createMemoryHistory({
      // Memory history starts with a specific path if provided
      initialEntries: [initialPath],
    });

  // If the container provided an onNavigate callback,
  // set up a listener for route changes inside this microfrontend
  if (onNavigate) {
    history.listen((update) => {
      // Notify container about navigation with the new pathname
      onNavigate({ pathname: update.location.pathname });
    });
  }

  // Create a React root in the target DOM element
  const root = createRoot(el);

  // Render the App component and pass the history object as a prop
  root.render(<App history={history} />);

  // Return an API object for the container to control this microfrontend
  return {
    /**
     * Called by the container when it navigates to a new route.
     * Keeps the microfrontend in sync with container's navigation.
     */
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      // Only navigate if paths are different (avoid infinite loops)
      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// In development mode and if running standalone (not inside container),
// mount the app immediately to the dev root element
if (process.env.NODE_ENV === "development") {
  // Find the dev root element in the HTML (only exists in standalone dev)
  const devRoot = document.querySelector("#_marketing-dev-root");

  if (devRoot) {
    // Mount with browser history for normal URL navigation
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}

// When used inside a container app (production or dev),
// export the mount function so the container can mount this microfrontend
export { mount };
