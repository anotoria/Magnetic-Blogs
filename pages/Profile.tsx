import React, { useState } from 'react';
import { UserProfile, SocialLinks } from '../types';
import { UploadIcon, LockIcon, UserIcon, FlameIcon } from '../components/Icons';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  t: (key: string) => string;
}

type Tab = 'details' | 'security';

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, t }) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [formData, setFormData] = useState({
    name: user.name,
    companyName: user.companyName,
    companyBio: user.companyBio || '',
    phone: user.phone || '',
    email: user.email,
    socialLinks: {
        instagram: user.socialLinks?.instagram || '',
        facebook: user.socialLinks?.facebook || '',
        linkedin: user.socialLinks?.linkedin || '',
        youtube: user.socialLinks?.youtube || '',
        website: user.socialLinks?.website || '',
    } as SocialLinks
  });

  const [passwordData, setPasswordData] = useState({
      current: '',
      new: '',
      confirm: ''
  });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
    alert(t('profile_updated'));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(passwordData.new !== passwordData.confirm) {
          alert("Passwords do not match");
          return;
      }
      // Mock API call
      alert(t('pass_updated'));
      setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleFileUpload = (type: 'avatar' | 'logo') => {
      alert("Mock upload: File selected");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{t('profile_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your account, company details, and security preferences.</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveTab('details')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'details' ? 'bg-white dark:bg-mag-surface shadow text-mag-orange' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                {t('section_personal')}
            </button>
            <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-white dark:bg-mag-surface shadow text-mag-orange' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                {t('section_security')}
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visuals & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm relative overflow-hidden text-center">
                 <div className="relative inline-block group cursor-pointer mb-4" onClick={() => handleFileUpload('avatar')}>
                    <div className="w-32 h-32 rounded-full bg-gray-900 mx-auto flex items-center justify-center text-4xl font-bold text-white uppercase border-4 border-white dark:border-white/10 overflow-hidden relative">
                         {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : user.name.charAt(0)}
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                             <UploadIcon className="w-8 h-8 text-white" />
                         </div>
                    </div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
                 <div className="inline-block px-3 py-1 bg-mag-orange/10 text-mag-orange text-xs font-bold rounded-full uppercase tracking-wide">
                     {user.role || 'User'} Plan
                 </div>
            </div>

            <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                <h4 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider">{t('section_visuals')}</h4>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center mr-3">
                                <FlameIcon className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="text-sm font-medium">{t('label_logo')}</div>
                        </div>
                        <button onClick={() => handleFileUpload('logo')} className="text-xs font-bold text-mag-orange hover:underline">{t('btn_upload')}</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2">
            {activeTab === 'details' && (
                <form onSubmit={handleInfoSubmit} className="space-y-8 animate-fade-in">
                    {/* Personal & Company Info */}
                    <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-mag-orange" />
                            {t('section_personal')} & {t('section_company')}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('label_fullname')}</label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('label_phone')}</label>
                                <input 
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('label_company')}</label>
                                <input 
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('label_email')}</label>
                                <input 
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed select-none"
                                />
                            </div>
                            <div className="md:col-span-2 group">
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('label_bio')}</label>
                                <textarea 
                                    rows={3}
                                    value={formData.companyBio}
                                    onChange={(e) => setFormData({...formData, companyBio: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            {t('section_socials')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {['website', 'instagram', 'facebook', 'linkedin', 'youtube'].map((platform) => (
                                 <div key={platform} className="group">
                                     <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t(`social_${platform.substring(0,2) === 'we' ? 'site' : platform.substring(0,2)}`)}</label>
                                     <input 
                                         type="url"
                                         placeholder="https://..."
                                         value={(formData.socialLinks as any)[platform]}
                                         onChange={(e) => setFormData({
                                             ...formData, 
                                             socialLinks: { ...formData.socialLinks, [platform]: e.target.value }
                                         })}
                                         className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-orange focus:ring-1 focus:ring-mag-orange dark:text-white transition-all text-sm font-mono"
                                     />
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            {t('save_changes')}
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-sm animate-fade-in">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <LockIcon className="w-5 h-5 mr-2 text-mag-red" />
                        {t('section_security')}
                    </h3>

                    <div className="space-y-6 max-w-md">
                        <div className="group">
                            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('current_pass')}</label>
                            <input 
                                type="password"
                                required
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-red focus:ring-1 focus:ring-mag-red dark:text-white transition-all"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('new_pass')}</label>
                            <input 
                                type="password"
                                required
                                value={passwordData.new}
                                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-red focus:ring-1 focus:ring-mag-red dark:text-white transition-all"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t('confirm_new_pass')}</label>
                            <input 
                                type="password"
                                required
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-mag-red focus:ring-1 focus:ring-mag-red dark:text-white transition-all"
                            />
                        </div>

                        <div className="pt-4">
                             <button type="submit" className="bg-mag-red text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-mag-red/20 hover:-translate-y-0.5 transition-all duration-300">
                                {t('btn_update_pass')}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};