
import React, { useState } from 'react';
import { askAIAboutContent } from '../services/geminiService';
import { Language } from '../types';

interface AITabProps {
  initialContext?: string | null;
  language: Language;
}

const AITab: React.FC<AITabProps> = ({ initialContext, language }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const t = {
    title: language === 'bn' ? 'AI সমাধান টুলস' : 'AI Solution Tools',
    subtitle: language === 'bn' ? 'স্ক্যান করা তথ্য সম্পর্কে বিস্তারিত জানুন।' : 'Learn more about scanned data.',
    emptyHintWithCtx: language === 'bn' ? `আপনি "${initialContext}" সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।` : `You can ask anything about "${initialContext}".`,
    emptyHintNoCtx: language === 'bn' ? "কিউআর কোড বা জেনারেশন সম্পর্কে কোনো প্রশ্ন আছে?" : "Have questions about QR codes or generation?",
    placeholder: language === 'bn' ? 'AI কে প্রশ্ন করুন...' : 'Ask AI anything...',
    errorMsg: language === 'bn' ? 'দুঃখিত, আমি উত্তর দিতে পারছি না।' : 'Sorry, I couldn\'t provide an answer.',
    suggestTitle: language === 'bn' ? 'আপনি জিজ্ঞেস করতে পারেন:' : 'You can ask:',
  };

  const suggestions = language === 'bn' ? [
    "কিউআর কোড কেন ব্যবহার করা হয়?",
    "কিউআর কোড কি নিরাপদ?",
    "কিভাবে একটি ওয়াইফাই কিউআর কোড তৈরি করব?",
    "কিউআর কোডের মাধ্যমে কি কি তথ্য শেয়ার করা যায়?"
  ] : [
    "Why are QR codes used?",
    "Are QR codes safe?",
    "How to create a WiFi QR code?",
    "What information can be shared via QR?"
  ];

  const handleSend = async (customQuestion?: string) => {
    const q = customQuestion || question;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);

    const context = initialContext || (language === 'bn' ? "কোনো স্ক্যান করা তথ্য নেই।" : "No specific QR content scanned yet.");
    const response = await askAIAboutContent(context, q, language);
    
    setMessages(prev => [...prev, { role: 'ai', text: response || t.errorMsg }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-t-3xl text-white shadow-lg">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <i className="fa-solid fa-robot"></i> {t.title}
        </h2>
        <p className="text-xs opacity-80 mt-1">{t.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900 border-x border-gray-100 dark:border-slate-800 transition-colors">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <i className="fa-solid fa-comment-dots text-blue-500 text-2xl"></i>
            </div>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-6">
              {initialContext ? t.emptyHintWithCtx : t.emptyHintNoCtx}
            </p>
            
            {!initialContext && (
              <div className="w-full space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-500 font-bold mb-2">
                  {t.suggestTitle}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-tl-none border border-gray-200 dark:border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1 border border-gray-200 dark:border-slate-700">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-b-3xl border border-gray-100 dark:border-slate-800 border-t-0 transition-colors">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="w-full p-4 pr-14 rounded-2xl bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 outline-none border border-gray-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-sm transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={loading || !question.trim()}
            className="absolute right-3 top-2.5 h-9 w-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITab;
