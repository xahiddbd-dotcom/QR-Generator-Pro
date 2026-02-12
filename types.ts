
export enum AppTab {
  CREATE = 'create',
  SCAN = 'scan',
  AI = 'ai',
  HISTORY = 'history',
  MORE = 'more',
  ADMIN = 'admin'
}

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';

export type QRType = 'text' | 'url' | 'vcard' | 'wifi' | 'email' | 'sms' | 'twitter' | 'facebook' | 'bitcoin' | 'file' | 'app' | 'barcode' | 'pdf' | 'mp3';

export interface QRHistoryItem {
  id: string;
  type: 'scanned' | 'generated';
  qrType: QRType;
  content: string;
  timestamp: number;
}

export interface AIAnalysis {
  isSafe: boolean;
  summary: string;
  category: string;
  suggestions: string[];
}

export interface VisualAnalysis {
  objects: string[];
  description: string;
  ocrText?: string;
  safetyRating: string;
}

export interface AppConfig {
  founder: {
    name: { bn: string; en: string };
    role: { bn: string; en: string };
    bio: { bn: string; en: string };
    image: string;
    stats: { label: { bn: string; en: string }; value: string }[];
  };
  donation: {
    title: { bn: string; en: string };
    methods: { name: string; detail: string; icon: string }[];
  };
  ads: {
    title: { bn: string; en: string };
    desc: { bn: string; en: string };
    icon: string;
    btn: { bn: string; en: string };
  }[];
}
