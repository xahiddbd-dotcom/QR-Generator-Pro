
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
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem('app_lang') as Language) || 'bn'
  );
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('app_theme') as Theme) || 'light'
  );
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
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('qr_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: QRHistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CREATE:
        return <CreateTab language={language} onGenerate={(content, type) => addToHistory({ type: 'generated', qrType: type, content })} />;
      case AppTab.SCAN:
        return <ScanTab language={language} onScanComplete={setLastScannedContent} onLogged={(content) => addToHistory({ type: 'scanned', qrType: 'url', content })} />;
      case AppTab.AI:
        return <AITab language={language} initialContext={lastScannedContent} />;
      case AppTab.HISTORY:
        return (
          <HistoryTab 
            language={language} 
            history={history} 
            onClear={() => setHistory([])} 
            onDelete={(id) => setHistory(h => h.filter(i => i.id !== id))} 
          />
        );
      case AppTab.MORE:
        return <AboutTab language={language} />;
      default:
        return <ScanTab language={language} onScanComplete={setLastScannedContent} onLogged={(c) => addToHistory({ type: 'scanned', qrType: 'url', content: c })} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500 selection:bg-blue-200 dark:selection:bg-blue-900">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
      />
      
      <main className="p-4 max-w-md mx-auto w-full flex-1 relative mb-24 overflow-y-auto">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          {renderContent()}
        </div>
        
        {activeTab !== AppTab.AI && <PromotionalAd language={language} />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
    </div>
  );
};

export default App;
