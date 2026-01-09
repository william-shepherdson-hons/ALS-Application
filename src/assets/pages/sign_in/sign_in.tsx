import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";

import "../../../App.css";

export default function SignIn() {
  const [appDataDirPath, setAppDataDirPath] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const dir = await appDataDir();
      setAppDataDirPath(dir || "");
    }

    init();
  }, []);

  const handleSignIn = async () => {
    if (!appDataDirPath) {
      console.error("App data dir not loaded yet!");
      return;
    }

    try {
      await invoke("signin", { app_data_dir: appDataDirPath });
      navigate("/main");
    } catch (err) {
      console.error("Failed to sign in:", err);
    }
  };

  return (
    <main className="container">
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign in</button>
    </main>
  );
}
