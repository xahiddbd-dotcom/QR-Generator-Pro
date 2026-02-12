
import React, { useState, useEffect } from 'react';
import { AppTab, Language, Theme, QRHistoryItem } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ScanTab from './components/ScanTab';
import CreateTab from './components/CreateTab';
import AITab from './components/AITab';
import HistoryTab from './components/HistoryTab';
import AboutTab from './components/AboutTab';
import PromotionalAd from './components/PromotionalAd';

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
  const [history, setHistory] = useState<QRHistoryItem[]>(() => {
    const saved = localStorage.getItem('qr_history');
    return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    localStorage.setItem('qr_history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToHistory = (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: QRHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি সব হিস্ট্রি মুছে ফেলতে চান?' : 'Do you want to clear all history?')) {
      setHistory([]);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleScanComplete = (content: string) => {
    setLastScannedContent(content);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CREATE:
        return <CreateTab language={language} onGenerate={(content, type) => addToHistory({ type: 'generated', qrType: type, content })} />;
      case AppTab.SCAN:
        return <ScanTab language={language} onScanComplete={handleScanComplete} onLogged={(content) => addToHistory({ type: 'scanned', qrType: 'url', content })} />;
      case AppTab.AI:
        return <AITab language={language} initialContext={lastScannedContent} />;
      case AppTab.HISTORY:
        return <HistoryTab language={language} history={history} onClear={clearHistory} onDelete={deleteHistoryItem} />;
      case AppTab.MORE:
        return <AboutTab language={language} />;
      default:
        return <ScanTab language={language} onScanComplete={handleScanComplete} onLogged={(content) => addToHistory({ type: 'scanned', qrType: 'url', content })} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col transition-colors duration-500 bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900 overflow-x-hidden">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="p-4 max-w-md mx-auto w-full flex-1 relative">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          {renderContent()}
        </div>
        
        {activeTab !== AppTab.AI && (
          <div className="animate-in fade-in slide-in-from-bottom-8 delay-300 duration-700">
            <PromotionalAd language={language} />
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
    </div>
  );
};

export default App;
