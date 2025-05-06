import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Google Fonts and Material Icons
const linkFont = document.createElement("link");
linkFont.rel = "stylesheet";
linkFont.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap";
document.head.appendChild(linkFont);

const linkIcons = document.createElement("link");
linkIcons.rel = "stylesheet";
linkIcons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(linkIcons);

// No need to add meta tags here as they are now in index.html

// Page title is already in index.html

createRoot(document.getElementById("root")!).render(<App />);
