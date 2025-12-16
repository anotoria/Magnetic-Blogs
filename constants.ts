import { Language, UserProfile } from './types';

export const DEFAULT_WEBHOOK_URL = '';

export const MOCK_USER: UserProfile = {
  id: 'usr_123',
  name: 'Alex Developer',
  email: 'alex@magneticblogs.com',
  phone: '+1 555 0199',
  companyName: 'TechNova',
  companyBio: 'Innovating the future of content generation.',
  webhookUrl: '',
  language: Language.PT_BR,
  theme: 'dark',
  role: 'admin', // Set as admin for demonstration
  isActive: true,
  socialLinks: {
    website: 'https://technova.io',
    twitter: '@technova'
  } as any
};

export const INITIAL_IDEAS = [];

export const LANGUAGES = [
  { code: Language.PT_BR, label: 'Português (BR)' },
  { code: Language.EN, label: 'English' },
  { code: Language.ES, label: 'Español' }
];
