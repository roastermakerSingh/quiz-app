import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import QuizEntry from "../components/quiz/QuizEntry";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizResult from "../components/quiz/QuizResult";
import Button from "../components/common/Button";
import { todayHindi } from "../utils/helpers";

// Quiz phases
const PHASE = { ENTRY: "entry", QUIZ: "quiz", DONE: "done" };

export default function QuizPage() {
  const { quizState, questions, participants, setParticipants } = useApp();
  const navigate = useNavigate();

  // ── ALL hooks must be declared before any early return ───────
  const [phase, setPhase] = useState(PHASE.ENTRY);
  const [user, setUser] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleStart = (userData) => {
    setUser(userData);
    setQIndex(0);
    setScore(0);
    setPhase(PHASE.QUIZ);
  };

  const handleNext = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[qIndex].correct;
    const newScore = score + (isCorrect ? 1 : 0);

    if (qIndex + 1 >= questions.length) {
      const record = {
        name: user.name,
        mobile: user.mobile,
        score: newScore,
        total: questions.length,
        date: todayHindi(),
      };
      setParticipants((prev) => [...prev, record]);
      setScore(newScore);
      setPhase(PHASE.DONE);
    } else {
      setScore(newScore);
      setQIndex((i) => i + 1);
    }
  };

  // ── Early returns AFTER all hooks ────────────────────────────
  if (quizState === "idle") {
    return (
      <div className="page-container page-container--centered">
        <div className="status-screen">
          <div className="status-screen__icon">⏳</div>
          <h2 className="status-screen__title">क्विज़ अभी उपलब्ध नहीं है</h2>
          <p className="status-screen__sub">
            एडमिन द्वारा क्विज़ शुरू होने पर इस पृष्ठ पर वापस आएं।
          </p>
          <Button onClick={() => navigate("/")}>🏠 मुख्य पृष्ठ पर जाएं</Button>
        </div>
      </div>
    );
  }

  if (quizState === "ended" && phase === PHASE.ENTRY) {
    return (
      <div className="page-container page-container--centered">
        <div className="status-screen">
          <div className="status-screen__icon">🏁</div>
          <h2 className="status-screen__title">क्विज़ समाप्त हो गया है</h2>
          <p className="status-screen__sub">
            परिणाम जल्द ही प्रकाशित किए जाएंगे।
          </p>
          <Button onClick={() => navigate("/")}>🏠 मुख्य पृष्ठ पर जाएं</Button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <div className="page-container">
      {phase === PHASE.ENTRY && (
        <QuizEntry participants={participants} onStart={handleStart} />
      )}

      {phase === PHASE.QUIZ && questions.length > 0 && (
        <QuizQuestion
          key={qIndex}
          question={questions[qIndex]}
          questionNumber={qIndex + 1}
          totalQuestions={questions.length}
          onNext={handleNext}
        />
      )}

      {phase === PHASE.DONE && (
        <QuizResult name={user.name} score={score} total={questions.length} />
      )}
    </div>
  );
}
