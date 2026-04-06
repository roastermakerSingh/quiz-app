import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import { useQuizTimer } from '../../hooks/useQuizTimer';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onNext,
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback((idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    timer.stop();
  }, [revealed]); // eslint-disable-line

  const timer = useQuizTimer(20, () => handleReveal(null));

  // Start timer fresh for each question
  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    timer.start();
  }, [question.id]); // eslint-disable-line

  const progress = ((questionNumber - 1) / totalQuestions) * 100;
  const isUrgent = timer.timeLeft <= 5;

  return (
    <div className="quiz-question">
      {/* Progress + meta */}
      <div className="quiz-question__meta">
        <span className="quiz-question__counter">
          प्रश्न {questionNumber} / {totalQuestions}
        </span>
        <span className={`quiz-timer ${isUrgent ? 'quiz-timer--urgent' : ''}`}>
          ⏱ {timer.timeLeft}s
        </span>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress">
        <div className="quiz-progress__bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Question card */}
      <div className="quiz-card">
        <p className="quiz-card__question">
          {questionNumber}. {question.question}
        </p>

        <div className="quiz-card__options">
          {question.options.map((opt, i) => {
            let variant = '';
            if (revealed) {
              if (i === question.correct) variant = 'correct';
              else if (i === selected)    variant = 'wrong';
              else                        variant = 'dim';
            } else if (i === selected) {
              variant = 'selected';
            }

            return (
              <button
                key={i}
                className={`option-btn option-btn--${variant || 'default'}`}
                disabled={revealed}
                onClick={() => handleReveal(i)}
              >
                <span className="option-btn__letter">{LETTERS[i]}</span>
                <span className="option-btn__text">{opt}</span>
                {revealed && i === question.correct && (
                  <span className="option-btn__icon">✓</span>
                )}
                {revealed && i === selected && i !== question.correct && (
                  <span className="option-btn__icon">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="quiz-card__next">
            {selected === question.correct
              ? <p className="quiz-card__feedback quiz-card__feedback--correct">✓ सही जवाब!</p>
              : <p className="quiz-card__feedback quiz-card__feedback--wrong">✕ गलत जवाब</p>
            }
            <Button onClick={() => onNext(selected)} variant="primary">
              {questionNumber >= totalQuestions ? 'जमा करें ✓' : 'अगला प्रश्न →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
