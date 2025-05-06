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

// Add meta tags
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Aplicación de rutina de ejercicios diarios con 5 videos guiados para mantenerte en forma.";
document.head.appendChild(metaDescription);

// Page title
document.title = "Rutina de Ejercicios";

createRoot(document.getElementById("root")!).render(<App />);
