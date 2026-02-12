
import React from 'react';
import { AppTab, Language } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, language }) => {
  const tabs = [
    { 
      id: AppTab.CREATE, 
      icon: 'fa-plus-circle', 
      label: language === 'bn' ? 'তৈরি করুন' : 'Create' 
    },
    { 
      id: AppTab.SCAN, 
      icon: 'fa-qrcode', 
      label: language === 'bn' ? 'স্ক্যানার' : 'Scanner' 
    },
    { 
      id: AppTab.AI, 
      icon: 'fa-wand-magic-sparkles', 
      label: language === 'bn' ? 'AI টুলস' : 'AI Tools' 
    },
    { 
      id: AppTab.HISTORY, 
      icon: 'fa-history', 
      label: language === 'bn' ? 'হিস্ট্রি' : 'History' 
    },
    { 
      id: AppTab.MORE, 
      icon: 'fa-ellipsis-h', 
      label: language === 'bn' ? 'আরও' : 'More' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-3 pb-6 flex justify-between items-center z-50 transition-colors">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
            activeTab === tab.id 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <div className={`${activeTab === tab.id ? 'scale-110' : 'scale-100'} transition-transform`}>
            <i className={`fa-solid ${tab.icon} text-xl`}></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
