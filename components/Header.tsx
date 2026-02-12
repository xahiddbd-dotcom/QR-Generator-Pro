
import React, { useState, useRef, useEffect } from 'react';
import { Language, Theme } from '../types';
import { APP_CONFIG } from '../config';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const t = {
    shareTitle: language === 'bn' ? 'শেয়ার করুন' : 'Share App',
    shareMsg: language === 'bn' ? 'QR Generator BD - সেরা কিউআর এবং এআই টুলস! এখনই ব্যবহার করে দেখুন:' : 'QR Generator BD - The best QR & AI tool! Try it now:',
    rate: language === 'bn' ? 'রেটিং দিন' : 'Rate Us',
    privacy: language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy',
    copied: language === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Link Copied!',
  };

  const handleShare = async () => {
    setIsMenuOpen(false);
    const shareData = {
      title: 'QR Generator BD',
      text: t.shareMsg,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(t.copied);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="p-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800/50 transition-all duration-300">
      <div className="flex flex-col group cursor-default">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-black text-blue-600 italic leading-none tracking-tighter group-hover:scale-105 transition-transform">
            QR Generator <span className="text-slate-800 dark:text-slate-200">BD</span>
          </h1>
          {APP_CONFIG.IS_BETA && (
            <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest border border-orange-200 dark:border-orange-800/50 animate-float">
              Beta
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest opacity-80">Live AI System</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 relative" ref={menuRef}>
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 border border-slate-200/50 dark:border-slate-700/50"
          aria-label="Toggle Dark Mode"
        >
          <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
        </button>

        <button 
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-2xl transition-all active:scale-90 border border-slate-200/50 dark:border-slate-700/50"
        >
          <i className="fa-solid fa-language text-blue-600 text-lg"></i>
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
            {language === 'bn' ? 'EN' : 'বাং'}
          </span>
        </button>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2.5 rounded-2xl transition-all active:scale-90 border shadow-sm ${isMenuOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/50'}`}
        >
          <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-14 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 py-3 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 z-[100] origin-top-right">
            <button 
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-share-nodes"></i>
              </div>
              {t.shareTitle}
            </button>

            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-star"></i>
              </div>
              {t.rate}
            </button>

            <div className="my-2 border-t border-slate-100 dark:border-slate-800 mx-5"></div>

            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center gap-3 px-5 py-3 text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 transition-colors text-left uppercase tracking-widest"
            >
              <i className="fa-solid fa-shield-halved ml-1"></i>
              {t.privacy}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
