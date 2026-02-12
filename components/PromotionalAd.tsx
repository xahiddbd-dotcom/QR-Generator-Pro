
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface PromotionalAdProps {
  language: Language;
}

const PromotionalAd: React.FC<PromotionalAdProps> = ({ language }) => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const ads = [
    {
      title: language === 'bn' ? 'প্রিমিয়াম কিউআর কোড জেনারেটর' : 'Premium QR Generator',
      desc: language === 'bn' ? 'আপনার ব্র্যান্ডের লোগো যুক্ত করুন একদম ফ্রি!' : 'Add your brand logo for free!',
      tag: 'Sponsored',
      icon: 'fa-gem',
      btn: language === 'bn' ? 'ট্রাই করুন' : 'Try Now'
    },
    {
      title: language === 'bn' ? 'নিরাপদ লেনদেনের নিশ্চয়তা' : 'Secure Transactions',
      desc: language === 'bn' ? 'এআই লেন্স দিয়ে যেকোনো কিউআর যাচাই করুন।' : 'Verify any QR with AI Lens.',
      tag: 'AD',
      icon: 'fa-shield-halved',
      btn: language === 'bn' ? 'শিখুন' : 'Learn More'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAd((prev) => (prev + 1) % ads.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const ad = ads[currentAd];

  return (
    <div className="mt-8 mb-4 px-2">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden flex items-center gap-4 group transition-all hover:shadow-lg">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full skew-x-[-20deg] animate-shimmer opacity-30"></div>
        
        <div className="absolute top-2.5 right-5">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
            {ad.tag}
          </span>
        </div>
        
        <div className={`w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 transition-all duration-500 ${isTransitioning ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}>
          <i className={`fa-solid ${ad.icon} text-2xl animate-float`}></i>
        </div>

        <div className={`flex-1 min-w-0 transition-all duration-500 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate mb-0.5">{ad.title}</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 font-medium">{ad.desc}</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all active:scale-90 shadow-lg shadow-blue-500/20 flex-shrink-0">
          {ad.btn}
        </button>
      </div>
    </div>
  );
};

export default PromotionalAd;
