
import React, { useRef, useState, useEffect } from 'react';
import { analyzeQRContent, performVisualAnalysis, extractQRFromImage } from '../services/geminiService';
import { AIAnalysis, VisualAnalysis, Language } from '../types';

interface ScanTabProps {
  onScanComplete: (content: string) => void;
  onLogged: (content: string) => void;
  language: Language;
}

const ScanTab: React.FC<ScanTabProps> = ({ onScanComplete, onLogged, language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [lensResult, setLensResult] = useState<VisualAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const t = {
    warningTitle: language === 'bn' ? 'ব্যবহারের সতর্কতা' : 'Usage Warning',
    warningMsg: language === 'bn' ? 'অপরিচিত বা সন্দেহজনক কিউআর কোড স্ক্যান করার আগে সাবধান থাকুন। এটি আপনার তথ্য চুরি করতে পারে।' : 'Be careful before scanning unknown or suspicious QR codes. It could lead to data theft.',
    understand: language === 'bn' ? 'বুঝেছি' : 'Understood',
    scanning: language === 'bn' ? 'স্ক্যান হচ্ছে...' : 'Scanning...',
    aiTitle: language === 'bn' ? 'AI ফলাফল' : 'AI Result',
    reset: language === 'bn' ? 'আবার শুরু করুন' : 'Reset Scanner',
    gallery: language === 'bn' ? 'গ্যালারি' : 'Gallery',
    capture: language === 'bn' ? 'বিশ্লেষণ করুন' : 'Analyze Now'
  };

  const startCamera = async () => {
    setError(null);
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError(language === 'bn' ? "ক্যামেরা এক্সেস পাওয়া যায়নি" : "Camera access denied");
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

  useEffect(() => {
    if (!showWarning) {
      startCamera();
    }
    return () => stopCamera();
  }, [showWarning]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    const res = await performVisualAnalysis(base64, language);
    if (res) {
      setLensResult(res);
      if (res.ocrText) {
        onLogged(res.ocrText);
      }
      stopCamera();
    }
    setIsAnalyzing(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      const res = await extractQRFromImage(base64, language);
      if (res) {
        setAnalysis(res);
        onScanComplete(res.decodedContent);
        onLogged(res.decodedContent);
        stopCamera();
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  if (showWarning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-[3rem] p-8 text-center shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
        </div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight">{t.warningTitle}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          {t.warningMsg}
        </p>
        <button 
          onClick={() => setShowWarning(false)}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          {t.understand}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-[3/4] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
        {isScanning && (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/20 rounded-[2rem] relative">
                <div className="scan-line"></div>
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
              </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 px-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white flex items-center justify-center active:scale-90 transition-all"
              >
                <i className="fa-solid fa-image"></i>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
              </button>
              
              <button 
                onClick={captureAndAnalyze}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i> {t.capture}
              </button>

              <div className="w-12 h-12"></div>
            </div>
          </>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest">{t.scanning}</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
            <i className="fa-solid fa-circle-xmark text-4xl text-red-500 mb-4"></i>
            <p className="text-sm font-medium">{error}</p>
            <button onClick={startCamera} className="mt-6 bg-white text-black px-6 py-2 rounded-xl font-bold text-xs uppercase">Retry</button>
          </div>
        )}
      </div>

      {(analysis || lensResult) && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-500">
          <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <i className="fa-solid fa-robot"></i> {t.aiTitle}
          </h3>
          
          <div className="space-y-4">
            {lensResult ? (
              <>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                  {lensResult.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {lensResult.objects.map((obj, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{obj}</span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <p className="text-[10px] font-mono break-all text-blue-900 dark:text-blue-200">{analysis?.summary}</p>
                </div>
                <div className={`text-[10px] font-black uppercase px-3 py-1 inline-block rounded-md ${analysis?.isSafe ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                  {analysis?.isSafe ? 'Safe' : 'Risky'}
                </div>
              </>
            )}

            <button 
              onClick={() => { setAnalysis(null); setLensResult(null); setShowWarning(true); }}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all mt-4 border border-slate-200 dark:border-slate-700"
            >
              {t.reset}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanTab;
