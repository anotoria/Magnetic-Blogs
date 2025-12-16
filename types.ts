export enum Language {
  PT_BR = 'pt-BR',
  EN = 'en',
  ES = 'es'
}

export enum SendingStatus {
  NOT_SENT = 'Not Sent',
  SENT = 'Sent',
  ERROR = 'Error',
  RESENT = 'Resent'
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  topic: string;
  language: Language;
  generatedAt: string;
  status: SendingStatus;
  sentAt?: string;
  selected?: boolean; 
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  companyBio?: string;
  socialLinks?: SocialLinks;
  webhookUrl: string;
  logoUrl?: string;
  avatarUrl?: string;
  language: Language;
  theme: 'light' | 'dark';
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface User {
  isAuthenticated: boolean;
  profile: UserProfile;
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'HISTORY' | 'SETTINGS' | 'PROFILE' | 'ADMIN';
