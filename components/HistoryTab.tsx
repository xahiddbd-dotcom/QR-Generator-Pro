
import React from 'react';
import { QRHistoryItem, Language } from '../types';

interface HistoryTabProps {
  language: Language;
  history: QRHistoryItem[];
  onClear: () => void;
  onDelete: (id: string) => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ language, history, onClear, onDelete }) => {
  const t = {
    title: language === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity',
    clear: language === 'bn' ? 'মুছে ফেলুন' : 'Clear All',
    empty: language === 'bn' ? 'কোনো ইতিহাস পাওয়া যায়নি।' : 'No history found.',
    scanned: language === 'bn' ? 'স্ক্যান' : 'Scanned',
    generated: language === 'bn' ? 'জেনারেট' : 'Generated',
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{t.title}</h2>
        {history.length > 0 && (
          <button 
            onClick={() => window.confirm('Clear all?') && onClear()}
            className="text-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 font-black uppercase px-3 py-1.5 rounded-xl active:scale-95 transition-all"
          >
            {t.clear}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] text-center border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <i className="fa-solid fa-clock-rotate-left text-5xl text-slate-100 dark:text-slate-800 mb-4"></i>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">{t.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-lg transition-all group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                item.type === 'scanned' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
              }`}>
                <i className={`fa-solid ${item.type === 'scanned' ? 'fa-expand' : 'fa-qrcode'} text-xl`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate pr-2 tracking-tight uppercase">{item.content}</p>
                <div className="flex items-center gap-3 mt-1 opacity-60">
                  <span className="text-[10px] font-bold">{formatTime(item.timestamp)}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase border border-current">
                    {item.type === 'scanned' ? t.scanned : t.generated}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-slate-300 dark:text-slate-700 hover:text-red-500 p-3 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
