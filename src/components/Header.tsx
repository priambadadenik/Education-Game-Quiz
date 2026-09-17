import React from 'react';
import { Volume2, VolumeX, Sparkles, Home, UserCog } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { EducationLevel } from '../types';

interface HeaderProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  studentName?: string;
  selectedLevel?: EducationLevel;
  currentStep?: 'setup' | 'home' | 'play' | 'score';
  onGoHome?: () => void;
  onChangeProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  setSoundEnabled,
  studentName,
  selectedLevel,
  currentStep = 'setup',
  onGoHome,
  onChangeProfile,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    if (next) {
      soundEngine.playCorrect();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div 
          onClick={currentStep !== 'setup' ? onGoHome : undefined}
          className={`flex items-center gap-3 select-none group ${currentStep !== 'setup' ? 'cursor-pointer' : ''}`}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform flex items-center justify-center bg-indigo-600">
            <img src="/favicon.svg" alt="EduQuiz Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
                EduQuiz <span className="text-indigo-600">Interaktif</span>
              </h1>
              <span className="hidden md:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Multi-Jenjang
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              SD • SMP • SMA • SMK (Teknik & Bisnis) | Kuis Berwaktu
            </p>
          </div>
        </div>

        {/* Center: Student Badge if already in Home / Quiz */}
        {currentStep !== 'setup' && studentName && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200 text-xs font-semibold text-indigo-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[140px] font-bold">{studentName}</span>
            {selectedLevel && (
              <span className="px-1.5 py-0.2 bg-white text-indigo-700 rounded text-[10px] font-extrabold border border-indigo-200">
                {selectedLevel}
              </span>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentStep === 'play' && onGoHome && (
            <button
              onClick={onGoHome}
              title="Kembali ke Beranda"
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer text-xs font-bold flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Beranda</span>
            </button>
          )}

          {currentStep !== 'setup' && onChangeProfile && (
            <button
              onClick={onChangeProfile}
              id="btn-header-change-profile"
              title="Ganti Nama, Jenjang, atau Mapel"
              className="px-3 py-1.5 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer text-xs font-bold flex items-center gap-1.5"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ganti Jenjang</span>
            </button>
          )}

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                : 'text-slate-400 bg-slate-50 border-slate-200 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

