import React, { useState } from 'react';
import { EducationLevel } from '../types';
import { LEVEL_METADATA, SUBJECTS_BY_LEVEL } from '../data/quizData';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  BookOpen, 
  School
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PreHomeSetupProps {
  initialName?: string;
  initialLevel?: EducationLevel;
  initialSubjectId?: string;
  onSubmitSetup: (name: string, level: EducationLevel, subjectId: string) => void;
}

export const PreHomeSetup: React.FC<PreHomeSetupProps> = ({
  initialName = 'Budi Pratama',
  initialLevel = 'SMK',
  initialSubjectId = 'smk-tkj',
  onSubmitSetup,
}) => {
  const [studentName, setStudentName] = useState<string>(initialName);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(initialLevel);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [nameError, setNameError] = useState<string>('');

  const availableSubjects = SUBJECTS_BY_LEVEL[selectedLevel] || [];
  const currentSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];

  const handleLevelChange = (lvl: EducationLevel) => {
    setSelectedLevel(lvl);
    soundEngine.playTick();
    const newSubjects = SUBJECTS_BY_LEVEL[lvl];
    if (newSubjects && newSubjects.length > 0) {
      setSelectedSubjectId(newSubjects[0].id);
    }
  };

  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId);
    soundEngine.playTick();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = studentName.trim();
    if (!cleanName) {
      setNameError('Mohon isi nama lengkap siswa terlebih dahulu');
      return;
    }
    setNameError('');
    soundEngine.playCorrect();
    onSubmitSetup(cleanName, selectedLevel, selectedSubjectId || (availableSubjects[0]?.id ?? ''));
  };

  return (
    <div className="max-w-3xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Onboarding Welcome Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>Langkah Awal Pembelajaran EduQuiz</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Lengkapi Profil <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Sebelum Masuk Home</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Isi nama siswa, tentukan jenjang sekolah, dan pilih mata pelajaran atau jurusan kejuruan untuk menyiapkan ruang belajar di beranda.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 max-w-xl mx-auto text-xs">
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
          <span>Isi Nama</span>
        </div>
        <span className="text-slate-300 font-bold">——</span>
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
          <span>Pilih Jenjang</span>
        </div>
        <span className="text-slate-300 font-bold">——</span>
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
          <span>Pilih Mapel/Jurusan</span>
        </div>
      </div>

      {/* Main Setup Card Form */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-7"
      >
        {/* Step 1: Student Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="student-name-setup" className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">1</span>
              <span>Nama Lengkap Siswa</span>
            </label>
            <span className="text-xs text-slate-400">Wajib diisi</span>
          </div>
          <div className="relative">
            <input
              id="student-name-setup"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="Contoh: Budi Pratama..."
              required
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-slate-900 font-semibold placeholder-slate-400 text-sm sm:text-base outline-none transition-all ${
                nameError 
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-3 focus:ring-rose-200' 
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/20'
              }`}
            />
            <User className="w-5 h-5 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {nameError && (
            <p className="text-xs font-semibold text-rose-600 px-1">{nameError}</p>
          )}
          <p className="text-xs text-slate-500 px-1">
            Nama ini akan ditampilkan di sambutan Beranda dan lembar evaluasi hasil kuis.
          </p>
        </div>

        {/* Step 2: Education Level */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">2</span>
              <span>Pilih Jenjang Pendidikan</span>
            </label>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Tingkat: {selectedLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['SD', 'SMP', 'SMA', 'SMK'] as EducationLevel[]).map((lvl) => {
              const meta = LEVEL_METADATA[lvl];
              const isSelected = selectedLevel === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  id={`setup-level-btn-${lvl.toLowerCase()}`}
                  onClick={() => handleLevelChange(lvl)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20 scale-[1.02]'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                    </div>
                  )}
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {meta.icon}
                  </span>
                  <div>
                    <span className="font-extrabold text-base text-slate-900 block">{meta.name}</span>
                    <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                      {lvl === 'SD' ? 'Kelas 1-6' : lvl === 'SMP' ? 'Kelas 7-9' : lvl === 'SMA' ? 'Kelas 10-12' : 'Vokasi Keahlian'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 px-1 italic">
            💡 {LEVEL_METADATA[selectedLevel].description}
          </p>
        </div>

        {/* Step 3: Subject or Major Selection */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">3</span>
              <span>
                {selectedLevel === 'SMK' ? 'Pilih Jurusan Kejuruan' : `Pilih Mata Pelajaran (${selectedLevel})`}
              </span>
            </label>
            <span className="text-xs font-semibold text-slate-500">
              {availableSubjects.length} Pilihan Tersedia
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
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
                  id={`setup-subject-${subject.id}`}
                  onClick={() => handleSubjectChange(subject.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl p-2 bg-slate-100 rounded-xl group-hover:scale-105 transition-transform">
                      {subject.icon}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {smkBadge && (
                        <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${smkBadge.bg}`}>
                          {smkBadge.label}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
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

        {/* Submit to Enter Home */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <button
            type="submit"
            id="btn-enter-home"
            disabled={!studentName.trim() || !selectedSubjectId}
            className="w-full py-4 px-6 rounded-2xl font-black text-white text-base sm:text-lg tracking-wide shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Masuk ke Beranda (Home)</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium text-center">
            <School className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Profil aktif: <strong>{studentName.trim() || 'Siswa'}</strong> • Jenjang {selectedLevel} ({currentSubject?.name || 'Pelajaran'})
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
