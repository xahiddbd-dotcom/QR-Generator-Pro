
import React, { useState } from 'react';
import { Language, AppConfig } from '../types';

interface AdminPanelProps {
  language: Language;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ language, config, onSave, onLogout }) => {
  const [editConfig, setEditConfig] = useState<AppConfig>(config);
  const [activeTab, setActiveTab] = useState<'founder' | 'donation' | 'ads'>('founder');

  const handleSave = () => {
    onSave(editConfig);
    alert(language === 'bn' ? 'সেটিংস সফলভাবে সেভ হয়েছে!' : 'Settings saved successfully!');
  };

  const t = {
    title: language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard',
    save: language === 'bn' ? 'সব সেভ করুন' : 'Save All Changes',
    logout: language === 'bn' ? 'লগ আউট' : 'Logout',
    founderTab: language === 'bn' ? 'প্রতিষ্ঠাতা' : 'Founder',
    donationTab: language === 'bn' ? 'ডোনেশন' : 'Donation',
    adsTab: language === 'bn' ? 'বিজ্ঞাপন' : 'Ads',
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-user-shield text-blue-500"></i> {t.title}
          </h2>
          <button onClick={onLogout} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">
            {t.logout}
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {(['founder', 'donation', 'ads'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab === 'founder' ? t.founderTab : tab === 'donation' ? t.donationTab : t.adsTab}
            </button>
          ))}
        </div>

        {activeTab === 'founder' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Founder Image URL</label>
              <input 
                value={editConfig.founder.image} 
                onChange={e => setEditConfig({...editConfig, founder: {...editConfig.founder, image: e.target.value}})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-blue-300 outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Name (BN)</label>
                <input 
                  value={editConfig.founder.name.bn} 
                  onChange={e => setEditConfig({...editConfig, founder: {...editConfig.founder, name: {...editConfig.founder.name, bn: e.target.value}}})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Name (EN)</label>
                <input 
                  value={editConfig.founder.name.en} 
                  onChange={e => setEditConfig({...editConfig, founder: {...editConfig.founder, name: {...editConfig.founder.name, en: e.target.value}}})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-slate-500 mb-1 block">Bio (BN)</label>
              <textarea 
                value={editConfig.founder.bio.bn} 
                onChange={e => setEditConfig({...editConfig, founder: {...editConfig.founder, bio: {...editConfig.founder.bio, bn: e.target.value}}})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs outline-none h-20"
              />
            </div>
          </div>
        )}

        {activeTab === 'donation' && (
          <div className="space-y-4">
             {editConfig.donation.methods.map((m, i) => (
               <div key={i} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-500 uppercase">Method #{i+1}</span>
                  </div>
                  <input 
                    value={m.name} 
                    onChange={e => {
                      const newMethods = [...editConfig.donation.methods];
                      newMethods[i].name = e.target.value;
                      setEditConfig({...editConfig, donation: {...editConfig.donation, methods: newMethods}});
                    }}
                    placeholder="Name (e.g. bKash)"
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 text-xs outline-none"
                  />
                  <input 
                    value={m.detail} 
                    onChange={e => {
                      const newMethods = [...editConfig.donation.methods];
                      newMethods[i].detail = e.target.value;
                      setEditConfig({...editConfig, donation: {...editConfig.donation, methods: newMethods}});
                    }}
                    placeholder="Details (Number)"
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 text-xs outline-none"
                  />
               </div>
             ))}
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="space-y-4">
             {editConfig.ads.map((ad, i) => (
               <div key={i} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                  <span className="text-[10px] font-black text-blue-500 uppercase">Ad Slide #{i+1}</span>
                  <input 
                    value={ad.title.bn} 
                    onChange={e => {
                      const newAds = [...editConfig.ads];
                      newAds[i].title.bn = e.target.value;
                      setEditConfig({...editConfig, ads: newAds});
                    }}
                    placeholder="Title BN"
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 text-xs outline-none"
                  />
                  <input 
                    value={ad.desc.bn} 
                    onChange={e => {
                      const newAds = [...editConfig.ads];
                      newAds[i].desc.bn = e.target.value;
                      setEditConfig({...editConfig, ads: newAds});
                    }}
                    placeholder="Description BN"
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 text-xs outline-none"
                  />
               </div>
             ))}
          </div>
        )}

        <button 
          onClick={handleSave}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-cloud-arrow-up mr-2"></i> {t.save}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
