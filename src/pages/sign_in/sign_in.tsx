import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import "../../App.css";

export default function SignIn() {
  const [appDataDirPath, setAppDataDirPath] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      await invoke("signin", { 
        app_data_dir: appDataDirPath,
        username: username,
        password: password
      });
      navigate("/main");
    } catch (err) {
      console.error("Failed to sign in:", err);
    }
  };

  return (
    <main className="container">
      <h1>Sign In</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignIn}>Sign in</button>
    </main>
  );
}