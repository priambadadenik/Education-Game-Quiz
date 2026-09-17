import React, { useEffect, useState } from 'react';
import { QuizResult } from '../types';
import { DIFFICULTY_CONFIG } from '../data/quizData';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { 
  RotateCcw, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Home,
  UserCog
} from 'lucide-react';

interface ScoreScreenProps {
  result: QuizResult;
  studentName: string;
  onPlayAgain: () => void;
  onBackToHome?: () => void;
  onChangeProfile?: () => void;
}

export const ScoreScreen: React.FC<ScoreScreenProps> = ({
  result,
  studentName,
  onPlayAgain,
  onBackToHome,
  onChangeProfile,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(true);

  const diffCfg = DIFFICULTY_CONFIG[result.difficulty] || DIFFICULTY_CONFIG.Biasa;

  // Trigger celebration on mount
  useEffect(() => {
    soundEngine.playFanfare();

    if (result.score >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'],
        });
      } catch {
        // fallback if canvas-confetti fails in container
      }
    }
  }, [result.score]);

  const getRatingBadge = () => {
    if (result.score >= 85) {
      return {
        title: 'Bintang Pelajar Gemilang! 🏆',
        desc: 'Pemahamanmu sangat istimewa, pertahankan prestasi luar biasa ini!',
        stars: 5,
        color: 'text-amber-500',
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
      };
    }
    if (result.score >= 65) {
      return {
        title: 'Hebat & Membanggakan! 🌟',
        desc: 'Hasil belajar yang sangat baik, terus asah rasa ingin tahumu!',
        stars: 4,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      };
    }
    return {
      title: 'Tetap Semangat Belajar! 💪',
      desc: 'Setiap kesalahan adalah langkah awal menuju pemahaman yang lebih matang.',
      stars: 3,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    };
  };

  const rating = getRatingBadge();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Main Score Summary Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-6">
        {/* Celebration Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>Ringkasan Hasil Evaluasi Kuis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {rating.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Selamat kepada <strong className="text-slate-900">{studentName}</strong> telah menyelesaikan kuis jenjang{' '}
            <span className="font-bold text-indigo-600">{result.level}</span> mata pelajaran{' '}
            <span className="font-bold text-slate-800">{result.subjectName}</span> pada{' '}
            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded border text-xs ${diffCfg.badgeBg}`}>
              {diffCfg.icon} Tingkat {result.difficulty}
            </span>.
          </p>
        </div>

        {/* Big Score Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-100/90 max-w-md mx-auto flex flex-col items-center justify-center shadow-xs">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
            Skor Akhir
          </span>
          <div className="text-6xl sm:text-7xl font-black text-indigo-700 tracking-tight flex items-baseline">
            {result.score}
            <span className="text-2xl sm:text-3xl font-bold text-slate-400 ml-1">/ 100</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-2xl transition-transform ${
                  s <= rating.stars ? 'text-amber-400 scale-110' : 'text-slate-200'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">{rating.desc}</p>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Soal
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
              {result.totalQuestions}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-900">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Benar
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">
              {result.correctAnswers}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center text-rose-900">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
              Salah / Telat
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-700 mt-1 block">
              {result.wrongAnswers}
            </span>
          </div>
        </div>

        {/* Evaluasi Hasil Belajar & Feedback */}
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-left space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Catatan Evaluasi Pembelajaran:</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kuis tingkat <strong className="text-indigo-700">{result.difficulty}</strong> dengan alokasi waktu {diffCfg.timeLimit} detik per soal telah berhasil diselesaikan. Pelajari detail pembahasan di bawah untuk memperdalam pemahaman konsep!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onPlayAgain}
            id="btn-score-play-again"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Kuis Lagi (10 Soal Acak)</span>
          </button>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              id="btn-score-back-home"
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm border border-slate-200"
            >
              <Home className="w-4 h-4 text-indigo-600" />
              <span>Kembali ke Beranda (Home)</span>
            </button>
          )}

          {onChangeProfile && (
            <button
              onClick={onChangeProfile}
              id="btn-score-change-profile"
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <UserCog className="w-4 h-4 text-slate-500" />
              <span>Ganti Jenjang / Mapel</span>
            </button>
          )}
        </div>
      </div>

      {/* Question by Question Review Accordion */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div 
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              Detail Pembahasan Tiap Soal
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              ({result.history.length} Soal • Tingkat {result.difficulty})
            </span>
          </div>
          <button className="text-slate-500 hover:text-slate-800 p-1">
            {showBreakdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showBreakdown && (
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            {result.history.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-sm space-y-2 ${
                  item.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{ backgroundColor: item.isCorrect ? '#10B981' : '#EF4444' }}>
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {item.question.question}
                    </h4>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 shrink-0">
                    ⏱️ {item.timeTaken} dtk
                  </span>
                </div>

                <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500">Jawaban Siswa: </span>
                    <strong className={item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.selectedAnswer ? `Pilihan ${item.selectedAnswer}` : 'Waktu Habis'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Kunci Benar: </span>
                    <strong className="text-emerald-700">Pilihan {item.question.correctAnswer}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                  💡 <strong className="text-slate-700">Penjelasan:</strong> {item.question.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
