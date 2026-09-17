import React, { useState } from 'react';
import { EducationLevel, DifficultyLevel } from '../types';
import { LEVEL_METADATA, SUBJECTS_BY_LEVEL, DIFFICULTY_CONFIG, SAMPLE_QUESTIONS } from '../data/quizData';
import { 
  Sparkles, 
  Timer, 
  Award, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  BookOpen, 
  HelpCircle,
  GraduationCap,
  ChevronRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HomeScreenProps {
  studentName: string;
  selectedLevel: EducationLevel;
  selectedSubjectId: string;
  onChangeProfile: () => void;
  onStartQuiz: (difficulty: DifficultyLevel) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  studentName,
  selectedLevel,
  selectedSubjectId,
  onChangeProfile,
  onStartQuiz,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Biasa');

  const levelMeta = LEVEL_METADATA[selectedLevel];
  const availableSubjects = SUBJECTS_BY_LEVEL[selectedLevel] || [];
  const currentSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];
  const difficultyCfg = DIFFICULTY_CONFIG[selectedDifficulty];

  const totalSubjectQuestions = SAMPLE_QUESTIONS.filter(
    (q) => q.level === selectedLevel && q.subjectId === selectedSubjectId
  ).length;

  const handleDifficultyClick = (diff: DifficultyLevel) => {
    setSelectedDifficulty(diff);
    soundEngine.playTick();
  };

  const handleStart = () => {
    soundEngine.playCorrect();
    onStartQuiz(selectedDifficulty);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Personalized Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-indigo-200 relative overflow-hidden">
        {/* Background decorative graphic */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white backdrop-blur-xs border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Beranda Kuis Interaktif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Halo, <span className="text-amber-300">{studentName}</span>! 👋
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Ruang belajar kuis berwaktumu sudah siap. Pelajari materi mata pelajaran atau jurusanmu, pilih tingkat kesulitan, dan raih nilai tertinggi!
            </p>
          </div>

          {/* Quick Profile Switcher Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={onChangeProfile}
              id="btn-change-profile-home"
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>Ganti Jenjang & Mapel</span>
            </button>
            <div className="text-center md:text-right text-[11px] text-indigo-200 font-medium">
              Tingkat: <span className="font-bold text-white">{selectedLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Home Hub Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column: Active Subject Overview Card */}
        <div className="md:col-span-1 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Materi Dipilih
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Jenjang {selectedLevel}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                {currentSubject?.icon || '📚'}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-snug">
                  {currentSubject?.name || 'Mata Pelajaran'}
                </h3>
                <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                  {selectedLevel === 'SMK' ? 'Kompetensi Kejuruan' : levelMeta.name}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {currentSubject?.description || 'Bank soal interaktif sesuai kurikulum nasional.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Bank Soal Siap
              </span>
              <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                {totalSubjectQuestions} Soal
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                Soal per Sesi
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                10 Butir
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Difficulty Selector & Rules */}
        <div className="md:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span>Pilih Tingkat Kesulitan</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Mode Kuis
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap tingkat memiliki batas waktu hitung mundur yang berbeda.
                </p>
              </div>
            </div>

            {/* 3 Difficulty Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Mudah', 'Biasa', 'Sulit'] as DifficultyLevel[]).map((diffKey) => {
                const cfg = DIFFICULTY_CONFIG[diffKey];
                const isSelected = selectedDifficulty === diffKey;

                return (
                  <button
                    key={diffKey}
                    type="button"
                    id={`home-diff-btn-${diffKey.toLowerCase()}`}
                    onClick={() => handleDifficultyClick(diffKey)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative group ${
                      isSelected
                        ? `${cfg.activeBorder} shadow-xs scale-[1.01]`
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {cfg.icon}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                        {cfg.label}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                        {cfg.tagline}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Timer className="w-3.5 h-3.5 text-indigo-600" />
                        {cfg.timeLimit}s / soal
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-700 font-medium">10 Soal Terpilih Acak</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-700 font-medium">Countdown {difficultyCfg.timeLimit}s / Soal</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-700 font-medium">Skor 0-100 + Pembahasan</span>
            </div>
          </div>

          {/* Main Action Launch Button */}
          <button
            onClick={handleStart}
            id="btn-start-quiz-home"
            className="w-full py-4 px-6 rounded-2xl font-black text-white text-base sm:text-lg tracking-wide shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-3 cursor-pointer bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Mulai Kuis 10 Soal Sekarang</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Quick Education Guidance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
            💡
          </div>
          <div>
            <strong className="font-bold block text-sm text-indigo-900">Petunjuk Pengerjaan Kuis:</strong>
            <span className="text-indigo-800">
              Pilih satu opsi jawaban (A, B, C, atau D) sebelum waktu timer habis. Setiap jawaban benar akan otomatis menambah skor akhirmu!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
