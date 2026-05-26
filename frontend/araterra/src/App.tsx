import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { MapPage } from "./pages/MapPage/MapPage";
import { NotFound } from "./pages/NotFound/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
