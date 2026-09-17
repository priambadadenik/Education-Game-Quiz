import React, { useState, useEffect, useRef } from 'react';
import { EducationLevel, DifficultyLevel, Question, QuizResult } from '../types';
import { DIFFICULTY_CONFIG } from '../data/quizData';
import { soundEngine } from '../utils/audio';
import { Timer, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';

interface QuizGameplayProps {
  questions: Question[];
  level: EducationLevel;
  subjectId: string;
  studentName: string;
  difficulty: DifficultyLevel;
  onFinishQuiz: (result: QuizResult) => void;
  onQuitQuiz: () => void;
}

export const QuizGameplay: React.FC<QuizGameplayProps> = ({
  questions,
  level,
  subjectId,
  studentName,
  difficulty,
  onFinishQuiz,
  onQuitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex] || questions[0];
  const diffCfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Biasa;
  const maxTime = currentQuestion.timeLimit || diffCfg.timeLimit || 15;

  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedKey, setSelectedKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Stats accumulator
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<QuizResult['history']>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(currentQuestion.timeLimit || maxTime);
    setHasAnswered(false);
    setSelectedKey(null);
    setIsTimedOut(false);
    questionStartTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 4) {
          soundEngine.playTick();
        }
        return prev - 1;
      });
      setTotalTimeSpent((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentQuestion, maxTime]);

  const handleTimeout = () => {
    setHasAnswered(true);
    setIsTimedOut(true);
    setSelectedKey(null);
    setStreak(0);
    soundEngine.playWrong();

    const timeTaken = currentQuestion.timeLimit || maxTime;
    setAnswerHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedAnswer: null,
        isCorrect: false,
        timeTaken,
      },
    ]);
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (hasAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = Math.min(
      currentQuestion.timeLimit || maxTime,
      Math.round((Date.now() - questionStartTimeRef.current) / 1000)
    );

    const isCorrect = key === currentQuestion.correctAnswer;
    setHasAnswered(true);
    setSelectedKey(key);

    if (isCorrect) {
      soundEngine.playCorrect();
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      soundEngine.playWrong();
      setStreak(0);
    }

    setAnswerHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedAnswer: key,
        isCorrect,
        timeTaken,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Finished Quiz
      const finalScore = Math.round((correctCount / questions.length) * 100);

      onFinishQuiz({
        level,
        subjectId,
        subjectName: currentQuestion.subjectName,
        difficulty,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: questions.length - correctCount,
        score: finalScore,
        timeSpentSeconds: totalTimeSpent,
        history: answerHistory,
        completedAt: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }
  };

  // Progress percentage
  const timerPercentage = Math.max(0, (timeLeft / maxTime) * 100);
  const currentRunningScore = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
            {level}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                {currentQuestion.subjectName}
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${diffCfg.badgeBg}`}>
                {diffCfg.icon} {difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Siswa: <span className="text-slate-800 font-bold">{studentName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Streak Indicator */}
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs font-black animate-bounce">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}x Beruntun!</span>
            </div>
          )}

          {/* Question Index */}
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              Soal
            </span>
            <span className="text-base font-black text-slate-800">
              {currentIndex + 1} <span className="text-slate-400 text-xs">/ {questions.length}</span>
            </span>
          </div>

          {/* Current Score */}
          <div className="pl-3 border-l border-slate-200 text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              Poin
            </span>
            <span className="text-base font-black text-emerald-600">
              {currentRunningScore}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown Timer Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span
            className={`flex items-center gap-1.5 transition-colors ${
              timeLeft <= 4 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>
              Sisa Waktu:{' '}
              <strong className="text-sm font-black">{timeLeft}</strong> detik ({diffCfg.label})
            </span>
          </span>
          {timeLeft <= 4 && !hasAnswered && (
            <span className="text-rose-600 text-[11px] font-extrabold animate-pulse">
              Waktu hampir habis!
            </span>
          )}
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft > 8
                ? 'bg-emerald-500'
                : timeLeft > 4
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              Pertanyaan #{currentIndex + 1}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${diffCfg.badgeBg}`}>
              {diffCfg.icon} Tingkat {currentQuestion.difficulty || difficulty}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Choices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            const isCorrectAnswer = opt.key === currentQuestion.correctAnswer;

            let cardStyle =
              'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-800';
            let badgeStyle = 'border-slate-300 bg-slate-100 text-slate-700';

            if (hasAnswered) {
              if (isCorrectAnswer) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30';
                badgeStyle = 'border-emerald-500 bg-emerald-600 text-white';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400/30';
                badgeStyle = 'border-rose-500 bg-rose-600 text-white';
              } else {
                cardStyle = 'border-slate-200 bg-slate-50/60 opacity-50 text-slate-600';
                badgeStyle = 'border-slate-200 bg-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                id={`option-btn-${opt.key.toLowerCase()}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(opt.key)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-semibold transition-all flex items-center justify-between gap-3.5 cursor-pointer group ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border transition-colors ${badgeStyle}`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm sm:text-base leading-snug">{opt.text}</span>
                </div>

                {hasAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Box */}
        {hasAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-sm space-y-2 animate-fadeIn ${
              isTimedOut
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : selectedKey === currentQuestion.correctAnswer
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-base">
              {isTimedOut ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Waktu Habis! Kunci jawaban adalah: {currentQuestion.correctAnswer}</span>
                </>
              ) : selectedKey === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Luar Biasa, Jawabanmu Benar! 🌟</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Jawaban Kurang Tepat. Kunci Jawaban: {currentQuestion.correctAnswer}</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed opacity-95">
              <strong className="font-semibold">Pembahasan:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onQuitQuiz}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            Keluar dari Kuis
          </button>

          {hasAnswered && (
            <button
              type="button"
              id="btn-next-question"
              onClick={handleNext}
              className="py-3 px-6 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 === questions.length ? 'Lihat Hasil Akhir' : 'Soal Berikutnya'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
