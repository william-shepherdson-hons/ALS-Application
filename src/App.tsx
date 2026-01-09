import { Routes, Route } from "react-router-dom";

import MainMenu from "./assets/pages/main menu/main_menu";
import SignIn from "./assets/pages/sign_in/sign_in";
import SignUp from "./assets/pages/sign_up/sign_up";
import Settings from "./assets/pages/settings/settings";
import Progress from "./assets/pages/progress/progress";
import Learn from "./assets/pages/learn/learn";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
