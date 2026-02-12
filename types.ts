
export enum AppTab {
  CREATE = 'create',
  SCAN = 'scan',
  AI = 'ai',
  HISTORY = 'history',
  MORE = 'more'
}

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';

export type QRType = 'text' | 'url' | 'vcard' | 'wifi' | 'email' | 'sms' | 'twitter' | 'facebook' | 'bitcoin' | 'file' | 'app';

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
