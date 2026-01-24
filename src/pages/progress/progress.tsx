import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";
import "../../App.css";

interface SkillProgression {
  skill_name: string;
  progression: number;
}

export default function Progress() {
  const [progressions, setProgressions] = useState<SkillProgression[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProgression() {
      try {
        const appDataDirPath = await appDataDir();
        const result = await invoke<SkillProgression[]>("handle_fetch_progression", {
          app_data_dir: appDataDirPath, 
        });
        setProgressions(result);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    }

    fetchProgression();
  }, []);

  if (loading) return <main className="container"><h1>Progress</h1><p>Loading...</p></main>;
  if (error) return <main className="container"><h1>Progress</h1><p>Error: {error}</p></main>;

  return (
    <main className="container">
      <h1>Progress</h1>
      <table>
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Progression</th>
          </tr>
        </thead>
        <tbody>
          {progressions.map((prog, idx) => (
            <tr key={idx}>
              <td>{prog.skill_name}</td>
              <td>{prog.progression.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/")}>Home</button>
    </main>
  );
}