import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { useNavigate, useLocation } from "react-router-dom";
import "../../App.css";

const QUESTION_COUNT = 10;

type QuestionPair = {
  question: string;
  answer: string;
};

type AssessmentResult = {
  topic: string;
  correct: boolean;
};

type QuestionState = {
  pair: QuestionPair;
  userAnswer: string;
  correct: boolean | null; // null = not yet submitted
};

export default function Assessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const topic: string = location.state?.topic ?? "";

  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) {
      navigate("/learn");
      return;
    }
    async function generateAssessment() {
      try {
        const appDataDirPath = await appDataDir();
        const pairs = await invoke<QuestionPair[]>("generate_assessment", {
          app_data_dir: appDataDirPath,
          topic,
          amount: QUESTION_COUNT,
        });
        setQuestions(pairs.map((pair) => ({ pair, userAnswer: "", correct: null })));
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    generateAssessment();
  }, []);

  function handleSubmitAnswer() {
    const current = questions[currentIndex];
    if (!current || inputValue.trim() === "") return;

    const correct =
      inputValue.trim().toLowerCase() === current.pair.answer.trim().toLowerCase();

    const updated = questions.map((q, i) =>
      i === currentIndex ? { ...q, userAnswer: inputValue.trim(), correct } : q
    );
    setQuestions(updated);
    setInputValue("");

    if (currentIndex + 1 >= questions.length) {
      submitResults(updated);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  async function submitResults(finalQuestions: QuestionState[]) {
    setFinished(true);
    setSubmitting(true);
    try {
      const appDataDirPath = await appDataDir();
      const results: AssessmentResult[] = finalQuestions.map((q) => ({
        topic,
        correct: q.correct ?? false,
      }));
      await invoke("grade_assessment", {
        app_data_dir: appDataDirPath,
        results,
      });
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!topic) return null;

  if (loading) {
    return (
      <main className="container">
        <h1>Assessment: {topic}</h1>
        <p>Generating questions…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Assessment</h1>
        <p className="error">{error}</p>
        <button onClick={() => navigate("/learn")}>Back</button>
      </main>
    );
  }

  const score = questions.filter((q) => q.correct === true).length;

  if (finished) {
    return (
      <main className="container">
        <h1>Assessment Complete</h1>
        <p>
          Topic: <strong>{topic}</strong>
        </p>
        <p>
          Score: <strong>{score} / {questions.length}</strong>
        </p>

        <div className="results-list">
          {questions.map((q, i) => (
            <div key={i} className={`result-item ${q.correct ? "correct" : "incorrect"}`}>
              <p>
                <strong>Q{i + 1}:</strong> {q.pair.question}
              </p>
              <p>Your answer: {q.userAnswer}</p>
              {!q.correct && <p>Correct answer: {q.pair.answer}</p>}
            </div>
          ))}
        </div>

        {submitting && <p>Saving results…</p>}

        <button onClick={() => navigate("/learn")} disabled={submitting}>
          Back to Learn
        </button>
        <button onClick={() => navigate("/")} disabled={submitting}>
          Home
        </button>
      </main>
    );
  }

  const current = questions[currentIndex];

  return (
    <main className="container">
      <h1>Assessment: {topic}</h1>
      <p>
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="question-card">
        <h2>Question</h2>
        <p>{current.pair.question}</p>

        <label htmlFor="answer-input">Your answer:</label>
        <input
          id="answer-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmitAnswer();
          }}
          autoFocus
        />

        <button onClick={handleSubmitAnswer} disabled={!inputValue.trim()}>
          {currentIndex + 1 === questions.length ? "Finish" : "Next"}
        </button>
      </div>

      <button onClick={() => navigate("/learn")}>Cancel</button>
    </main>
  );
}