import React, { useState } from 'react';
import { ViewState, UserProfile, Language } from '../types';
import { LANGUAGES } from '../constants';
import { 
  FlameIcon, LayoutDashboardIcon, HistoryIcon, SettingsIcon, 
  UserIcon, LogOutIcon, MoonIcon, SunIcon, UsersIcon,
  ChevronLeftIcon, ChevronRightIcon, MenuIcon, XIcon
} from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: UserProfile;
  onLogout: () => void;
  onToggleTheme: () => void;
  onLanguageChange: (lang: Language) => void;
  t: (key: string) => string;
}

const NavItem = ({ 
  view, 
  current, 
  icon: Icon, 
  label, 
  onClick,
  isCollapsed
}: { 
  view: ViewState; 
  current: ViewState; 
  icon: any; 
  label: string; 
  onClick: () => void;
  isCollapsed: boolean;
}) => {
  const isActive = view === current;
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : ''}
      className={`relative flex items-center w-full mb-2 rounded-xl transition-all duration-300 group overflow-hidden ${
        isCollapsed ? 'justify-center p-3' : 'p-3.5'
      } ${
        isActive 
          ? 'text-white' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
      {/* Active Background Glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-mag-orange/20 to-mag-red/20 border border-mag-orange/30 rounded-xl" />
      )}
      
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-mag-orange rounded-r-full shadow-[0_0_10px_#FF4500]" />
      )}

      <Icon className={`w-5 h-5 relative z-10 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-mag-orange drop-shadow-[0_0_8px_rgba(255,69,0,0.5)]' : 'group-hover:text-mag-orange transition-colors'}`} />
      
      {!isCollapsed && (
        <span className={`font-medium relative z-10 whitespace-nowrap ${isActive ? 'font-semibold tracking-wide' : ''}`}>{label}</span>
      )}
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onChangeView,
  user,
  onLogout,
  onToggleTheme,
  onLanguageChange,
  t
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen font-sans">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-mag-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-30 flex items-center justify-between px-4 transition-colors duration-500">
         <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-mag-orange to-mag-red rounded-lg flex items-center justify-center shadow-lg mr-3">
                <FlameIcon className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Magnetic<span className="text-mag-orange">Blogs</span>
            </h1>
         </div>
         <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-mag-orange transition-colors"
         >
            <MenuIcon className="w-6 h-6" />
         </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside 
        className={`
            fixed inset-y-0 left-0 z-40
            flex flex-col
            bg-white/95 dark:bg-mag-dark/95 md:bg-white/80 md:dark:bg-mag-dark/65 backdrop-blur-xl
            border-r border-gray-200 dark:border-white/5
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            ${isCollapsed ? 'md:w-20' : 'md:w-72'}
            w-72
        `}
      >
        {/* Logo & Toggle Section */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center p-4' : 'justify-between p-6'} h-20`}>
            {/* Desktop Logo (when not collapsed) */}
            <div className={`flex items-center ${isCollapsed ? 'hidden' : 'flex'}`}>
                <div className="relative group cursor-pointer mr-3">
                    <div className="absolute -inset-1 bg-gradient-to-r from-mag-orange to-mag-red rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-mag-orange to-mag-red rounded-lg flex items-center justify-center shadow-lg">
                        <FlameIcon className="text-white w-5 h-5" />
                    </div>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 whitespace-nowrap hidden md:block">
                    Magnetic<span className="text-mag-orange">Blogs</span>
                </h1>
                {/* Mobile: Text is in header, but show X close button here for drawer */}
                <h1 className="md:hidden text-lg font-bold text-gray-900 dark:text-white ml-1">Menu</h1>
            </div>
            
            {/* Collapsed Logo State (Desktop) */}
            {isCollapsed && (
                <div className="hidden md:flex w-8 h-8 bg-gradient-to-br from-mag-orange to-mag-red rounded-lg items-center justify-center shadow-lg cursor-pointer" onClick={() => setIsCollapsed(false)}>
                     <FlameIcon className="text-white w-5 h-5" />
                </div>
            )}

            {/* Desktop Toggle Button */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition"
            >
                <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {/* Mobile Close Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Collapsed Toggle Button (Visible when collapsed on Desktop) */}
        {isCollapsed && (
            <div className="hidden md:flex justify-center mb-4">
                 <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        )}
        
        {/* User Info Section */}
        <div className={`px-4 mb-2 transition-all duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-100'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5'}`}>
                 {isCollapsed ? (
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-mag-orange to-mag-red flex items-center justify-center text-white font-bold text-xs shadow-md" title={user.name}>
                         {user.name.charAt(0)}
                     </div>
                 ) : (
                     <>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mag-orange to-mag-red flex items-center justify-center text-white font-bold text-sm shadow-md mr-3 flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.companyName}</p>
                        </div>
                     </>
                 )}
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          <NavItem 
            view="DASHBOARD" 
            current={currentView} 
            icon={LayoutDashboardIcon} 
            label={t('nav_generator')} 
            onClick={() => handleNavClick('DASHBOARD')}
            isCollapsed={isCollapsed}
          />
          <NavItem 
            view="HISTORY" 
            current={currentView} 
            icon={HistoryIcon} 
            label={t('nav_history')} 
            onClick={() => handleNavClick('HISTORY')} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            view="SETTINGS" 
            current={currentView} 
            icon={SettingsIcon} 
            label={t('nav_integrations')} 
            onClick={() => handleNavClick('SETTINGS')} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            view="PROFILE" 
            current={currentView} 
            icon={UserIcon} 
            label={t('nav_profile')} 
            onClick={() => handleNavClick('PROFILE')} 
            isCollapsed={isCollapsed}
          />
          
          {user.role === 'admin' && (
             <div className={`pt-4 mt-4 border-t border-gray-100 dark:border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
                <NavItem 
                    view="ADMIN" 
                    current={currentView} 
                    icon={UsersIcon} 
                    label={t('nav_admin')} 
                    onClick={() => handleNavClick('ADMIN')}
                    isCollapsed={isCollapsed}
                />
             </div>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 space-y-4">
           {!isCollapsed ? (
               <>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-2 rounded-xl border border-gray-100 dark:border-white/5">
                    <button 
                        onClick={onToggleTheme}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 transition shadow-sm hover:shadow text-gray-500 dark:text-gray-400"
                        title="Toggle Theme"
                    >
                        {user.theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-indigo-600" />}
                    </button>
                    
                    <div className="h-4 w-[1px] bg-gray-300 dark:bg-white/10 mx-1"></div>

                    <select 
                        value={user.language}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="bg-transparent text-xs font-bold border-none text-gray-600 dark:text-gray-300 focus:ring-0 cursor-pointer hover:text-mag-orange transition-colors w-full text-center"
                    >
                        {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-white dark:bg-mag-surface text-gray-900 dark:text-white">
                            {lang.code.toUpperCase()}
                        </option>
                        ))}
                    </select>
                </div>
                
                <button 
                    onClick={onLogout}
                    className="flex items-center justify-center w-full p-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    {t('logout')}
                </button>
               </>
           ) : (
               <div className="flex flex-col items-center gap-3">
                   <button 
                        onClick={onToggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400"
                    >
                        {user.theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-indigo-600" />}
                    </button>
                    <button 
                        onClick={onLogout}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition"
                        title={t('logout')}
                    >
                        <LogOutIcon className="w-5 h-5" />
                    </button>
               </div>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`
            flex-1 p-4 md:p-10 overflow-y-auto transition-all duration-300 ease-in-out
            pt-20 md:pt-10 
            ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}
            ml-0
        `}
      >
        {children}
      </main>
    </div>
  );
};