
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface PromotionalAdProps {
  language: Language;
}

const PromotionalAd: React.FC<PromotionalAdProps> = ({ language }) => {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      title: language === 'bn' ? 'প্রিমিয়াম কিউআর কোড জেনারেটর' : 'Premium QR Generator',
      desc: language === 'bn' ? 'আপনার ব্র্যান্ডের লোগো যুক্ত করুন একদম ফ্রি!' : 'Add your brand logo for free!',
      icon: 'fa-gem',
      btn: language === 'bn' ? 'ট্রাই করুন' : 'Try Now'
    },
    {
      title: language === 'bn' ? 'নিরাপদ লেনদেনের নিশ্চয়তা' : 'Secure Transactions',
      desc: language === 'bn' ? 'এআই লেন্স দিয়ে যেকোনো কিউআর যাচাই করুন।' : 'Verify any QR with AI Lens.',
      icon: 'fa-shield-halved',
      btn: language === 'bn' ? 'শিখুন' : 'Learn More'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentAd(a => (a + 1) % ads.length), 8000);
    return () => clearInterval(timer);
  }, []);

  const ad = ads[currentAd];

  return (
    <div className="mt-8 mb-4 px-2">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden flex items-center gap-4 transition-all hover:border-blue-400 dark:hover:border-blue-500 group">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-blue-500/5 to-transparent skew-x-[-20deg] animate-shimmer"></div>
        
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <i className={`fa-solid ${ad.icon} text-xl animate-float`}></i>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{ad.title}</h4>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 font-medium mt-0.5">{ad.desc}</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          {ad.btn}
        </button>
      </div>
    </div>
  );
};

export default PromotionalAd;
