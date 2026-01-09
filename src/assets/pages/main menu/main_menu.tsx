import { useNavigate } from "react-router-dom";
import "../../../App.css";


export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <h1>Welcome to Adapt math</h1>
      
      <div className="mainmenu">
        <div className="row">
          <button className="navoptions" onClick={() => navigate("/progress")}>
            Progress
          </button>
          <button className="navoptions" onClick={() => navigate("/learn")}>
            Learn
          </button>
          <button className="navoptions" onClick={() => navigate("/settings")}>
            Settings
          </button>
        </div>
      </div>
    </main>
  );
}


