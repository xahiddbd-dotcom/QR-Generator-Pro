
import React, { useState, useEffect } from 'react';
import { AppTab, Language, Theme, QRHistoryItem, AppConfig } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ScanTab from './components/ScanTab';
import CreateTab from './components/CreateTab';
import AITab from './components/AITab';
import HistoryTab from './components/HistoryTab';
import AboutTab from './components/AboutTab';
import AdminPanel from './components/AdminPanel';
import PromotionalAd from './components/PromotionalAd';
import { FOUNDER_INFO, DONATION_INFO } from './config';

const DEFAULT_CONFIG: AppConfig = {
  founder: {
    name: FOUNDER_INFO.NAME,
    role: FOUNDER_INFO.ROLE,
    bio: FOUNDER_INFO.BIO,
    image: FOUNDER_INFO.IMAGE,
    stats: FOUNDER_INFO.STATS
  },
  donation: {
    title: DONATION_INFO.TITLE,
    methods: DONATION_INFO.METHODS
  },
  ads: [
    {
      title: { bn: 'প্রিমিয়াম কিউআর কোড জেনারেটর', en: 'Premium QR Generator' },
      desc: { bn: 'আপনার ব্র্যান্ডের লোগো যুক্ত করুন একদম ফ্রি!', en: 'Add your brand logo for free!' },
      icon: 'fa-gem',
      btn: { bn: 'ট্রাই করুন', en: 'Try Now' }
    },
    {
      title: { bn: 'নিরাপদ লেনদেনের নিশ্চয়তা', en: 'Secure Transactions' },
      desc: { bn: 'এআই লেন্স দিয়ে যেকোনো কিউআর যাচাই করুন।', en: 'Verify any QR with AI Lens.' },
      icon: 'fa-shield-halved',
      btn: { bn: 'শিখুন', en: 'Learn More' }
    }
  ]
};

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
  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('app_dynamic_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    localStorage.setItem('app_dynamic_config', JSON.stringify(appConfig));
  }, [appConfig]);

  const addToHistory = (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: QRHistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const handleAdminLogin = () => {
    const user = prompt(language === 'bn' ? 'ইউজারনেম দিন:' : 'Username:');
    const pass = prompt(language === 'bn' ? 'পাসওয়ার্ড দিন:' : 'Password:');
    if (user === 'admin' && pass === 'admin') {
      setIsAdmin(true);
      setActiveTab(AppTab.ADMIN);
    } else {
      alert(language === 'bn' ? 'ভুল তথ্য!' : 'Wrong credentials!');
    }
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
        return <HistoryTab language={language} history={history} onClear={() => setHistory([])} onDelete={(id) => setHistory(h => h.filter(i => i.id !== id))} />;
      case AppTab.MORE:
        return <AboutTab language={language} config={appConfig} />;
      case AppTab.ADMIN:
        return isAdmin ? <AdminPanel language={language} config={appConfig} onSave={setAppConfig} onLogout={() => {setIsAdmin(false); setActiveTab(AppTab.SCAN);}} /> : null;
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
        onAdminLogin={handleAdminLogin}
      />
      
      <main className="p-4 max-w-md mx-auto w-full flex-1 relative mb-24 overflow-y-auto">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          {renderContent()}
        </div>
        
        {activeTab !== AppTab.AI && activeTab !== AppTab.ADMIN && <PromotionalAd language={language} ads={appConfig.ads} />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
    </div>
  );
};

export default App;
