import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, t }) => {
  const [webhook, setWebhook] = useState(user.webhookUrl);
  const [blogUrl, setBlogUrl] = useState(user.blogUrl || '');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; msg: string} | null>(null);

  const handleSave = () => {
    onUpdateUser({ ...user, webhookUrl: webhook, blogUrl: blogUrl });
    alert(t('settings_saved'));
  };

  const handleTest = async () => {
    if (!webhook) return;
    setIsTestLoading(true);
    setTestResult(null);
    try {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ test: true, msg: "Magnetic Blogs Connection Check" })
        });
        
        if (response.ok) {
            setTestResult({ success: true, msg: t('test_success') });
        } else {
            setTestResult({ success: false, msg: t('test_fail', { status: response.status }) });
        }
    } catch (e: any) {
        setTestResult({ success: false, msg: t('test_error', { error: e.message }) });
    } finally {
        setIsTestLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{t('integrations_title')}</h2>
        <p className="text-gray-500 dark:text-gray-400">Connect your workspace with external tools and automations.</p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-8 shadow-lg relative overflow-hidden group">
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mag-orange/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                    <div className="w-10 h-10 rounded-xl bg-[#EA4B71] flex items-center justify-center text-white text-xs font-bold mr-4 shadow-lg shadow-[#EA4B71]/20">
                        n8n
                    </div>
                    <div>
                        {t('webhook_title')}
                        <div className="text-xs font-normal text-gray-500 mt-0.5">Automate your content pipeline</div>
                    </div>
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
                    {t('webhook_desc')}
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">{t('webhook_label')}</label>
                        <div className="relative">
                            <input
                                type="url"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-mag-orange/50 focus:border-mag-orange text-gray-900 dark:text-white transition-all font-mono text-sm placeholder-gray-400"
                                placeholder="https://your-n8n-instance.com/webhook/..."
                                value={webhook}
                                onChange={(e) => setWebhook(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className={`flex h-2 w-2 rounded-full ${webhook ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                            </div>
                        </div>
                    </div>

                    {testResult && (
                        <div className={`p-4 rounded-xl text-sm border flex items-start animate-fade-in-up ${testResult.success ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'}`}>
                            <span className="mr-2 text-lg">{testResult.success ? '✅' : '❌'}</span>
                            <span className="mt-0.5">{testResult.msg}</span>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button
                            onClick={handleSave}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {t('save_config')}
                        </button>
                        <button
                            onClick={handleTest}
                            disabled={!webhook || isTestLoading}
                            className="text-gray-600 dark:text-gray-300 hover:text-mag-orange dark:hover:text-mag-orange hover:bg-gray-50 dark:hover:bg-white/5 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
                        >
                            {isTestLoading ? t('testing') : t('test_connection')}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 p-8 shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-4 shadow-lg shadow-blue-500/20">
                        Blog
                    </div>
                    <div>
                        {t('blog_title')}
                        <div className="text-xs font-normal text-gray-500 mt-0.5">{t('blog_subtitle')}</div>
                    </div>
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
                    {t('blog_desc')}
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">{t('blog_url_label')}</label>
                        <div className="relative">
                            <input
                                type="url"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white transition-all font-mono text-sm placeholder-gray-400"
                                placeholder={t('blog_url_placeholder')}
                                value={blogUrl}
                                onChange={(e) => setBlogUrl(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className={`flex h-2 w-2 rounded-full ${blogUrl ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button
                            onClick={handleSave}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {t('save_config')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
