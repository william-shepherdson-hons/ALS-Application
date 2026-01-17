import "../../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [appDataDirPath, setAppDataDirPath] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function init() {
      const dir = await appDataDir();
      setAppDataDirPath(dir || "");
    }
    init();
  }, []);
  
  const sign_up = async() => {
    if (!appDataDirPath) {
      console.error("App data dir not loaded yet!");
      return;
    }
    try {
      await invoke("handle_sign_up", { 
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to sign un:", err);
    }
    
  }
  return (
    <main className="container">
      <h1>Sign Up</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />     
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      /> 
      <input
        type="text"
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name"
      />
      <input
        type="text"
        value={last_name}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <button onClick={() => navigate("/")}>Cancel</button>
      <button onClick={sign_up}>Sign Up</button>
    </main>
  );
}