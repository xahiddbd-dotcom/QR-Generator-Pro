
import React, { useState, useRef } from 'react';
import { Language, QRType } from '../types';
import { PREDEFINED_LOGOS } from '../config';

interface CreateTabProps {
  language: Language;
}

const CreateTab: React.FC<CreateTabProps> = ({ language }) => {
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [inputs, setInputs] = useState<any>({});
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [generated, setGenerated] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qrTypes: { id: QRType; icon: string; label: { bn: string; en: string } }[] = [
    { id: 'url', icon: 'fa-link', label: { bn: 'লিঙ্ক', en: 'Link' } },
    { id: 'vcard', icon: 'fa-address-card', label: { bn: 'vCard', en: 'vCard' } },
    { id: 'wifi', icon: 'fa-wifi', label: { bn: 'WiFi', en: 'WiFi' } },
    { id: 'email', icon: 'fa-envelope', label: { bn: 'ইমেইল', en: 'Email' } },
    { id: 'sms', icon: 'fa-comment-sms', label: { bn: 'SMS', en: 'SMS' } },
    { id: 'twitter', icon: 'fa-brands fa-x-twitter', label: { bn: 'Twitter', en: 'Twitter' } },
    { id: 'facebook', icon: 'fa-brands fa-facebook', label: { bn: 'Facebook', en: 'Facebook' } },
    { id: 'bitcoin', icon: 'fa-brands fa-bitcoin', label: { bn: 'Bitcoin', en: 'Bitcoin' } },
    { id: 'file', icon: 'fa-file-pdf', label: { bn: 'PDF/MP3', en: 'PDF/MP3' } },
    { id: 'app', icon: 'fa-mobile-screen', label: { bn: 'App Store', en: 'App Store' } },
  ];

  const t = {
    title: language === 'bn' ? 'স্মার্ট কিউআর জেনারেটর' : 'Smart QR Generator',
    label: language === 'bn' ? 'তথ্য প্রদান করুন' : 'Provide Information',
    colors: language === 'bn' ? 'কিউআর কালার বাছাই করুন' : 'Choose QR Colors',
    logos: language === 'bn' ? 'লোগো যুক্ত করুন' : 'Add a Logo',
    customLogo: language === 'bn' ? 'গ্যালারি থেকে লোগো' : 'Custom from Gallery',
    btnGen: language === 'bn' ? 'জেনারেট করুন' : 'Generate QR',
    success: language === 'bn' ? 'কিউআর কোড প্রস্তুত!' : 'QR Code Ready!',
    download: language === 'bn' ? 'ডাউনলোড' : 'Download',
    share: language === 'bn' ? 'শেয়ার' : 'Share',
    noLogo: language === 'bn' ? 'কোনোটিই নয়' : 'None'
  };

  const getQRData = () => {
    switch (selectedType) {
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${inputs.name || ''}\nTEL:${inputs.phone || ''}\nEMAIL:${inputs.email || ''}\nEND:VCARD`;
      case 'wifi':
        return `WIFI:S:${inputs.ssid || ''};T:${inputs.enc || 'WPA'};P:${inputs.pass || ''};;`;
      case 'email':
        return `mailto:${inputs.to || ''}?subject=${encodeURIComponent(inputs.sub || '')}&body=${encodeURIComponent(inputs.body || '')}`;
      case 'sms':
        return `smsto:${inputs.num || ''}:${inputs.msg || ''}`;
      case 'bitcoin':
        return `bitcoin:${inputs.addr || ''}?amount=${inputs.amt || ''}`;
      case 'twitter':
        return `https://twitter.com/${inputs.user || ''}`;
      case 'file':
      case 'app':
      case 'url':
      default:
        return inputs.val || '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setGenerated(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
        setGenerated(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Category Selector */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {qrTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => { setSelectedType(type.id); setGenerated(false); }}
            className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-2xl transition-all border ${
              selectedType === type.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            <i className={`fa-solid ${type.icon} text-lg mb-1`}></i>
            <span className="text-[10px] font-bold uppercase">{type.label[language]}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
           <i className="fa-solid fa-pen-to-square"></i> {t.label}
        </h3>

        <div className="space-y-4">
          {/* Dynamic Inputs based on type */}
          {selectedType === 'url' && <input name="val" onChange={handleInputChange} placeholder="https://example.com" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />}
          {selectedType === 'vcard' && (
            <div className="space-y-3">
              <input name="name" onChange={handleInputChange} placeholder="Name" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <input name="phone" onChange={handleInputChange} placeholder="Phone" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <input name="email" onChange={handleInputChange} placeholder="Email" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
            </div>
          )}
          {selectedType === 'wifi' && (
            <div className="space-y-3">
              <input name="ssid" onChange={handleInputChange} placeholder="Network Name (SSID)" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <input name="pass" onChange={handleInputChange} type="password" placeholder="Password" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
            </div>
          )}
          {selectedType === 'bitcoin' && (
            <div className="space-y-3">
              <input name="addr" onChange={handleInputChange} placeholder="Bitcoin Address" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <input name="amt" onChange={handleInputChange} placeholder="Amount" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
            </div>
          )}

          {/* Logo Selection Section */}
          <div className="pt-4 space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400">{t.logos}</p>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              <button 
                onClick={() => setLogo(null)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${!logo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-slate-50 dark:bg-slate-800'}`}
              >
                <i className="fa-solid fa-ban text-gray-400"></i>
              </button>
              
              {PREDEFINED_LOGOS.map((preLogo, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setLogo(preLogo.url); setGenerated(false); }}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 p-1 transition-all ${logo === preLogo.url ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-slate-50 dark:bg-slate-800'}`}
                >
                  <img src={preLogo.url} alt={preLogo.name} className="w-full h-full object-contain" />
                </button>
              ))}

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-dashed border-blue-300 flex items-center justify-center bg-blue-50 dark:bg-blue-900/10 text-blue-600"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>

          {/* Color Selectors */}
          <div className="pt-2 space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400">{t.colors}</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[9px] block mb-1 opacity-60">Foreground</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                   <input type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer" />
                   <span className="text-[10px] font-mono">{fgColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[9px] block mb-1 opacity-60">Background</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                   <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer" />
                   <span className="text-[10px] font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-blue-200 dark:shadow-none active:scale-95 transition-all text-lg mt-4"
          >
            {t.btnGen}
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center animate-in zoom-in duration-500 border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl mb-6">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getQRData())}&margin=10&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`}
                alt="QR Code"
                className="w-56 h-56 block rounded-xl"
              />
              {logo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 bg-white p-1.5 rounded-2xl shadow-lg border-2 border-slate-50">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  </div>
                </div>
              )}
           </div>
           <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">{t.success}</h4>
           <div className="flex gap-3 w-full">
              <button className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                <i className="fa-solid fa-download"></i> {t.download}
              </button>
              <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all">
                <i className="fa-solid fa-share-nodes"></i> {t.share}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreateTab;
