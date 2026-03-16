import "../../App.css";
import { useEffect, useState } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadQuestionType() {
      try {
        const appDataDirPath = await appDataDir();

        const result = await invoke<boolean>(
          "read_question_type",
          { app_data_dir: appDataDirPath }
        );

        setAiEnabled(result);
      } catch (err) {
        console.error("Failed to load question type:", err);
        setAiEnabled(false); // fallback default
      } finally {
        setLoading(false);
      }
    }

    loadQuestionType();
  }, []);

  async function handleToggle() {
    if (aiEnabled === null) return;

    try {
      const appDataDirPath = await appDataDir();

      await invoke("toggle_question_type", {
        app_data_dir: appDataDirPath,
      });

      // Optimistically update UI
      setAiEnabled(!aiEnabled);
    } catch (err) {
      console.error("Failed to toggle question type:", err);
    }
  }

  if (loading) {
    return <div>Loading settings…</div>;
  }

  return (
    <main className="container">
      <h1>Settings</h1>

      <div className="settings-section">
        <label className="toggle-row">
          <span>AI Question Mode (Please limit use to necessary cases only as it costs money)</span>
          <input
            type="checkbox"
            checked={aiEnabled ?? false}
            onChange={handleToggle}
          />
        </label>
      </div>

      <button
        className="navoptions"
        onClick={() => navigate("/main")}
      >
        Back to Main Menu
      </button>
    </main>
  );
}