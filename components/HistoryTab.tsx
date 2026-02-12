
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
    deleteConfirm: language === 'bn' ? 'মুছে ফেলতে চান?' : 'Delete item?'
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t.title}</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 font-black uppercase tracking-widest px-3 py-1.5 rounded-lg active:scale-95 transition-all"
          >
            {t.clear}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] text-center border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-clock-rotate-left text-4xl text-slate-200 dark:text-slate-700"></i>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">{t.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                item.type === 'scanned' 
                  ? 'bg-green-50 dark:bg-green-900/10 text-green-600 border-green-100 dark:border-green-900/30' 
                  : 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 border-blue-100 dark:border-blue-900/30'
              }`}>
                <i className={`fa-solid ${item.type === 'scanned' ? 'fa-expand' : 'fa-qrcode'} text-2xl`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate pr-2 uppercase tracking-tight">{item.content}</p>
                <div className="flex items-center gap-3 mt-1.5">
                   <div className="flex items-center gap-1">
                     <i className="fa-regular fa-clock text-[10px] text-slate-400"></i>
                     <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                       {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>
                   <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border ${
                     item.type === 'scanned' 
                       ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-800' 
                       : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800'
                   }`}>
                     {item.type === 'scanned' ? t.scanned : t.generated}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-all p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
