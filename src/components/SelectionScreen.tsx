import React, { useState } from 'react';
import { EducationLevel, DifficultyLevel } from '../types';
import { LEVEL_METADATA, SUBJECTS_BY_LEVEL, DIFFICULTY_CONFIG, SAMPLE_QUESTIONS } from '../data/quizData';
import { Sparkles, Timer, Award, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SelectionScreenProps {
  onStartGame: (
    level: EducationLevel,
    subjectId: string,
    studentName: string,
    difficulty: DifficultyLevel
  ) => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onStartGame }) => {
  const [studentName, setStudentName] = useState('Budi Pratama');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('SMK');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('smk-tkj');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Biasa');

  const availableSubjects = SUBJECTS_BY_LEVEL[selectedLevel] || [];
  const currentSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];
  const difficultyCfg = DIFFICULTY_CONFIG[selectedDifficulty];

  const handleLevelSelect = (level: EducationLevel) => {
    setSelectedLevel(level);
    soundEngine.playTick();
    const subs = SUBJECTS_BY_LEVEL[level];
    if (subs && subs.length > 0) {
      setSelectedSubjectId(subs[0].id);
    }
  };

  const handleSubjectSelect = (subjId: string) => {
    setSelectedSubjectId(subjId);
    soundEngine.playTick();
  };

  const handleDifficultySelect = (diff: DifficultyLevel) => {
    setSelectedDifficulty(diff);
    soundEngine.playTick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !selectedLevel || !selectedSubjectId || !selectedDifficulty) return;
    soundEngine.playCorrect();
    onStartGame(selectedLevel, selectedSubjectId, studentName.trim(), selectedDifficulty);
  };

  // Calculate question count for this subject and difficulty
  const exactMatchCount = SAMPLE_QUESTIONS.filter(
    (q) => q.level === selectedLevel && q.subjectId === selectedSubjectId && q.difficulty === selectedDifficulty
  ).length;

  const totalSubjectQuestions = SAMPLE_QUESTIONS.filter(
    (q) => q.level === selectedLevel && q.subjectId === selectedSubjectId
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>Platform Game Edukasi Interaktif Multi-Jenjang</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pilih Jenjang & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Mulai Kuis Seru!</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Uji kemampuan dengan kuis interaktif berwaktu. Lengkap untuk SD, SMP, SMA, serta kejuruan SMK (TKJ & RPL terpisah) dengan pilihan tingkat kemudahan.
        </p>
      </div>

      {/* Main Selection Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8"
      >
        {/* Section 1: Student Name Input */}
        <div>
          <label htmlFor="student-name-input" className="block text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">1</span>
              <span>Nama Lengkap Siswa</span>
            </span>
            <span className="text-xs font-normal text-slate-400">Tercetak pada sertifikat kelulusan kuis</span>
          </label>
          <div className="relative">
            <input
              id="student-name-input"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ketik nama kamu di sini..."
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 font-semibold placeholder-slate-400 text-sm sm:text-base outline-none"
            />
            <GraduationCap className="w-5 h-5 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Section 2: Education Level Selector Cards */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">2</span>
            <span>Pilih Jenjang Pendidikan</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {(['SD', 'SMP', 'SMA', 'SMK'] as EducationLevel[]).map((lvl) => {
              const meta = LEVEL_METADATA[lvl];
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  id={`level-btn-${lvl.toLowerCase()}`}
                  onClick={() => handleLevelSelect(lvl)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20 scale-[1.02]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                    </div>
                  )}
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                    {meta.icon}
                  </span>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-lg text-slate-900 block">{meta.name}</span>
                    <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                      {lvl === 'SD' ? 'Kelas 1-6' : lvl === 'SMP' ? 'Kelas 7-9' : lvl === 'SMA' ? 'Kelas 10-12' : 'Vokasi Keahlian'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2.5 px-1 italic">
            💡 {LEVEL_METADATA[selectedLevel].description}
          </p>
        </div>

        {/* Section 3: Dynamic Subject Cards for Selected Level (TKJ and RPL are separated in SMK) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">3</span>
              <span>Pilih Mata Pelajaran ({selectedLevel})</span>
            </label>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {availableSubjects.length} Pilihan Mapel
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {availableSubjects.map((subject) => {
              const isSelected = selectedSubjectId === subject.id;
              const smkBadge = selectedLevel === 'SMK' ? {
                'smk-tkj': { label: 'Teknik Jaringan', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
                'smk-rpl': { label: 'Software Eng.', bg: 'bg-violet-100 text-violet-800 border-violet-200' },
                'smk-otomotif': { label: 'Otomotif (TKRO)', bg: 'bg-rose-100 text-rose-800 border-rose-200' },
                'smk-pemesinan': { label: 'Teknik Mesin', bg: 'bg-slate-200 text-slate-800 border-slate-300' },
                'smk-listrik': { label: 'Tenaga Listrik', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
                'smk-elektro': { label: 'Elektronika', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
                'smk-bangunan': { label: 'Konstruksi & BIM', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
                'smk-bisnis': { label: 'Akuntansi', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
              }[subject.id] : null;

              return (
                <button
                  key={subject.id}
                  type="button"
                  id={`subject-card-${subject.id}`}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 group relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl p-2 bg-slate-100/80 rounded-xl group-hover:scale-105 transition-transform">
                      {subject.icon}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {smkBadge && (
                        <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${smkBadge.bg}`}>
                          {smkBadge.label}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full">
                          Dipilih
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors">
                      {subject.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Difficulty Selector (Mudah, Biasa, Sulit) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">4</span>
              <span>Pilih Tingkat Kemudahan</span>
            </label>
            <span className="text-xs font-semibold text-slate-500">
              Waktu countdown menyesuaikan kesulitan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['Mudah', 'Biasa', 'Sulit'] as DifficultyLevel[]).map((diffKey) => {
              const cfg = DIFFICULTY_CONFIG[diffKey];
              const isSelected = selectedDifficulty === diffKey;

              return (
                <button
                  key={diffKey}
                  type="button"
                  id={`difficulty-btn-${diffKey.toLowerCase()}`}
                  onClick={() => handleDifficultySelect(diffKey)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                    isSelected
                      ? `${cfg.activeBorder} shadow-sm`
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cfg.icon}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                          {cfg.label}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {cfg.tagline}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cfg.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Timer className="w-3.5 h-3.5" />
                      {cfg.timeLimit}s / soal
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${cfg.pillBg}`}>
                      {SAMPLE_QUESTIONS.filter((q) => q.level === selectedLevel && q.subjectId === selectedSubjectId && q.difficulty === diffKey).length} Soal
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative Highlights */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Timer className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">Timer Countdown Dinamis</span>
              <span className="text-amber-800 text-[11px]">
                {difficultyCfg.timeLimit} detik per soal (Tingkat {selectedDifficulty})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">10 Soal per Sesi Kuis</span>
              <span className="text-amber-800 text-[11px]">Skor 0 - 100 & Evaluasi Jawaban</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">Pembahasan Lengkap</span>
              <span className="text-amber-800 text-[11px]">Koreksi instan tiap selesai jawab</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          id="btn-start-game"
          disabled={!studentName.trim() || !selectedSubjectId}
          className="w-full py-4 px-6 rounded-2xl font-black text-white text-base sm:text-lg tracking-wide shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            Mulai Kuis {currentSubject?.name || 'Mapel'} ({selectedDifficulty} • {difficultyCfg.timeLimit}s)
          </span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </form>
    </div>
  );
};
