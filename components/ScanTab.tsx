
import React, { useRef, useState } from 'react';
import { analyzeQRContent, performVisualAnalysis, extractQRFromImage } from '../services/geminiService';
import { AIAnalysis, VisualAnalysis, Language } from '../types';

interface ScanTabProps {
  onScanComplete: (content: string) => void;
  language: Language;
}

const ScanTab: React.FC<ScanTabProps> = ({ onScanComplete, language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isLensMode, setIsLensMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [lensResult, setLensResult] = useState<VisualAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const t = {
    title: language === 'bn' ? 'স্মার্ট লেন্স স্ক্যানার' : 'Smart Lens Scanner',
    lensBtn: language === 'bn' ? 'AI লেন্স এনালাইসিস' : 'AI Lens Analysis',
    btnCamera: language === 'bn' ? 'ক্যামেরা খুলুন' : 'Open Camera',
    btnGallery: language === 'bn' ? 'গ্যালারি থেকে আপলোড' : 'Upload from Gallery',
    aiTitle: language === 'bn' ? 'AI বিশ্লেষণ' : 'AI Analysis',
    lensTitle: language === 'bn' ? 'লেন্স ডিটেকশন' : 'Lens Detection',
    reset: language === 'bn' ? 'আবার স্ক্যান করুন' : 'Scan Again',
    decodedInfo: language === 'bn' ? 'সনাক্তকৃত তথ্য' : 'Decoded Info'
  };

  const startCamera = async () => {
    setError(null);
    setIsScanning(true);
    setPreviewImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Camera access error");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setIsScanning(false);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Full = event.target?.result as string;
      setPreviewImage(base64Full);
      const base64 = base64Full.split(',')[1];
      
      const res = await extractQRFromImage(base64, language);
      if (res) {
        setAnalysis({
          isSafe: res.isSafe,
          summary: res.summary,
          category: res.category,
          suggestions: res.suggestions
        });
        setScannedResult(res.decodedContent);
        onScanComplete(res.decodedContent);
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    setIsLensMode(true);
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    stopCamera();
    
    const res = await performVisualAnalysis(base64, language);
    if (res) setLensResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-hidden">
        <h2 className="text-lg font-black mb-5 flex items-center gap-3 text-slate-800 dark:text-white uppercase tracking-tighter">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
            <i className="fa-solid fa-camera-retro"></i>
          </div>
          {t.title}
        </h2>

        <div className="relative w-full aspect-square bg-slate-950 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800 transition-all duration-700">
          {isScanning ? (
            <div className="animate-in fade-in duration-500 h-full">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 border-2 border-white/10 rounded-[2.5rem] relative animate-pulse-glow">
                  <div className="scan-line"></div>
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-[1.5rem] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-[1.5rem] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-[1.5rem] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-[1.5rem] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6">
                <button 
                  onClick={captureAndAnalyze}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full flex items-center gap-3 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-2xl"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-blue-400"></i> {t.lensBtn}
                </button>
              </div>
            </div>
          ) : previewImage ? (
            <div className="h-full animate-in zoom-in-95 duration-500">
              <img src={previewImage} alt="Preview" className="w-full h-full object-contain bg-slate-900" />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-10 gap-6">
               <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-float">
                 <i className="fa-solid fa-qrcode text-4xl opacity-20"></i>
               </div>
               <div className="flex flex-col gap-3 w-full max-w-[260px]">
                 <button onClick={startCamera} className="w-full bg-blue-600 text-white px-6 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 transition-all">
                   <i className="fa-solid fa-camera"></i> {t.btnCamera}
                 </button>
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] border border-slate-200 dark:border-slate-700 active:scale-95 flex items-center justify-center gap-3 transition-all"
                 >
                   <i className="fa-solid fa-image"></i> {t.btnGallery}
                 </button>
                 <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleGalleryUpload} 
                 />
               </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-50 animate-in fade-in duration-300">
               <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
               <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">AI Analysis in Progress</p>
            </div>
          )}
        </div>
      </div>

      {(analysis || lensResult) && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 p-8 rounded-[3rem] shadow-2xl text-white animate-in slide-in-from-bottom-10 duration-700 delay-200 fill-mode-both relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full"></div>
           
           <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
             <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
               <i className="fa-solid fa-wand-magic-sparkles"></i>
             </div>
             {lensResult ? t.lensTitle : t.aiTitle}
           </h3>
           
           {lensResult ? (
             <div className="space-y-5 relative z-10">
                <p className="text-sm leading-relaxed opacity-80 font-medium">{lensResult.description}</p>
                <div className="flex flex-wrap gap-2">
                   {lensResult.objects.map((obj, i) => (
                     <span key={i} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{obj}</span>
                   ))}
                </div>
                {lensResult.ocrText && (
                  <div className="bg-black/40 p-5 rounded-3xl border border-white/10 shadow-inner">
                    <p className="text-[9px] uppercase opacity-40 mb-2 font-black tracking-widest">Extracted Text</p>
                    <p className="text-xs font-mono leading-relaxed text-blue-200">{lensResult.ocrText}</p>
                  </div>
                )}
             </div>
           ) : (
             <div className="space-y-5 relative z-10">
               {scannedResult && (
                 <div className="bg-white/5 p-5 rounded-3xl mb-2 border border-white/5">
                    <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-2">{t.decodedInfo}</p>
                    <p className="text-sm font-mono break-all text-blue-200">{scannedResult}</p>
                 </div>
               )}
               <div className="flex items-center gap-3 mb-2">
                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${analysis?.isSafe ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                    {analysis?.isSafe ? 'Verified Safe' : 'Risk Detected'}
                 </span>
                 <span className="px-4 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                    {analysis?.category}
                 </span>
               </div>
               <p className="text-sm leading-relaxed opacity-80 font-medium">{analysis?.summary}</p>
               <div className="grid grid-cols-1 gap-2 mt-6">
                 {analysis?.suggestions.map((s, i) => (
                   <div key={i} className="p-4 bg-white/5 rounded-2xl text-[11px] border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-all cursor-default">
                      <i className="fa-solid fa-circle-check text-blue-400 mt-0.5"></i> 
                      <span className="font-medium">{s}</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           <button 
             onClick={() => { setAnalysis(null); setLensResult(null); setPreviewImage(null); }}
             className="w-full bg-white text-slate-900 py-5 rounded-3xl font-black uppercase tracking-widest mt-8 shadow-2xl active:scale-95 transition-all text-xs"
           >
             {t.reset}
           </button>
        </div>
      )}
    </div>
  );
};

export default ScanTab;
