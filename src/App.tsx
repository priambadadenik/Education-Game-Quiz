import React, { useState } from 'react';
import { EducationLevel, DifficultyLevel, Question, QuizResult } from './types';
import { SAMPLE_QUESTIONS, DIFFICULTY_CONFIG } from './data/quizData';
import { Header } from './components/Header';
import { PreHomeSetup } from './components/PreHomeSetup';
import { HomeScreen } from './components/HomeScreen';
import { QuizGameplay } from './components/QuizGameplay';
import { ScoreScreen } from './components/ScoreScreen';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // App step flow:
  // 'setup': Sebelum masuk ke Home (isi nama, pilih jenjang, pilih mapel/jurusan)
  // 'home': Beranda utama (profil siswa, materi aktif, pilih tingkat kesulitan, aturan kuis, tombol mulai)
  // 'play': Sesi kuis 10 butir pertanyaan berwaktu
  // 'score': Hasil nilai, evaluasi, dan lembar pembahasan
  const [gameStep, setGameStep] = useState<'setup' | 'home' | 'play' | 'score'>('setup');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('SMK');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('smk-tkj');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Biasa');
  const [studentName, setStudentName] = useState<string>('Budi Pratama');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // 1. Handler ketika siswa menyelesaikan pengisian sebelum masuk ke Home
  const handleSetupComplete = (name: string, level: EducationLevel, subjectId: string) => {
    setStudentName(name);
    setSelectedLevel(level);
    setSelectedSubjectId(subjectId);
    setGameStep('home');
  };

  // 2. Handler untuk memulai kuis dari Home atau mengulang kuis dari ScoreScreen
  const handleStartQuiz = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);

    const targetTimeLimit = DIFFICULTY_CONFIG[difficulty]?.timeLimit || 15;

    // 1. Filter exact match: level, subject, and chosen difficulty
    const exactMatches = SAMPLE_QUESTIONS.filter(
      (q) => q.level === selectedLevel && q.subjectId === selectedSubjectId && q.difficulty === difficulty
    );

    // 2. Secondary pool: same subject, other difficulties
    const sameSubjectOtherDiff = SAMPLE_QUESTIONS.filter(
      (q) => q.level === selectedLevel && q.subjectId === selectedSubjectId && q.difficulty !== difficulty
    );

    // 3. Fallback: same level
    const sameLevelOtherSubject = SAMPLE_QUESTIONS.filter(
      (q) => q.level === selectedLevel && q.subjectId !== selectedSubjectId
    );

    // Shuffle each pool for variety
    const shuffledExact = shuffleArray(exactMatches);
    const shuffledSameSubj = shuffleArray(sameSubjectOtherDiff);
    const shuffledSameLvl = shuffleArray(sameLevelOtherSubject);

    // Combine prioritizing exact match
    const rawPool = [...shuffledExact, ...shuffledSameSubj, ...shuffledSameLvl];

    // Deduplicate by question ID and standardize timeLimit according to chosen difficulty
    const seen = new Set<number>();
    const preparedPool: Question[] = [];

    for (const q of rawPool) {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        preparedPool.push({
          ...q,
          timeLimit: targetTimeLimit,
        });
      }
    }

    // Fallback if empty (should never happen, but safe)
    const finalQuestions = (preparedPool.length > 0 ? preparedPool : SAMPLE_QUESTIONS).map((q) => ({
      ...q,
      timeLimit: targetTimeLimit,
    }));

    // Choose 10 questions per quiz session
    const questionLimit = Math.min(10, finalQuestions.length);
    setCurrentQuestions(finalQuestions.slice(0, questionLimit));
    setGameStep('play');
  };

  // Finish quiz handler
  const handleFinishQuiz = (result: QuizResult) => {
    setQuizResult(result);
    setGameStep('score');
  };

  // Kembali ke Home
  const handleGoHome = () => {
    setGameStep('home');
  };

  // Ganti Profil (kembali ke setup sebelum Home)
  const handleChangeProfile = () => {
    setGameStep('setup');
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* App Header with step awareness */}
      <Header
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        studentName={studentName}
        selectedLevel={selectedLevel}
        currentStep={gameStep}
        onGoHome={handleGoHome}
        onChangeProfile={handleChangeProfile}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Step 0: Sebelum masuk ke Home (Isi Nama, Pilih Jenjang, Pilih Mapel/Jurusan) */}
        {gameStep === 'setup' && (
          <PreHomeSetup
            initialName={studentName}
            initialLevel={selectedLevel}
            initialSubjectId={selectedSubjectId}
            onSubmitSetup={handleSetupComplete}
          />
        )}

        {/* Step 1: Beranda Home (Profil siswa aktif, materi, pilih tingkat kesulitan, & mulai kuis) */}
        {gameStep === 'home' && (
          <HomeScreen
            studentName={studentName}
            selectedLevel={selectedLevel}
            selectedSubjectId={selectedSubjectId}
            onChangeProfile={handleChangeProfile}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {/* Step 2: Sesi Pengerjaan Kuis Berwaktu */}
        {gameStep === 'play' && currentQuestions.length > 0 && (
          <QuizGameplay
            questions={currentQuestions}
            level={selectedLevel}
            subjectId={selectedSubjectId}
            studentName={studentName}
            difficulty={selectedDifficulty}
            onFinishQuiz={handleFinishQuiz}
            onQuitQuiz={handleGoHome}
          />
        )}

        {/* Step 3: Lembar Evaluasi Skor & Pembahasan */}
        {gameStep === 'score' && quizResult && (
          <ScoreScreen
            result={quizResult}
            studentName={studentName}
            onPlayAgain={() => handleStartQuiz(selectedDifficulty)}
            onBackToHome={handleGoHome}
            onChangeProfile={handleChangeProfile}
          />
        )}
      </main>

      {/* Clean Educational Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">EduQuiz Interaktif</span>
            <span>•</span>
            <span>Multi-Jenjang (SD, SMP, SMA, SMK Kejuruan Teknik & Bisnis)</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-emerald-600 font-semibold">🌱 Mudah (20s)</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">⚖️ Biasa (15s)</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">🔥 Sulit (10s)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
