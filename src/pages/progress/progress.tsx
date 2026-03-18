import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";

interface SkillProgression {
  skill_name: string;
  progression: number;
  recorded_at: string;
}

export default function Progress() {
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [history, setHistory] = useState<SkillProgression[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch available historical skills
  useEffect(() => {
    async function fetchSkills() {
      try {
        const appDataDirPath = await appDataDir();

        const result = await invoke<string[]>("handle_fetch_historical_skills", {
          app_data_dir: appDataDirPath,
        });

        setSkills(result);

        // auto-select first skill if exists
        if (result.length > 0) {
          setSelectedSkill(result[0]);
        }
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  // Fetch history when selected skill changes
  useEffect(() => {
    if (!selectedSkill) return;

    async function fetchHistory() {
      try {
        setHistoryLoading(true);

        const appDataDirPath = await appDataDir();

        const result = await invoke<SkillProgression[]>(
          "handle_fetch_skill_history",
          {
            app_data_dir: appDataDirPath,
            skill_name: selectedSkill,
          }
        );

        setHistory(result);
      } catch (err) {
        setError(err as string);
      } finally {
        setHistoryLoading(false);
      }
    }

    fetchHistory();
  }, [selectedSkill]);

  if (loading) {
    return (
      <main className="container">
        <h1>Progress History</h1>
        <p>Loading skills...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Progress History</h1>
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Progress History</h1>

      {/* Dropdown */}
      <label>
        Select Skill:
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          {skills.map((skill, idx) => (
            <option key={idx} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </label>

      {/* History Table */}
      {historyLoading ? (
        <p>Loading history...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Skill Name</th>
              <th>Progression</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.skill_name}</td>
                <td>{entry.progression.toFixed(2)}</td>
                <td>{new Date(entry.recorded_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/")}>Home</button>
    </main>
  );
}