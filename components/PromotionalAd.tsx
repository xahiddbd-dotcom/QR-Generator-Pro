
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
      tag: 'Sponsored',
      btn: language === 'bn' ? 'ট্রাই করুন' : 'Try Now'
    },
    {
      title: language === 'bn' ? 'নিরাপদ লেনদেনের নিশ্চয়তা' : 'Secure Transactions',
      desc: language === 'bn' ? 'এআই লেন্স দিয়ে যেকোনো কিউআর যাচাই করুন।' : 'Verify any QR with AI Lens.',
      tag: 'AD',
      btn: language === 'bn' ? 'শিখুন' : 'Learn More'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ad = ads[currentAd];

  return (
    <div className="mt-8 mb-4 px-2 animate-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden flex items-center gap-4 group transition-all hover:shadow-md">
        <div className="absolute top-2 right-4">
          <span className="text-[7px] font-black uppercase tracking-tighter text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
            {ad.tag}
          </span>
        </div>
        
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
          <i className={`fa-solid ${currentAd === 0 ? 'fa-gem' : 'fa-shield-halved'} text-xl animate-pulse`}></i>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{ad.title}</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">{ad.desc}</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          {ad.btn}
        </button>
      </div>
    </div>
  );
};

export default PromotionalAd;
