import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";

export default function Launch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const appDataDirPath = await appDataDir();
      setLoading(false);
      navigate("/main");
    }

    init();
  }, [navigate]);

  if (loading) {
    return <div>Loading…</div>;
  }

  return null;
}
