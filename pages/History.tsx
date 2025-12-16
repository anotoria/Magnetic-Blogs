import React, { useState } from 'react';
import { Idea, SendingStatus, UserProfile } from '../types';
import { sendToWebhook } from '../services/webhookService';

interface HistoryProps {
  ideas: Idea[];
  user: UserProfile;
  onUpdateIdea: (updatedIdea: Idea) => void;
  t: (key: string) => string;
}

export const History: React.FC<HistoryProps> = ({ ideas, user, onUpdateIdea, t }) => {
  const [filterTopic, setFilterTopic] = useState('');
  const [resendingId, setResendingId] = useState<string | null>(null);

  const filteredIdeas = ideas
    .filter(idea => idea.status !== SendingStatus.NOT_SENT) 
    .filter(idea => idea.topic.toLowerCase().includes(filterTopic.toLowerCase()) || idea.title.toLowerCase().includes(filterTopic.toLowerCase()))
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  const handleResend = async (idea: Idea) => {
    setResendingId(idea.id);
    try {
      await sendToWebhook([idea], user);
      onUpdateIdea({
        ...idea,
        status: SendingStatus.RESENT,
        sentAt: new Date().toISOString()
      });
      alert(t('resend_success'));
    } catch (e) {
      alert(t('resend_fail'));
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{t('history_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Review and manage your previously sent content ideas.</p>
        </div>
        <div className="relative">
            <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="w-full md:w-72 bg-white dark:bg-mag-surface border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-mag-orange/50 dark:text-white placeholder-gray-400 text-sm shadow-sm transition-all"
            />
        </div>
      </div>

      <div className="bg-white dark:bg-mag-surface rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/5">
                <tr>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('table_date')}</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('table_topic')}</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/3">{t('table_idea')}</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('table_status')}</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">{t('table_actions')}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredIdeas.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center justify-center">
                                <span className="mb-2 text-2xl opacity-20">📂</span>
                                {t('no_history')}
                            </div>
                        </td>
                    </tr>
                ) : (
                    filteredIdeas.map(idea => (
                        <tr key={idea.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono">
                                {new Date(idea.generatedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                    {idea.topic}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-mag-orange transition-colors">{idea.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">{idea.description}</p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        idea.status === SendingStatus.ERROR ? 'bg-red-500' : 'bg-green-500'
                                    }`}></span>
                                    <span className={`text-xs font-medium ${
                                        idea.status === SendingStatus.ERROR 
                                            ? 'text-red-600 dark:text-red-400' 
                                            : 'text-green-600 dark:text-green-400'
                                    }`}>
                                        {idea.status}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleResend(idea)}
                                    disabled={resendingId === idea.id}
                                    className="text-gray-400 hover:text-mag-orange dark:hover:text-mag-orange text-sm font-medium disabled:opacity-50 transition-colors border border-gray-200 dark:border-white/10 hover:border-mag-orange dark:hover:border-mag-orange rounded-lg px-3 py-1.5"
                                >
                                    {resendingId === idea.id ? t('sending') : t('btn_resend')}
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};