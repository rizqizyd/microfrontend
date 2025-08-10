/**
 * our container doesn't need a mount function.
 * whenever the container application is gonna be shown inside the browser, we always want the container to show itself immediately.
 * it's only our sub-projects that need to export some kind of mount function of render themselves conditionally, depending upon whether or not we are in development.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.querySelector("#root"));
root.render(<App />);
