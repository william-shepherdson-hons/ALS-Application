import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import "./sign_in.css";

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
    if (!appDataDirPath) return;
    try {
      await invoke("signin", { 
        app_data_dir: appDataDirPath,
        username,
        password
      });
      navigate("/main");
    } catch (err) {
      console.error("Failed to sign in:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}