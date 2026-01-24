import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import type { Info } from "../types/info.ts";
import "../../App.css";

type QuestionPair = {
  question: string;
  answer: string;
};

export default function Learn() {
  const [info, setInfo] = useState<Info | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [questionPair, setQuestionPair] = useState<QuestionPair | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
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

        const accountInfo = await invoke<Info>("get_account_details", {
          app_data_dir: appDataDirPath,
        });

        setInfo(accountInfo);
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
      setUserAnswer("");
      setIsCorrect(null);
      setHasSubmitted(false);

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

  async function handleSubmitAnswer() {
    if (!questionPair || hasSubmitted) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = questionPair.answer.trim().toLowerCase();
    const correct = normalizedUser === normalizedCorrect;

    setIsCorrect(correct);
    setHasSubmitted(true);

    try {
      const appDataDirPath = await appDataDir();

      await invoke("handle_update_progression", {
        app_data_dir: appDataDirPath,
        skill: selectedTopic,
        correct,
      });
    } catch (err) {
      console.error("Failed to update progression:", err);
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

  const canSeeAnswer = info?.username === "will";

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
          setUserAnswer("");
          setIsCorrect(null);
          setHasSubmitted(false);
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

          <label htmlFor="answer-input">Your answer:</label>
          <input
            id="answer-input"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={hasSubmitted}
          />

          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim() || hasSubmitted}
          >
            Submit Answer
          </button>

          {isCorrect === true && (
            <p className="correct">Correct!</p>
          )}

          {isCorrect === false && (
            <p className="incorrect">Incorrect.</p>
          )}

          {canSeeAnswer && (
            <details>
              <summary>Show Answer</summary>
              <p>{questionPair.answer}</p>
            </details>
          )}
        </div>
      )}
    </main>
  );
}
