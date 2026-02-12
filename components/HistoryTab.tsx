
import React, { useState, useEffect } from 'react';
import { QRHistoryItem, Language } from '../types';

interface HistoryTabProps {
  language: Language;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ language }) => {
  const [history, setHistory] = useState<QRHistoryItem[]>([]);

  const t = {
    title: language === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity',
    clear: language === 'bn' ? 'মুছে ফেলুন' : 'Clear All',
    empty: language === 'bn' ? 'কোনো ইতিহাস পাওয়া যায়নি।' : 'No history found.',
    scanned: language === 'bn' ? 'স্ক্যান' : 'Scanned',
    generated: language === 'bn' ? 'জেনারেট' : 'Generated'
  };

  useEffect(() => {
    const saved = localStorage.getItem('qr_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      const mock: QRHistoryItem[] = [
        // Fix: Added missing 'qrType' property to satisfy the QRHistoryItem interface
        { id: '1', type: 'scanned', qrType: 'url', content: 'https://google.com', timestamp: Date.now() - 3600000 },
        { id: '2', type: 'generated', qrType: 'text', content: 'Support Number: 017000000', timestamp: Date.now() - 7200000 },
      ];
      setHistory(mock);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 transition-colors">{t.title}</h2>
        <button className="text-xs text-blue-600 font-semibold hover:underline">{t.clear}</button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-dashed border-gray-200 dark:border-slate-800 transition-colors">
          <i className="fa-solid fa-clock-rotate-left text-4xl text-gray-200 dark:text-slate-800 mb-4 block"></i>
          <p className="text-gray-400 dark:text-slate-500 italic text-sm">{t.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-900 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                item.type === 'scanned' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
              }`}>
                <i className={`fa-solid ${item.type === 'scanned' ? 'fa-expand' : 'fa-qrcode'} text-xl`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">{item.content}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                     {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                   <span className="text-[10px] bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded-full capitalize border border-gray-100 dark:border-slate-700">
                     {item.type === 'scanned' ? t.scanned : t.generated}
                   </span>
                </div>
              </div>
              <button className="text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2">
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
