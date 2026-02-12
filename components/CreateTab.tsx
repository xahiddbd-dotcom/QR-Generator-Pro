
import React, { useState, useRef } from 'react';
import { Language, QRType } from '../types';
import { PREDEFINED_LOGOS } from '../config';

interface CreateTabProps {
  language: Language;
}

type LogoShape = 'square' | 'rounded' | 'circle';

const CreateTab: React.FC<CreateTabProps> = ({ language }) => {
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [inputs, setInputs] = useState<any>({});
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [generated, setGenerated] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoShape, setLogoShape] = useState<LogoShape>('rounded');
  const [barcodeType, setBarcodeType] = useState('code128');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrTypes: { id: QRType; icon: string; label: { bn: string; en: string } }[] = [
    { id: 'url', icon: 'fa-link', label: { bn: 'লিঙ্ক', en: 'Link' } },
    { id: 'vcard', icon: 'fa-address-card', label: { bn: 'vCard', en: 'vCard' } },
    { id: 'wifi', icon: 'fa-wifi', label: { bn: 'WiFi', en: 'WiFi' } },
    { id: 'email', icon: 'fa-envelope', label: { bn: 'ইমেইল', en: 'Email' } },
    { id: 'sms', icon: 'fa-comment-sms', label: { bn: 'SMS', en: 'SMS' } },
    { id: 'pdf', icon: 'fa-file-pdf', label: { bn: 'PDF', en: 'PDF' } },
    { id: 'mp3', icon: 'fa-music', label: { bn: 'MP3', en: 'MP3' } },
    { id: 'barcode', icon: 'fa-barcode', label: { bn: 'বারকোড', en: 'Barcode' } },
    { id: 'twitter', icon: 'fa-brands fa-x-twitter', label: { bn: 'Twitter', en: 'Twitter' } },
    { id: 'facebook', icon: 'fa-brands fa-facebook', label: { bn: 'Facebook', en: 'Facebook' } },
  ];

  const barcodeOptions = [
    { id: 'code128', name: 'Code 128' },
    { id: 'ean13', name: 'EAN-13' },
    { id: 'upca', name: 'UPC-A' },
    { id: 'datamatrix', name: 'Data Matrix' },
    { id: 'pdf417', name: 'PDF 417' },
  ];

  const t = {
    title: language === 'bn' ? 'স্মার্ট কিউআর জেনারেটর' : 'Smart QR Generator',
    label: language === 'bn' ? 'তথ্য প্রদান করুন' : 'Provide Information',
    colors: language === 'bn' ? 'কালার বাছাই করুন' : 'Choose Colors',
    logos: language === 'bn' ? 'লোগো যুক্ত করুন' : 'Add Logo',
    logoStyle: language === 'bn' ? 'লোগো ফ্রেম স্টাইল' : 'Logo Frame Style',
    btnGen: language === 'bn' ? 'জেনারেট করুন' : 'Generate Now',
    success: language === 'bn' ? 'আপনার কোড প্রস্তুত!' : 'Your Code is Ready!',
    download: language === 'bn' ? 'ডাউনলোড' : 'Download',
    share: language === 'bn' ? 'শেয়ার' : 'Share',
    processing: language === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...',
    barcodeSelect: language === 'bn' ? 'বারকোড টাইপ' : 'Barcode Type',
    fileUrl: language === 'bn' ? 'ফাইল লিঙ্ক (URL)' : 'File Link (URL)',
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
      case 'pdf':
      case 'mp3':
        return inputs.fileUrl || '';
      case 'twitter':
        return `https://twitter.com/${inputs.user || ''}`;
      case 'facebook':
        return `https://facebook.com/${inputs.fbuser || ''}`;
      default:
        return inputs.val || '';
    }
  };

  const getQRUrl = (size: number = 1000) => {
    const data = getQRData();
    if (selectedType === 'barcode') {
      // Using bwip-js online API for barcodes
      return `https://bwipjs-api.metafloor.com/?bcid=${barcodeType}&text=${encodeURIComponent(data)}&scale=5&rotate=N&includetext&backgroundcolor=${bgColor.replace('#', '')}&barcolor=${fgColor.replace('#', '')}`;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&margin=10&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`;
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

  const generateFinalImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject();
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject();

      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = getQRUrl(1000);

      qrImg.onload = () => {
        canvas.width = 1000;
        canvas.height = 1000;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1000, 1000);
        
        // Draw main QR/Barcode
        ctx.drawImage(qrImg, 0, 0, 1000, 1000);

        if (logo && selectedType !== 'barcode') {
          const logoImg = new Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.src = logo;
          logoImg.onload = () => {
            const size = 240;
            const x = (1000 - size) / 2;
            const y = (1000 - size) / 2;
            
            ctx.save();
            
            // Draw background frame for logo
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            if (logoShape === 'circle') {
              ctx.arc(x + size/2, y + size/2, size/2 + 20, 0, Math.PI * 2);
            } else if (logoShape === 'rounded') {
              if (ctx.roundRect) ctx.roundRect(x - 20, y - 20, size + 40, size + 40, 50);
              else ctx.rect(x - 20, y - 20, size + 40, size + 40);
            } else {
              ctx.rect(x - 20, y - 20, size + 40, size + 40);
            }
            ctx.fill();

            // Mask and draw logo
            ctx.beginPath();
            if (logoShape === 'circle') {
              ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
            } else if (logoShape === 'rounded') {
              if (ctx.roundRect) ctx.roundRect(x, y, size, size, 40);
              else ctx.rect(x, y, size, size);
            } else {
              ctx.rect(x, y, size, size);
            }
            ctx.clip();
            ctx.drawImage(logoImg, x, y, size, size);
            ctx.restore();
            
            resolve(canvas.toDataURL('image/png'));
          };
          logoImg.onerror = () => resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(canvas.toDataURL('image/png'));
        }
      };
      qrImg.onerror = (e) => reject(e);
    });
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const dataUrl = await generateFinalImage();
      const link = document.createElement('a');
      link.download = `QR_Generator_BD_${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    setIsProcessing(true);
    try {
      const dataUrl = await generateFinalImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Code_${Date.now()}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Smart Code',
          text: 'Shared from QR Generator BD'
        });
      } else {
        const qrData = getQRData();
        await navigator.clipboard.writeText(qrData);
        alert(language === 'bn' ? 'তথ্য কপি হয়েছে!' : 'Data copied to clipboard!');
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {qrTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => { setSelectedType(type.id); setGenerated(false); }}
            className={`flex flex-col items-center justify-center min-w-[85px] h-20 rounded-2xl transition-all border ${
              selectedType === type.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            <i className={`fa-solid ${type.icon} text-xl mb-1`}></i>
            <span className="text-[10px] font-bold uppercase">{type.label[language]}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800">
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
           <i className="fa-solid fa-pen-to-square"></i> {t.label}
        </h3>

        <div className="space-y-4">
          {selectedType === 'barcode' && (
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">{t.barcodeSelect}</label>
               <div className="grid grid-cols-3 gap-2">
                 {barcodeOptions.map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => { setBarcodeType(opt.id); setGenerated(false); }}
                     className={`py-2 px-1 text-[9px] font-bold rounded-xl border transition-all ${barcodeType === opt.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
                   >
                     {opt.name}
                   </button>
                 ))}
               </div>
               <input name="val" onChange={handleInputChange} placeholder="Type barcode data..." className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
            </div>
          )}

          {(selectedType === 'pdf' || selectedType === 'mp3') && (
            <div className="space-y-3">
              <input name="fileUrl" onChange={handleInputChange} placeholder={t.fileUrl} className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <p className="text-[9px] text-slate-400 px-1 italic">Note: Provide a public URL to your {selectedType.toUpperCase()} file.</p>
            </div>
          )}

          {(selectedType === 'url' || selectedType === 'text') && (
            <input name="val" onChange={handleInputChange} placeholder={selectedType === 'url' ? "https://example.com" : "Enter text here..."} className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
          )}

          {selectedType === 'vcard' && (
            <div className="space-y-3">
              <input name="name" onChange={handleInputChange} placeholder="Name" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <input name="phone" onChange={handleInputChange} placeholder="Phone" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
              <input name="email" onChange={handleInputChange} placeholder="Email" className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none text-sm dark:text-white" />
            </div>
          )}

          {selectedType !== 'barcode' && (
            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-slate-400">{t.logos}</p>
                <div className="flex gap-2">
                   {(['square', 'rounded', 'circle'] as LogoShape[]).map(shape => (
                     <button 
                       key={shape}
                       onClick={() => setLogoShape(shape)}
                       className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${logoShape === shape ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400'}`}
                     >
                       <i className={`fa-solid ${shape === 'circle' ? 'fa-circle' : shape === 'rounded' ? 'fa-square-full' : 'fa-square'}`}></i>
                     </button>
                   ))}
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                <button onClick={() => setLogo(null)} className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${!logo ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-50 dark:bg-slate-800'}`}>
                  <i className="fa-solid fa-ban text-gray-400"></i>
                </button>
                {PREDEFINED_LOGOS.map((preLogo, idx) => (
                  <button key={idx} onClick={() => { setLogo(preLogo.url); setGenerated(false); }} className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 p-1 transition-all ${logo === preLogo.url ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-50'}`}>
                    <img src={preLogo.url} alt={preLogo.name} className="w-full h-full object-contain" />
                  </button>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-dashed border-blue-300 flex items-center justify-center bg-blue-50 text-blue-600">
                  <i className="fa-solid fa-plus"></i>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400">{t.colors}</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[9px] block mb-1 opacity-60 font-bold uppercase tracking-widest">Foreground</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                   <input type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" />
                   <span className="text-[10px] font-mono font-bold uppercase">{fgColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[9px] block mb-1 opacity-60 font-bold uppercase tracking-widest">Background</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                   <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" />
                   <span className="text-[10px] font-mono font-bold uppercase">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm mt-4 flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i> {t.btnGen}
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center animate-in zoom-in duration-500 border border-slate-100 dark:border-slate-800">
           <div className={`relative p-6 bg-white rounded-[2.5rem] shadow-2xl mb-6 overflow-hidden border border-slate-50 ${selectedType === 'barcode' ? 'w-full flex items-center justify-center' : ''}`}>
              <img 
                src={getQRUrl(350)}
                alt="Code"
                className={`${selectedType === 'barcode' ? 'max-w-full h-auto' : 'w-60 h-60'} block`}
              />
              {logo && selectedType !== 'barcode' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-16 h-16 bg-white p-1 shadow-lg border-2 border-slate-50 overflow-hidden ${logoShape === 'circle' ? 'rounded-full' : logoShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'}`}>
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
           </div>
           <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">{t.success}</h4>
           
           <div className="flex gap-3 w-full">
              <button 
                onClick={handleDownload}
                disabled={isProcessing}
                className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <i className={`fa-solid ${isProcessing ? 'fa-spinner fa-spin' : 'fa-download'}`}></i> {t.download}
              </button>
              <button 
                onClick={handleShare}
                disabled={isProcessing}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-share-nodes"></i> {t.share}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreateTab;
