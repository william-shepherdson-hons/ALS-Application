import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import "../../App.css";

export default function Learn() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const appDataDirPath = await appDataDir();

        const result = await invoke<string[]>("handle_fetch_topics", {
          app_data_dir: appDataDirPath,
        });

        setTopics(result);
        if (result.length > 0) {
          setSelectedTopic(result[0]);
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <main className="container">
        <h1>Learn</h1>
        <p>Loading topics…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Learn</h1>
        <p className="error">{error}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Learn</h1>

      <label htmlFor="topic-select">Select a topic:</label>
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      {selectedTopic && (
        <p>
          Selected topic: <strong>{selectedTopic}</strong>
        </p>
      )}
    </main>
  );
}
