export type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'SMK';

export type DifficultyLevel = 'Mudah' | 'Biasa' | 'Sulit';

export interface SubjectOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  badgeBg: string;
}

export interface Question {
  id: number;
  level: EducationLevel;
  subjectId: string;
  subjectName: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  timeLimit: number; // in seconds
  difficulty: DifficultyLevel;
}

export interface QuizResult {
  level: EducationLevel;
  subjectId: string;
  subjectName: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number; // 0 - 100
  timeSpentSeconds: number;
  history: {
    question: Question;
    selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  completedAt: string;
}

export interface LaravelCodeSnippet {
  id: string;
  fileName: string;
  filePath: string;
  language: string;
  description: string;
  code: string;
}
