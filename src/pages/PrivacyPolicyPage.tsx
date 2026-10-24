import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-cyan-400" />
        <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Legal Document</span>
      </div>
      <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-400 font-mono">Effective Date: October 2026 · PlayZone Platform</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
        <p>
          PlayZone values your privacy. We do not require registration or personal data collection to enjoy our free online games. Game scores, favorite lists, and audio settings are stored locally in your browser's LocalStorage and are not sent to any centralized tracking servers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">2. Browser Storage & Cookies</h2>
        <p>
          We utilize standard web technologies such as HTML5 LocalStorage to maintain your high scores and game progress across sessions. You may clear your browser data at any time to remove these records.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">3. Third-Party Advertisements</h2>
        <p>
          PlayZone includes mock and potential advertising integration slots designed for Google AdSense. In production, third-party advertising partners may use cookies to serve ads based on prior visits to our or other websites.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">4. Academic & University Scope</h2>
        <p>
          This website is built for university web engineering laboratory demonstration and educational purposes. No commercial data harvesting occurs on this platform.
        </p>
      </section>
    </div>
  );
};
