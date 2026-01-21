import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import "../../App.css";

type QuestionPair = {
  question: string;
  answer: string;
};

export default function Learn() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [questionPair, setQuestionPair] = useState<QuestionPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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

  async function handleGenerateQuestion() {
    try {
      setGenerating(true);
      setError(null);

      const appDataDirPath = await appDataDir();

      const result = await invoke<QuestionPair>("handle_generate_question", {
        app_data_dir: appDataDirPath,
        topic: selectedTopic,
      });

      setQuestionPair(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setGenerating(false);
    }
  }

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
        onChange={(e) => {
          setSelectedTopic(e.target.value);
          setQuestionPair(null);
        }}
      >
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      <button
        onClick={handleGenerateQuestion}
        disabled={!selectedTopic || generating}
      >
        {generating ? "Generating…" : "Generate Question"}
      </button>

      {questionPair && (
        <div className="question-card">
          <h2>Question</h2>
          <p>{questionPair.question}</p>

          <details>
            <summary>Show Answer</summary>
            <p>{questionPair.answer}</p>
          </details>
        </div>
      )}
    </main>
  );
}
