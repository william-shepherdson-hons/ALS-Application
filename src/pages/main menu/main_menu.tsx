import { useEffect, useState } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import type { Info } from "../types/info.ts";

export default function Main() {
  const [info, setInfo] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading account…</div>;
  }

  if (!info) {
    return <div>Failed to load account</div>;
  }

  return (
    <div>
      <h1>Welcome</h1>
      <p>
        {info.first_name} {info.last_name}
      </p>
    </div>
  );
}
