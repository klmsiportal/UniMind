export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 string
  isThinking?: boolean;
  timestamp: number;
}

export interface University {
  name: string;
  description: string;
  location?: string;
  website?: string;
}

export enum SolveMode {
  FAST = 'fast',
  DEEP = 'deep'
}

export interface SearchResult {
  title: string;
  url: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
}