import { useEffect, useState } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import type { Info } from "../types/info.ts";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const [info, setInfo] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function loadAccount() {
      const appDataDirPath = await appDataDir();

      const accountInfo = await invoke<Info>(
        "get_account_details",
        { app_data_dir: appDataDirPath }
      );

      setInfo(accountInfo);
      setLoading(false);
    }

    loadAccount();
  }, []);

  async function signOut() {
    const appDataDirPath = await appDataDir();

    await invoke("handle_sign_out", {
      app_data_dir: appDataDirPath,
    });
    navigate("/")
  }

  if (loading) {
    return <div>Loading account…</div>;
  }

  if (!info) {
    return <div>Failed to load account</div>;
  }

  return (
    <main className="container">

      
      <h1>Welcome to Adapt math {info.first_name}</h1>

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
        <button onClick={signOut}>Sign Out</button>
      </div>
    </main>
     
  );
}
