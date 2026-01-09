import { Routes, Route } from "react-router-dom";

import MainMenu from "./assets/pages/main menu/main_menu";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
    </Routes>
  );
}
