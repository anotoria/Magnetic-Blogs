import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { UserProfile, ViewState, Idea, Language } from './types';
import { MOCK_USER, INITIAL_IDEAS } from './constants';
import { translations } from './utils/translations';

const App: React.FC = () => {
  // State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);

  // Initialize Theme and Locale from local storage or default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedUser = localStorage.getItem('user');
    const savedIdeas = localStorage.getItem('ideas');

    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      setUser(prev => ({ ...prev, theme: savedTheme as 'light' | 'dark' }));
    } else {
        document.documentElement.classList.add('dark'); // Default dark
    }

    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }

    if (savedIdeas) {
        setIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  // Persistence helpers
  const updateUser = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    // Apply theme change immediately
    document.documentElement.classList.toggle('dark', newUser.theme === 'dark');
    localStorage.setItem('theme', newUser.theme);
  };

  // Improved Update Function: Upsert Logic (Insert or Update)
  const saveOrUpdateIdeas = (incomingIdeas: Idea[]) => {
    setIdeas(prevIdeas => {
        const existingIds = new Set(prevIdeas.map(i => i.id));
        const itemsToUpdate = incomingIdeas.filter(i => existingIds.has(i.id));
        
        // Items in incoming that are NOT in existing (True new items)
        const newItems = incomingIdeas.filter(i => !existingIds.has(i.id));

        // Get updated IDs to filter them out from the previous list
        const updatedIds = new Set(itemsToUpdate.map(i => i.id));
        const filteredPrev = prevIdeas.filter(i => !updatedIds.has(i.id));
        
        // Combine: Incoming (Updated + New) + Remaining Old
        const combined = [...incomingIdeas, ...filteredPrev];
        
        // Sort by generation date descending
        const sorted = combined.sort((a,b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
        
        localStorage.setItem('ideas', JSON.stringify(sorted));
        return sorted;
    });
  };
  
  const updateSingleIdea = (updatedIdea: Idea) => {
      saveOrUpdateIdeas([updatedIdea]);
  }

  const deleteIdea = (id: string) => {
    setIdeas(prev => {
        const filtered = prev.filter(i => i.id !== id);
        localStorage.setItem('ideas', JSON.stringify(filtered));
        return filtered;
    });
  };

  const toggleTheme = () => {
    const newTheme = user.theme === 'dark' ? 'light' : 'dark';
    updateUser({ ...user, theme: newTheme });
  };

  const changeLanguage = (lang: Language) => {
      updateUser({ ...user, language: lang });
  };

  const handleRegister = (data: { name: string; email: string; companyName: string }) => {
    const newUser: UserProfile = {
        ...MOCK_USER, // Inherit defaults like theme/language from current state
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        language: user.language, // Keep language selected during login
        theme: user.theme
    };
    updateUser(newUser);
    setIsAuthenticated(true);
  };

  // Translation Helper
  const t = useCallback((key: keyof typeof translations[typeof Language.EN], params?: Record<string, string | number>) => {
    const lang = user.language || Language.EN;
    let text = translations[lang][key] || translations[Language.EN][key] || key;
    
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
        });
    }
    return text;
  }, [user.language]);

  if (!isAuthenticated) {
    return (
        <Login 
            onLogin={() => setIsAuthenticated(true)} 
            onRegister={handleRegister} 
            currentLang={user.language}
            onLanguageChange={changeLanguage}
            t={t}
        />
    );
  }

  return (
    <Layout
      currentView={currentView}
      onChangeView={setCurrentView}
      user={user}
      onLogout={() => setIsAuthenticated(false)}
      onToggleTheme={toggleTheme}
      onLanguageChange={changeLanguage}
      t={t}
    >
      {currentView === 'DASHBOARD' && (
        <Dashboard 
            user={user} 
            onSaveIdeas={saveOrUpdateIdeas} 
            onDeleteIdea={deleteIdea}
            t={t} 
        />
      )}
      {currentView === 'HISTORY' && (
        <History ideas={ideas} user={user} onUpdateIdea={updateSingleIdea} t={t} />
      )}
      {currentView === 'SETTINGS' && (
        <Settings user={user} onUpdateUser={updateUser} t={t} />
      )}
      {currentView === 'PROFILE' && (
        <Profile user={user} onUpdateUser={updateUser} t={t} />
      )}
      {currentView === 'ADMIN' && user.role === 'admin' && (
        <Admin t={t} />
      )}
    </Layout>
  );
};

export default App;
