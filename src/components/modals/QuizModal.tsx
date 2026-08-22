import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  HelpCircle,
  Zap,
  Timer
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

export const QuizModal: React.FC = () => {
  const { activeQuizTopic, setActiveQuizTopic, submitQuizScore } = useTitan();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  if (!activeQuizTopic) return null;

  const questions = activeQuizTopic.quizQuestions;
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
    soundEngine.playClick(780);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerRevealed(true);

    if (selectedOption === currentQ.correctIndex) {
      setCorrectAnswersCount(prev => prev + 1);
      soundEngine.playQuestComplete();
    } else {
      soundEngine.playAlert();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      soundEngine.playClick(900);
    } else {
      setIsQuizComplete(true);
    }
  };

  const finalScorePercentage = Math.round(((correctAnswersCount + (selectedOption === currentQ.correctIndex && !isQuizComplete ? 1 : 0)) / questions.length) * 100);

  const handleFinalSubmit = () => {
    submitQuizScore(activeQuizTopic, finalScorePercentage);
    setActiveQuizTopic(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in font-mono">
      <div className="relative w-full max-w-2xl rounded-2xl border border-titan-cyan/50 bg-titan-surface p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-400 text-xs font-bold">
              {activeQuizTopic.discipline.replace(/_/g, ' ')}
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-md">
              {activeQuizTopic.title}
            </h3>
          </div>
          <button
            onClick={() => setActiveQuizTopic(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isQuizComplete ? (
          <div className="mt-4">
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>QUESTION {currentQIndex + 1} OF {questions.length}</span>
              <span className="text-titan-cyan">
                {Math.round(((currentQIndex) / questions.length) * 100)}% COMPLETE
              </span>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-5">
              <div
                className="bg-titan-cyan h-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-xl border border-slate-800 bg-titan-card/70">
              <p className="text-sm font-bold text-white leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options List */}
            <div className="mt-4 space-y-2.5 text-xs">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'border-slate-800 bg-titan-card hover:border-slate-600 text-slate-300';
                if (selectedOption === idx) {
                  btnStyle = 'border-titan-cyan bg-cyan-950/40 text-cyan-300 font-bold';
                }
                if (isAnswerRevealed) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold';
                  } else if (selectedOption === idx) {
                    btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerRevealed}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerRevealed && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {isAnswerRevealed && (
              <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-200">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-400">
                  <HelpCircle className="h-3.5 w-3.5" /> INSTITUTIONAL MECHANICS EXPLANATION:
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              {!isAnswerRevealed ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleConfirmAnswer}
                  className="px-5 py-2 rounded-lg bg-titan-cyan hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs shadow-glow-cyan"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-titan-emerald hover:bg-emerald-400 text-black font-bold text-xs shadow-glow-emerald"
                >
                  <span>{currentQIndex + 1 < questions.length ? 'Next Question' : 'Complete Drill'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results Screen */
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 shadow-glow-emerald">
              <Award className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-bold text-white mt-4">
              INSTITUTIONAL CONCEPT DRILL COMPLETED
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Score recorded into institutional mastery baseline.
            </p>

            <div className="mt-6 inline-flex flex-col items-center p-4 rounded-xl border border-slate-800 bg-titan-card/80">
              <div className="text-xs text-slate-400">EVALUATION SCORE</div>
              <div className="text-4xl font-extrabold text-titan-emerald mt-1">
                {finalScorePercentage}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {correctAnswersCount} of {questions.length} Correct Questions
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-lg bg-titan-cyan hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan"
              >
                Log to Institutional Baseline (+XP)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
