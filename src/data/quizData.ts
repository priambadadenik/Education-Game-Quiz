import { EducationLevel, DifficultyLevel, Question, SubjectOption } from '../types';
import { SD_QUESTIONS } from './questions/sdQuestions';
import { SMP_QUESTIONS } from './questions/smpQuestions';
import { SMA_QUESTIONS } from './questions/smaQuestions';
import { SMK_QUESTIONS } from './questions/smkQuestions';

export const LEVEL_METADATA: Record<
  EducationLevel,
  {
    name: string;
    fullName: string;
    icon: string;
    badge: string;
    themeColor: string;
    accentBg: string;
    borderColor: string;
    description: string;
  }
> = {
  SD: {
    name: 'SD',
    fullName: 'Sekolah Dasar (Kelas 1 - 6)',
    icon: '🎒',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    themeColor: 'amber',
    accentBg: 'bg-amber-500',
    borderColor: 'border-amber-400',
    description: 'Konsep dasar angka, sains alam sekitar, dan tata bahasa sederhana yang menyenangkan.',
  },
  SMP: {
    name: 'SMP',
    fullName: 'Sekolah Menengah Pertama (Kelas 7 - 9)',
    icon: '📘',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    themeColor: 'emerald',
    accentBg: 'bg-emerald-500',
    borderColor: 'border-emerald-400',
    description: 'Pemahaman sains terpadu, aljabar, bahasa, serta eksplorasi sosial budaya.',
  },
  SMA: {
    name: 'SMA',
    fullName: 'Sekolah Menengah Atas (Kelas 10 - 12)',
    icon: '🔬',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    themeColor: 'indigo',
    accentBg: 'bg-indigo-500',
    borderColor: 'border-indigo-400',
    description: 'Analisis mendalam matematika, fisika, sejarah peradaban, dan literasi analitis.',
  },
  SMK: {
    name: 'SMK',
    fullName: 'Sekolah Menengah Kejuruan (Vokasi)',
    icon: '⚙️',
    badge: 'bg-violet-100 text-violet-800 border-violet-300',
    themeColor: 'violet',
    accentBg: 'bg-violet-500',
    borderColor: 'border-violet-400',
    description: 'Kompetensi kejuruan teknik & vokasi: TKJ, RPL, Teknik Otomotif (TKRO), Pemesinan (TP), Tenaga Listrik (TITL), Elektronika, Konstruksi Bangunan (DPIB), dan Akuntansi.',
  },
};

export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  {
    key: DifficultyLevel;
    label: string;
    tagline: string;
    description: string;
    timeLimit: number;
    icon: string;
    badgeBg: string;
    activeBorder: string;
    pillBg: string;
    accentColor: string;
  }
> = {
  Mudah: {
    key: 'Mudah',
    label: 'Mudah',
    tagline: 'Dasar & Santai',
    description: 'Konsep dasar pemula, waktu berpikir santai (20 detik per soal).',
    timeLimit: 20,
    icon: '🌱',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    activeBorder: 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20',
    pillBg: 'bg-emerald-100 text-emerald-800',
    accentColor: 'text-emerald-600',
  },
  Biasa: {
    key: 'Biasa',
    label: 'Biasa',
    tagline: 'Standar & Seimbang',
    description: 'Tingkat kesulitan reguler sesuai kurikulum sekolah (15 detik per soal).',
    timeLimit: 15,
    icon: '⚖️',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-300',
    activeBorder: 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20',
    pillBg: 'bg-blue-100 text-blue-800',
    accentColor: 'text-blue-600',
  },
  Sulit: {
    key: 'Sulit',
    label: 'Sulit',
    tagline: 'Tantangan & Cepat',
    description: 'Studi kasus & analisa mendalam dengan timer kilat (10 detik per soal).',
    timeLimit: 10,
    icon: '🔥',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-300',
    activeBorder: 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20',
    pillBg: 'bg-rose-100 text-rose-800',
    accentColor: 'text-rose-600',
  },
};

export const SUBJECTS_BY_LEVEL: Record<EducationLevel, SubjectOption[]> = {
  SD: [
    {
      id: 'sd-mtk',
      name: 'Matematika Seru',
      icon: '📐',
      description: 'Penjumlahan, perkalian, pecahan, bangun datar, dan keliling.',
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'sd-ipa',
      name: 'Sains & Alam (IPA)',
      icon: '🌱',
      description: 'Daur hidup hewan, bagian tumbuhan, dan wujud benda di sekitar kita.',
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'sd-indo',
      name: 'Bahasa Indonesia Ceria',
      icon: '📖',
      description: 'Kosakata baku, sinonim, antonim, kalimat efektif, dan cerita.',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200',
    },
  ],
  SMP: [
    {
      id: 'smp-mtk',
      name: 'Matematika Aljabar',
      icon: '➗',
      description: 'Persamaan linear, pola bilangan, teorema Pythagoras, dan statistika.',
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'smp-ipa',
      name: 'IPA Terpadu',
      icon: '🧪',
      description: 'Sistem peredaran darah, fotosintesis, gaya, gerak, dan zat aditif.',
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 border-teal-200',
    },
    {
      id: 'smp-inggris',
      name: 'English for Beginners',
      icon: '🇬🇧',
      description: 'Daily conversation, tenses, grammar essentials, and vocabulary.',
      color: 'text-sky-600',
      badgeBg: 'bg-sky-50 border-sky-200',
    },
    {
      id: 'smp-ips',
      name: 'Ilmu Pengetahuan Sosial',
      icon: '🌏',
      description: 'Geografi Nusantara, interaksi sosial, ekonomi pasar, dan sejarah.',
      color: 'text-orange-600',
      badgeBg: 'bg-orange-50 border-orange-200',
    },
  ],
  SMA: [
    {
      id: 'sma-mtk',
      name: 'Matematika Lanjut',
      icon: '📈',
      description: 'Trigonometri, turunan kalkulus, integral, logaritma, dan matriks.',
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 border-indigo-200',
    },
    {
      id: 'sma-sains',
      name: 'Fisika & Kimia Fundamental',
      icon: '⚡',
      description: 'Hukum Newton, termodinamika, tabel periodik, dan ikatan kimia.',
      color: 'text-cyan-600',
      badgeBg: 'bg-cyan-50 border-cyan-200',
    },
    {
      id: 'sma-sejarah',
      name: 'Sejarah Nasional & Dunia',
      icon: '🏛️',
      description: 'Proklamasi kemerdekaan, diplomasi bangsa, dan peradaban dunia modern.',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-200',
    },
  ],
  SMK: [
    {
      id: 'smk-tkj',
      name: 'Teknik Komputer & Jaringan (TKJ)',
      icon: '🌐',
      description: 'Arsitektur TCP/IP, subnetting IP, router Mikrotik/Cisco, server Linux, & pengkabelan.',
      color: 'text-cyan-600',
      badgeBg: 'bg-cyan-50 border-cyan-200',
    },
    {
      id: 'smk-rpl',
      name: 'Rekayasa Perangkat Lunak (RPL)',
      icon: '💻',
      description: 'Pemrograman web modern, basis data relational SQL, OOP, REST API, & arsitektur MVC.',
      color: 'text-violet-600',
      badgeBg: 'bg-violet-50 border-violet-200',
    },
    {
      id: 'smk-otomotif',
      name: 'Teknik Kendaraan Ringan Otomotif (TKRO)',
      icon: '🚗',
      description: 'Sistem mesin 4-tak, injeksi bahan bakar EFI, transmisi, rem ABS, & kelistrikan bodi.',
      color: 'text-rose-600',
      badgeBg: 'bg-rose-50 border-rose-200',
    },
    {
      id: 'smk-pemesinan',
      name: 'Teknik Pemesinan (TP)',
      icon: '⚙️',
      description: 'Mesin bubut, mesin frais (milling), mikrometer presisi, toleransi geometris, & kode CNC.',
      color: 'text-slate-700',
      badgeBg: 'bg-slate-100 border-slate-300',
    },
    {
      id: 'smk-listrik',
      name: 'Teknik Instalasi Tenaga Listrik (TITL)',
      icon: '⚡',
      description: 'Instalasi penerangan gedung, pengaman MCB/ELCB, motor 3 fasa Star-Delta, & kontaktor.',
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'smk-elektro',
      name: 'Dasar Teknik Elektronika',
      icon: '🔌',
      description: 'Hukum Ohm, resistor, kapasitor, multitester, semikonduktor, dan sirkuit listrik.',
      color: 'text-orange-600',
      badgeBg: 'bg-orange-50 border-orange-200',
    },
    {
      id: 'smk-bangunan',
      name: 'Desain Pemodelan & Informasi Bangunan (DPIB)',
      icon: '📐',
      description: 'Gambar teknik AutoCAD/BIM, beton bertulang, struktur pondasi, elevasi waterpass, & RAB.',
      color: 'text-blue-700',
      badgeBg: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'smk-bisnis',
      name: 'Akuntansi & Keuangan',
      icon: '📊',
      description: 'Persamaan dasar akuntansi, jurnal umum, neraca saldo, dan laporan laba rugi.',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200',
    },
  ],
};

// Gabungan seluruh bank soal terstruktur berdasarkan mata pelajaran dan jurusan vokasi
export const SAMPLE_QUESTIONS: Question[] = [
  ...SD_QUESTIONS,
  ...SMP_QUESTIONS,
  ...SMA_QUESTIONS,
  ...SMK_QUESTIONS,
];
