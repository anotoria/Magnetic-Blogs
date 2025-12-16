import React, { useState } from 'react';
import { generateBlogIdeas } from '../services/geminiService';
import { sendToWebhook } from '../services/webhookService';
import { Idea, UserProfile, SendingStatus } from '../types';
import { FlameIcon, TrashIcon, SendIcon, PlusIcon, DownloadIcon } from '../components/Icons';

interface DashboardProps {
  user: UserProfile;
  onSaveIdeas: (ideas: Idea[]) => void;
  onDeleteIdea: (id: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const Dashboard: React.FC<DashboardProps> = ({ user, onSaveIdeas, onDeleteIdea, t }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedIdeas([]);
    setSelectedIds(new Set());
    setNotification(null);

    try {
      const rawIdeas = await generateBlogIdeas(topic, user.language);
      const newIdeas: Idea[] = rawIdeas.map((item: any) => ({
        id: generateId(),
        title: item.title,
        description: item.description,
        topic: topic,
        language: user.language,
        generatedAt: new Date().toISOString(),
        status: SendingStatus.NOT_SENT
      }));
      setGeneratedIdeas(newIdeas);
      // Immediately save generated ideas to history with NOT_SENT status
      onSaveIdeas(newIdeas);
    } catch (error) {
      setNotification({ msg: t('notification_gen_fail'), type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    // Remove from local state
    setGeneratedIdeas(prev => prev.filter(idea => idea.id !== id));
    
    // Update selection state
    const newSelected = new Set(selectedIds);
    newSelected.delete(id);
    setSelectedIds(newSelected);

    // Remove from global history
    onDeleteIdea(id);
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleEdit = (id: string, field: 'title' | 'description', value: string) => {
    const updatedList = generatedIdeas.map(idea => 
      idea.id === id ? { ...idea, [field]: value } : idea
    );
    setGeneratedIdeas(updatedList);
    // Auto-save edits to history
    const editedIdea = updatedList.find(i => i.id === id);
    if (editedIdea) {
        onSaveIdeas([editedIdea]);
    }
  };

  const handleAddManual = () => {
    const newIdea: Idea = {
      id: generateId(),
      title: 'New Blog Post Title',
      description: 'Description of the article...',
      topic: topic || 'Manual',
      language: user.language,
      generatedAt: new Date().toISOString(),
      status: SendingStatus.NOT_SENT
    };
    setGeneratedIdeas([newIdea, ...generatedIdeas]);
    onSaveIdeas([newIdea]);
  };

  const handleSendSelected = async () => {
    const selectedIdeas = generatedIdeas.filter(idea => selectedIds.has(idea.id));
    if (selectedIdeas.length === 0) return;

    setIsSending(true);
    try {
      await sendToWebhook(selectedIdeas, user);
      
      const updatedIdeas = generatedIdeas.map(idea => {
        if (selectedIds.has(idea.id)) {
          return { ...idea, status: SendingStatus.SENT, sentAt: new Date().toISOString() };
        }
        return idea;
      });

      setGeneratedIdeas(updatedIdeas);
      onSaveIdeas(updatedIdeas.filter(idea => selectedIds.has(idea.id))); 
      setNotification({ msg: t('notification_send_success', { n: selectedIdeas.length }), type: 'success' });
      setSelectedIds(new Set());
    } catch (error) {
      setNotification({ msg: t('notification_send_fail'), type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleExport = () => {
    const ideasToExport = selectedIds.size > 0 
        ? generatedIdeas.filter(i => selectedIds.has(i.id))
        : generatedIdeas;
    
    if (ideasToExport.length === 0) return;

    const headers = ['Title', 'Description', 'Topic', 'Language', 'Generated At', 'Status'];
    const csvContent = [
        headers.join(','),
        ...ideasToExport.map(i => [
            `"${i.title.replace(/"/g, '""')}"`,
            `"${i.description.replace(/"/g, '""')}"`,
            `"${i.topic.replace(/"/g, '""')}"`,
            i.language,
            i.generatedAt,
            i.status
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `magnetic_ideas_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 md:mb-10 relative flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white">{t('gen_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl">{t('gen_subtitle')}</p>
        </div>
        
        {generatedIdeas.length > 0 && (
             <button 
                onClick={handleExport}
                className="flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-mag-orange hover:bg-mag-orange/10 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 transition"
            >
                <DownloadIcon className="w-4 h-4 mr-2"/> {t('btn_export')}
            </button>
        )}
      </div>

      {/* Input Section */}
      <div className="relative group mb-10 md:mb-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-mag-orange to-mag-red rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-white dark:bg-mag-surface rounded-2xl p-2 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('input_placeholder')}
            className="flex-1 bg-transparent border-none text-gray-900 dark:text-white text-base md:text-lg px-4 py-3 md:px-6 md:py-4 focus:ring-0 placeholder-gray-400 dark:placeholder-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className={`w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-white flex items-center justify-center transition-all duration-300 transform
              ${isGenerating || !topic.trim() 
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-mag-orange to-mag-red hover:shadow-[0_0_20px_rgba(255,69,0,0.4)] hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {isGenerating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('btn_analyze')}
              </div>
            ) : (
              <>
                <FlameIcon className="w-5 h-5 mr-2" />
                {t('btn_generate')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-8 p-4 rounded-xl border flex items-center shadow-lg animate-fade-in-down ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
          <div className={`w-2 h-2 rounded-full mr-3 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {notification.msg}
        </div>
      )}

      {/* Results */}
      {generatedIdeas.length > 0 && (
        <div className="animate-fade-in-up space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-white/5 pb-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-6 md:h-8 bg-mag-orange rounded-full mr-3"></span>
                {t('generated_concepts')} 
                <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">{generatedIdeas.length}</span>
            </h3>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                 <button onClick={handleAddManual} className="flex-1 md:flex-none justify-center flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-mag-orange hover:bg-mag-orange/10 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 transition">
                    <PlusIcon className="w-4 h-4 mr-2"/> {t('btn_add_custom')}
                 </button>
                 <button 
                    onClick={handleSendSelected} 
                    disabled={selectedIds.size === 0 || isSending}
                    className={`flex-1 md:flex-none justify-center flex items-center text-sm font-bold px-6 py-2 rounded-lg transition-all duration-300
                        ${selectedIds.size === 0 || isSending 
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed' 
                            : 'bg-white dark:bg-white text-mag-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
                    `}
                >
                    {isSending ? t('sending') : `${t('btn_send_selected')} (${selectedIds.size})`}
                    {!isSending && <SendIcon className="w-4 h-4 ml-2" />}
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedIdeas.map((idea) => {
              const isSelected = selectedIds.has(idea.id);
              return (
              <div 
                key={idea.id} 
                className={`group relative p-6 rounded-2xl border transition-all duration-300
                    ${isSelected
                        ? 'bg-mag-orange/5 border-mag-orange shadow-[0_0_20px_rgba(255,69,0,0.1)]' 
                        : 'bg-white dark:bg-mag-surface border-gray-100 dark:border-white/5 hover:border-mag-orange/30 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]'}
                `}
              >
                {/* Tech Corner Accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-mag-orange/20 to-transparent"></div>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <label className="relative flex items-center cursor-pointer p-1">
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(idea.id)}
                                className="peer sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center
                                ${isSelected ? 'border-mag-orange bg-mag-orange' : 'border-gray-300 dark:border-gray-600 hover:border-mag-orange'}
                            `}>
                                {isSelected && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                        </label>
                    </div>
                    <button 
                        onClick={() => handleDelete(idea.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete Idea"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <input 
                        className="w-full bg-transparent text-lg md:text-xl font-bold text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-100 dark:hover:border-white/10 focus:border-mag-orange outline-none pb-2 transition-all"
                        value={idea.title}
                        onChange={(e) => handleEdit(idea.id, 'title', e.target.value)}
                    />
                    <textarea 
                        className="w-full bg-transparent text-sm md:text-base text-gray-600 dark:text-gray-400 border-b-2 border-transparent hover:border-gray-100 dark:hover:border-white/10 focus:border-mag-orange outline-none resize-none h-24 transition-all leading-relaxed"
                        value={idea.description}
                        onChange={(e) => handleEdit(idea.id, 'description', e.target.value)}
                    />
                </div>
                {idea.status === SendingStatus.SENT && (
                    <div className="absolute bottom-4 right-4 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        {t('sent_tag')}
                    </div>
                )}
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  );
};