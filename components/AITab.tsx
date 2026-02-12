
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
    emptyHintNoCtx: language === 'bn' ? "কিউআর কোড বা এআই লেন্স সম্পর্কে আপনার প্রশ্ন জিজ্ঞেস করুন।" : "Ask any questions about QR codes, AI scanning, or generations.",
    placeholder: language === 'bn' ? 'AI কে প্রশ্ন করুন...' : 'Ask AI anything...',
    errorMsg: language === 'bn' ? 'দুঃখিত, আমি উত্তর দিতে পারছি না।' : 'Sorry, I couldn\'t provide an answer.',
    suggestTitle: language === 'bn' ? 'আপনি জিজ্ঞেস করতে পারেন:' : 'Suggested topics for you:',
  };

  const suggestions = language === 'bn' ? [
    "কিভাবে লোগো দিয়ে সুন্দর কিউআর তৈরি করব?",
    "কিউআর কোড স্ক্যান করার সময় কি কি সতর্কতা মানা উচিত?",
    "এআই লেন্স কিভাবে কাজ করে?",
    "ভিকার্ড (vCard) কিউআর কোড কি এবং এটি কিভাবে কাজ করে?",
    "কিউআর কোড কেন ব্যবহার করা হয়?",
    "অনিরাপদ কিউআর কোড চেনার উপায় কি?"
  ] : [
    "How to create a professional QR with a logo?",
    "What security measures should I take when scanning?",
    "How does the AI Lens analysis work?",
    "What is a vCard QR and how to use it?",
    "Why should I use a custom colored QR code?",
    "How to detect a malicious QR code using AI?"
  ];

  const handleSend = async (customQuestion?: string) => {
    const q = customQuestion || question;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);

    const context = initialContext || (language === 'bn' ? "আমি একজন সাধারণ কিউআর কোড জেনারেটর এবং স্ক্যানার ব্যবহারকারী।" : "I am a regular user of a QR generator and scanner app.");
    const response = await askAIAboutContent(context, q, language);
    
    setMessages(prev => [...prev, { role: 'ai', text: response || t.errorMsg }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-t-[2.5rem] text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
              <i className="fa-solid fa-robot animate-bounce-slow"></i> {t.title}
            </h2>
            <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">{t.subtitle}</p>
          </div>
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
             <i className="fa-solid fa-wand-magic-sparkles text-blue-200"></i>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900 border-x border-slate-100 dark:border-slate-800 transition-colors no-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-slate-700">
              <i className="fa-solid fa-comments text-blue-500 text-2xl"></i>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-[240px]">
              {initialContext ? t.emptyHintWithCtx : t.emptyHintNoCtx}
            </p>
            
            <div className="w-full space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-blue-500 dark:text-blue-400 font-black mb-3 text-center">
                {t.suggestTitle}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[11px] bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all active:scale-95 text-left flex items-center gap-3 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-150 transition-transform"></span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm font-medium ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 leading-relaxed'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 border border-slate-200 dark:border-slate-700">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-b-[2.5rem] border border-slate-100 dark:border-slate-800 border-t-0 transition-colors">
        <div className="relative group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="w-full p-4 pr-14 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 shadow-sm transition-all focus:ring-2 ring-blue-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
          <button 
            onClick={() => handleSend()}
            disabled={loading || !question.trim()}
            className="absolute right-3 top-2.5 h-9 w-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-50 hover:bg-blue-700"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AITab;
