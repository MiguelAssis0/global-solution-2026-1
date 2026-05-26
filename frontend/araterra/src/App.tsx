import { Routes, Route } from "react-router-dom";
import { MapPage } from "./pages/MapPage/MapPage";
import { NotFound } from "./pages/NotFound/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
