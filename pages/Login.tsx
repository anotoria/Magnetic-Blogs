import React, { useState } from 'react';
import { FlameIcon } from '../components/Icons';
import { UserProfile, Language } from '../types';
import { LANGUAGES } from '../constants';

interface LoginProps {
  onLogin: () => void;
  onRegister: (data: Pick<UserProfile, 'name' | 'email' | 'companyName'>) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  t: (key: string) => string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegister, currentLang, onLanguageChange, t }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
            alert(t('alert_pass_mismatch'));
            setIsLoading(false);
            return;
        }
        if (!formData.name || !formData.companyName) {
            alert(t('alert_fill_all'));
            setIsLoading(false);
            return;
        }
        onRegister({
            name: formData.name,
            email: formData.email,
            companyName: formData.companyName
        });
    } else {
        if(formData.email && formData.password) {
            onLogin();
        }
    }
    setIsLoading(false);
  };

  const toggleMode = () => {
      setIsRegistering(!isRegistering);
      setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: '',
          name: prev.name || '',
          companyName: prev.companyName || ''
      }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black bg-tech-grid relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mag-orange/20 rounded-full blur-[128px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mag-red/20 rounded-full blur-[128px] pointer-events-none animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <select 
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase rounded-full px-4 py-2 focus:ring-0 outline-none hover:bg-white hover:dark:bg-white/10 transition cursor-pointer"
        >
            {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="text-black">{lang.code}</option>
            ))}
        </select>
      </div>

      <div className="w-full max-w-md p-1 relative z-10 animate-fade-in-up">
        {/* Border Gradient Wrapper */}
        <div className="absolute inset-0 bg-gradient-to-br from-mag-orange via-transparent to-mag-red rounded-3xl opacity-50 blur-sm"></div>
        
        <div className="bg-white dark:bg-[#0F0F0F] rounded-3xl shadow-2xl relative overflow-hidden border border-gray-100 dark:border-white/10">
            <div className="p-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-mag-orange to-mag-red rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-mag-orange/30 mb-6 transform hover:rotate-3 transition duration-500">
                        <FlameIcon className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2 tracking-tight">
                        {isRegistering ? t('create_account') : t('welcome_back')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {isRegistering ? t('join_desc') : t('sign_in_desc')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegistering && (
                        <div className="space-y-5 animate-fade-in-down">
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">{t('full_name')}</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    placeholder={t('placeholder_name')}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-white/20"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">{t('company_business')}</label>
                                <input 
                                    type="text" 
                                    name="companyName"
                                    required
                                    placeholder={t('placeholder_company')}
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-white/20"
                                />
                            </div>
                        </div>
                    )}

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">{t('email_address')}</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-white/20"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">{t('password')}</label>
                        <input 
                            type="password" 
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-white/20"
                        />
                    </div>

                    {isRegistering && (
                        <div className="animate-fade-in-up group">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">{t('confirm_password')}</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                required
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-white/20"
                            />
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-mag-orange to-mag-red text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,69,0,0.3)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-8 uppercase tracking-wide text-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('processing')}
                            </span>
                        ) : (isRegistering ? t('create_account_btn') : t('sign_in_btn'))}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isRegistering ? `${t('already_have_account')} ` : `${t('dont_have_account')} `}
                    <button 
                        onClick={toggleMode}
                        className="text-mag-orange font-bold hover:text-mag-red hover:underline transition-colors focus:outline-none ml-1"
                    >
                        {isRegistering ? t('login_link') : t('register_now')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};