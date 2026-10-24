import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  const faqs = [
    {
      q: 'Are all games on PlayZone completely free?',
      a: 'Yes! Every game in our directory is 100% free to play directly inside your web browser. No subscriptions or hidden fees.',
    },
    {
      q: 'Do I need to install any software or extensions?',
      a: 'No installation is ever required. All games run on native HTML5 Canvas, JavaScript, and Web Audio.',
    },
    {
      q: 'How are high scores saved?',
      a: 'Your scores are stored locally in your browser storage so you can track personal bests and see your rank in the local Hall of Fame.',
    },
    {
      q: 'Can I play on mobile or tablet devices?',
      a: 'Yes. All games are fully responsive and include touch controls or on-screen directional pads for mobile devices.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Contact & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Support</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Have questions, suggestions, or feedback about the gaming portal? Drop our university engineering team a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#172033] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Message Received!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                Thank you for contacting PlayZone. Your feedback has been logged for evaluation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-white mb-2">Send us a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Game suggestion or Bug report"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with PlayZone?"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Info & FAQ (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#172033] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> Lab Examination Contact
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This application was developed as a university lab engineering project demonstration.
            </p>
            <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-400 block font-mono">Department of Computer Science & Engineering</span>
              <span className="text-cyan-400 font-bold">PlayZone Web Project v1.0</span>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-[#172033] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-purple-400" /> Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-200 bg-[#0B1020]/60 hover:bg-[#0B1020]"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="p-3 bg-[#0B1020]/40 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
