import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";


export default function Launch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const appDataDirPath = await appDataDir();
      let signed_in = false;
      setLoading(false);
      await invoke('check_sign_in_status', {app_data_dir: appDataDirPath}).then((result) => signed_in = result as boolean)

      if (signed_in) {
        navigate("/main");
      }
      else {
        navigate("/signin")
      }
      
    }

    init();
  }, [navigate]);

  if (loading) {
    return <div>Loading…</div>;
  }

  return null;
}
