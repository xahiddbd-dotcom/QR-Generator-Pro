
import React, { useState, useEffect } from 'react';
import { AppTab, Language, Theme } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ScanTab from './components/ScanTab';
import CreateTab from './components/CreateTab';
import AITab from './components/AITab';
import HistoryTab from './components/HistoryTab';
import AboutTab from './components/AboutTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SCAN);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'bn';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved as Theme) || 'light';
  });
  const [lastScannedContent, setLastScannedContent] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('app_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleScanComplete = (content: string) => {
    setLastScannedContent(content);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CREATE:
        return <CreateTab language={language} />;
      case AppTab.SCAN:
        return <ScanTab language={language} onScanComplete={handleScanComplete} />;
      case AppTab.AI:
        return <AITab language={language} initialContext={lastScannedContent} />;
      case AppTab.HISTORY:
        return <HistoryTab language={language} />;
      case AppTab.MORE:
        return <AboutTab language={language} />;
      default:
        return <ScanTab language={language} onScanComplete={handleScanComplete} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="p-4 max-w-md mx-auto w-full flex-1">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
    </div>
  );
};

export default App;
