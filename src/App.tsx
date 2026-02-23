import { Routes, Route } from "react-router-dom";

import MainMenu from "./pages/main menu/main_menu";
import SignIn from "./pages/sign_in/sign_in";
import SignUp from "./pages/sign_up/sign_up";
import Settings from "./pages/settings/settings";
import Progress from "./pages/progress/progress";
import Learn from "./pages/learn/learn";
import Launch from "./pages/launch/launch";
import Assessment from "./pages/assessment/assessment";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Launch />} />
      <Route path="/main" element={<MainMenu />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/assessment" element={<Assessment />} />
    </Routes>
  );
}
