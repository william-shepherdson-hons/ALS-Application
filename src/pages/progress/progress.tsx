import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import "./progress.css"; 

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

  // Prepare chart data (sorted + timestamp-based)
  const chartData = [...history]
    .sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() -
        new Date(b.recorded_at).getTime()
    )
    .map((entry) => ({
      time: new Date(entry.recorded_at).getTime(),
      progression: entry.progression,
    }));

  if (loading) {
    return (
      <main className="progress-container">
        <h1>Progress History</h1>
        <p>Loading skills...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="progress-container">
        <h1>Progress History</h1>
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="progress-container">
      <h1>Progress History</h1>

      {/* Dropdown */}
      <label>
        Select Skill:
        <select
          className="skill-dropdown"
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

      {/* Chart */}
      {historyLoading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No historical data for this skill.</p>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="time"
                tickFormatter={(t) =>
                  new Date(t).toLocaleDateString()
                }
              />

              <YAxis domain={[0, 1]} />

              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number" ? value.toFixed(3) : value ?? ""
                }
                labelFormatter={(label: any) =>
                  new Date(label).toLocaleString()
                }
              />

              <Line
                type="monotone"
                dataKey="progression"
                stroke="#8884d8"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <button
        className="navoptions"
        onClick={() => navigate("/")}
      >
        Home
      </button>
    </main>
  );
}