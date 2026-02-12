
import React from 'react';
import { Language } from '../types';
import { 
  FOUNDER_INFO, 
  SOCIAL_LINKS, 
  APP_CONFIG, 
  DONATION_INFO, 
  COPYRIGHT_NOTICE, 
  FEEDBACK_CONTACT,
  APK_INSTALL_INFO
} from '../config';

interface AboutTabProps {
  language: Language;
}

const AboutTab: React.FC<AboutTabProps> = ({ language }) => {
  const t = {
    contact: language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Founder',
    version: language === 'bn' ? 'ভার্সন' : 'Version',
    donationBtn: language === 'bn' ? 'ডোনেট করুন' : 'Donate Now',
    emailBtn: language === 'bn' ? 'ইমেইল পাঠান' : 'Send Email'
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in zoom-in duration-500">
      {/* APK / Install Card */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-[2.5rem] shadow-xl text-white">
        <h3 className="text-lg font-black mb-3 flex items-center gap-2">
          <i className="fa-brands fa-android text-2xl"></i> {APK_INSTALL_INFO.TITLE[language]}
        </h3>
        <div className="space-y-2">
          {APK_INSTALL_INFO.STEPS[language].map((step, i) => (
            <p key={i} className="text-xs font-medium opacity-90">{step}</p>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-[10px] italic opacity-80">
            * এটি একটি প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA), যা আলাদা কোনো ফাইল ছাড়াই আপনার ফোনে APK এর মতো কাজ করবে।
          </p>
        </div>
      </div>

      {/* Founder Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full"></div>
        
        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-6">
             <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/10 p-1 bg-white/5 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={FOUNDER_INFO.IMAGE} 
                  alt={FOUNDER_INFO.NAME[language]} 
                  className="w-full h-full object-cover rounded-[2rem]"
                />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center">
               <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
             </div>
          </div>

          <h4 className="text-2xl font-black tracking-tight mb-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{FOUNDER_INFO.NAME[language]}</h4>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">{FOUNDER_INFO.ROLE[language]}</p>
          
          <div className="flex gap-4 mb-8">
            {SOCIAL_LINKS.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg"
              >
                <i className={`${link.icon} text-lg ${link.color}`}></i>
              </a>
            ))}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto italic mb-8">
            "{FOUNDER_INFO.BIO[language]}"
          </p>

          <div className="grid grid-cols-3 gap-8 w-full py-6 border-t border-white/5">
             {FOUNDER_INFO.STATS.map((stat, idx) => (
               <div key={idx} className="text-center">
                 <p className="text-lg font-black tracking-tighter">{stat.value}</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label[language]}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Donation & Support Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-heart text-red-500 animate-pulse"></i> {DONATION_INFO.TITLE[language]}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {DONATION_INFO.DESCRIPTION[language]}
        </p>
        <div className="space-y-3">
          {DONATION_INFO.METHODS.map((method, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 rounded-xl flex items-center justify-center">
                  <i className={method.icon}></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{method.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{method.detail}</p>
                </div>
              </div>
              <button className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg active:scale-95 transition-transform">
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback & Updates Section */}
      <div className="bg-blue-600 p-6 rounded-[2.5rem] shadow-xl text-white">
        <h3 className="text-lg font-black mb-2 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb"></i> {FEEDBACK_CONTACT.TITLE[language]}
        </h3>
        <p className="text-xs opacity-90 leading-relaxed mb-6">
          {FEEDBACK_CONTACT.MESSAGE[language]}
        </p>
        <a 
          href={`mailto:${FEEDBACK_CONTACT.EMAIL}`}
          className="w-full bg-white text-blue-600 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-black/10 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-envelope"></i> {t.emailBtn}
        </a>
      </div>

      {/* Copyright Awareness Section */}
      <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-[2.5rem] border border-orange-100 dark:border-orange-900/30">
        <h3 className="text-sm font-black text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
          <i className="fa-solid fa-shield-halved"></i> {COPYRIGHT_NOTICE.TITLE[language]}
        </h3>
        <p className="text-xs text-orange-800/70 dark:text-orange-400/70 leading-relaxed italic">
          {COPYRIGHT_NOTICE.MESSAGE[language]}
        </p>
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-4">
         <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">
           &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}
         </p>
         <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
           <p className="text-[9px] font-black text-slate-600 dark:text-slate-400">
             {t.version}: {APP_CONFIG.VERSION}
           </p>
         </div>
      </div>
    </div>
  );
};

export default AboutTab;
