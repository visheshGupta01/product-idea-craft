import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "leaflet/dist/leaflet.css";
import "leaflet.heat";   // ⬅️ this is required for heatmap


createRoot(document.getElementById("root")!).render(<App />);
