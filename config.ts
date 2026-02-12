
/**
 * QR Generator BD - Global Configuration
 */

export const APP_CONFIG = {
  NAME: "QR Generator BD",
  VERSION: "2.0.0-beta", 
  IS_BETA: true,
  MODEL_NAME: "gemini-3-flash-preview", 
  DEFAULT_LANG: "bn" as const,
  THEME: "light" as const,
};

export const FOUNDER_INFO = {
  NAME: {
    bn: "মো: আশরাফুল ইসলাম",
    en: "MD. ASHRAFUL ISLAM"
  },
  ROLE: {
    bn: "প্রস্তুতকারক পরিচিতি",
    en: "Founder & Lead Developer"
  },
  BIO: {
    bn: "আধুনিক এআই ভিত্তিক কিউআর সলিউশন নিয়ে কাজ করছি। নিরাপদ এবং স্মার্ট প্রযুক্তি সবার হাতের নাগালে পৌঁছে দেয়াই আমাদের লক্ষ্য।",
    en: "Building modern AI-powered QR solutions. Our mission is to make safe and smart technology accessible to everyone."
  },
  IMAGE: "https://images.unsplash.com/photo-1770847468547-fc23f1c645c7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  STATS: [
    { label: { bn: "স্ক্যান", en: "Scans" }, value: "10K+" },
    { label: { bn: "নিরাপত্তা", en: "Safety" }, value: "99.9%" },
    { label: { bn: "সাপোর্ট", en: "Support" }, value: "Elite" }
  ]
};

export const APK_INSTALL_INFO = {
  TITLE: { bn: "অ্যাপ হিসেবে ব্যবহার করুন", en: "Install as App" },
  STEPS: {
    bn: [
      "১. ব্রাউজারের উপরে (৩টি ডট) মেনুতে ক্লিক করুন।",
      "২. 'Install App' বা 'Add to Home Screen' বাটনে ক্লিক করুন।",
      "৩. এখন ফোনের হোম স্ক্রিন থেকে APK এর মতো ব্যবহার করুন।"
    ],
    en: [
      "1. Click the browser menu (3 dots).",
      "2. Select 'Install App' or 'Add to Home Screen'.",
      "3. Use it just like an APK from your home screen."
    ]
  }
};

export const SOCIAL_LINKS = [
  { platform: "github", icon: "fa-brands fa-github", url: "https://github.com/xahiddbd-dotcom", color: "text-white" },
  { platform: "linkedin", icon: "fa-brands fa-linkedin", url: "https://linkedin.com", color: "text-blue-400" },
  { platform: "web", icon: "fa-solid fa-globe", url: "https://imafk007.vercel.app", color: "text-green-400" }
];

export const PREDEFINED_LOGOS = [
  { name: "LinkedIn", url: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  { name: "GitHub", url: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
  { name: "WhatsApp", url: 'https://cdn-icons-png.flaticon.com/512/5968/5968841.png' },
  { name: "Instagram", url: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' }
];

export const DONATION_INFO = {
  TITLE: { bn: "প্রজেক্টটি এগিয়ে নিতে সাহায্য করুন", en: "Support this project" },
  DESCRIPTION: { 
    bn: "আপনার ছোট একটি অনুদান আমাদের সার্ভার খরচ এবং নতুন ফিচার উন্নয়নে বড় ভূমিকা রাখবে।", 
    en: "A small contribution from you helps us manage server costs and develop new features." 
  },
  METHODS: [
    { name: "bKash", detail: "01517992585", icon: "fa-solid fa-mobile-screen" },
    { name: "Nagad", detail: "01517992585", icon: "fa-solid fa-mobile-screen" },
    { name: "Buy Me a Coffee", detail: "buymeacoffee.com/yourname", icon: "fa-solid fa-mug-hot" }
  ]
};

export const COPYRIGHT_NOTICE = {
  TITLE: { bn: "কপিরাইট সচেতনতা", en: "Copyright Awareness" },
  MESSAGE: {
    bn: "এই অ্যাপ্লিকেশনের ডিজাইন এবং এআই লজিক সংরক্ষিত। বিনা অনুমতিতে এর বাণিজ্যিক ব্যবহার বা রি-প্রোডাকশন আইনত দণ্ডনীয়। প্রযুক্তির সঠিক এবং নৈতিক ব্যবহার নিশ্চিত করুন।",
    en: "The design and AI logic of this application are protected. Commercial use or reproduction without permission is strictly prohibited. Ensure the ethical use of technology."
  }
};

export const FEEDBACK_CONTACT = {
  TITLE: { bn: "পরিবর্তন বা পরিমার্জন", en: "Updates & Feedback" },
  MESSAGE: {
    bn: "অ্যাপের কোনো ফিচারে পরিবর্তন বা নতুন আইডিয়া থাকলে আমাদের সাথে শেয়ার করুন। আপনার মতামত আমাদের জন্য অত্যন্ত মূল্যবান।",
    en: "Share your ideas for new features or improvements. Your feedback is highly valuable to us."
  },
  EMAIL: "support@qrgeneratorbd.com"
};
