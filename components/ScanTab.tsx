
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
    const res = await performVisualAnalysis(base64, language);
    if (res) setLensResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-tighter">
          <i className="fa-solid fa-camera-retro text-blue-600"></i> {t.title}
        </h2>

        <div className="relative w-full aspect-square bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800">
          {isScanning ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/20 rounded-3xl relative">
                  <div className="scan-line"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl shadow-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl shadow-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl shadow-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl shadow-lg"></div>
                </div>
              </div>
              <button 
                onClick={captureAndAnalyze}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold active:scale-95 transition-all"
              >
                <i className="fa-solid fa-bullseye text-blue-400"></i> {t.lensBtn}
              </button>
            </>
          ) : previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain bg-slate-800 p-4" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-8 gap-4">
               <i className="fa-solid fa-images text-5xl mb-2 opacity-10"></i>
               <div className="flex flex-col gap-3 w-full max-w-[240px]">
                 <button onClick={startCamera} className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-transform">
                   <i className="fa-solid fa-camera"></i> {t.btnCamera}
                 </button>
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 active:scale-95 flex items-center justify-center gap-2 transition-transform"
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
               <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-sm font-bold animate-pulse">AI is Reading Image...</p>
            </div>
          )}
        </div>
      </div>

      {(analysis || lensResult) && (
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-[3rem] shadow-2xl text-white animate-in slide-in-from-bottom-8 duration-500">
           <h3 className="text-xl font-black mb-4 flex items-center gap-2">
             <i className="fa-solid fa-wand-magic-sparkles text-blue-400"></i> 
             {lensResult ? t.lensTitle : t.aiTitle}
           </h3>
           
           {lensResult ? (
             <div className="space-y-4">
                <p className="text-sm leading-relaxed opacity-90">{lensResult.description}</p>
                <div className="flex flex-wrap gap-2">
                   {lensResult.objects.map((obj, i) => (
                     <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold border border-white/10">{obj}</span>
                   ))}
                </div>
                {lensResult.ocrText && (
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] uppercase opacity-50 mb-1 font-bold">Extracted Text</p>
                    <p className="text-xs font-mono">{lensResult.ocrText}</p>
                  </div>
                )}
             </div>
           ) : (
             <div className="space-y-4">
               {scannedResult && (
                 <div className="bg-white/10 p-4 rounded-2xl mb-2">
                    <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{t.decodedInfo}</p>
                    <p className="text-sm font-mono break-all">{scannedResult}</p>
                 </div>
               )}
               <div className="flex items-center gap-2 mb-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${analysis?.isSafe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {analysis?.isSafe ? 'Safe' : 'Unsafe/Suspicious'}
                 </span>
                 <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">
                    {analysis?.category}
                 </span>
               </div>
               <p className="text-sm leading-relaxed opacity-90">{analysis?.summary}</p>
               <div className="grid grid-cols-2 gap-2 mt-4">
                 {analysis?.suggestions.map((s, i) => (
                   <div key={i} className="p-3 bg-white/5 rounded-xl text-[10px] border border-white/10 flex items-start gap-2">
                      <i className="fa-solid fa-circle-check text-blue-400 mt-0.5"></i> {s}
                   </div>
                 ))}
               </div>
             </div>
           )}

           <button 
             onClick={() => { setAnalysis(null); setLensResult(null); setPreviewImage(null); }}
             className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black mt-8 shadow-xl active:scale-95 transition-all text-sm"
           >
             {t.reset}
           </button>
        </div>
      )}
    </div>
  );
};

export default ScanTab;
