import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, Send, Mic, ScanLine, PhoneCall, Volume2 } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { generateAIResponse, chatSuggestions } from '@/data/ai';
import { cn } from '@/components/ui';

interface Msg {
  role: 'user' | 'ai';
  text: string;
  confidence?: number;
}

export function FloatingAssistant() {
  const { t, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  if (location.pathname === '/app/chatbot') return null;

  function speakText(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    window.speechSynthesis.speak(u);
  }

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { role: 'user', text };
    setMsgs((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = generateAIResponse(text, lang);
      setMsgs((p) => [...p, { role: 'ai', text: res.text, confidence: res.confidence }]);
      setTyping(false);
      speakText(res.text);
    }, 800);
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setListening(false);
      return;
    }
    const recog = new SR();
    recog.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript;
      send(text);
    };
    recog.start();
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <span className="absolute -inset-2 rounded-3xl bg-brand-500/20 animate-pulseRing pointer-events-none" />
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          onClick={() => setOpen((o) => !o)}
          className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-sky-600 text-white shadow-glow border border-white/30 hover:scale-105 transition-transform no-tap"
          aria-label="AI Assistant"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="h-7 w-7" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Sparkles className="h-7 w-7" />
              </motion.div>
            )}
          </AnimatePresence>
          {!open && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px] font-black text-slate-900 ring-2 ring-white">
              AI
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-6 z-40 flex h-[500px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-3xl glass-strong shadow-card border border-white/40 dark:border-white/10"
          >
            {/* Future Header */}
            <div className="flex items-center justify-between border-b border-white/40 dark:border-white/10 bg-gradient-to-r from-brand-500/15 via-slate-900/5 to-sky-500/15 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-500 p-2 text-white shadow-glow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold font-display leading-tight">{t('chat.title')}</p>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">● Active Voice Node</p>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setOpen(false); navigate('/app/disease'); }}
                  className="rounded-xl p-2 hover:bg-brand-500/15 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Scan Disease"
                >
                  <ScanLine className="h-4 w-4 text-brand-500" />
                </button>
                <a
                  href="tel:1551"
                  className="rounded-xl p-2 hover:bg-amber-500/15 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Kisan Helpline 1551"
                >
                  <PhoneCall className="h-4 w-4 text-amber-500" />
                </a>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-hide">
              {msgs.length === 0 && (
                <div className="space-y-3">
                  <div className="rounded-2xl rounded-tl-sm glass p-3 text-xs leading-relaxed border border-brand-500/20">
                    👋 {t('chat.welcome')}
                  </div>
                  <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick AI Questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chatSuggestions[lang].map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 transition-all hover:bg-brand-500/20 hover:scale-105"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm relative group',
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                        : 'rounded-tl-sm glass border border-white/40 dark:border-white/10',
                    )}
                  >
                    {m.text}
                    {m.role === 'ai' && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="ml-2 inline-block text-brand-500 hover:scale-110 transition-transform"
                        title="Listen"
                      >
                        <Volume2 className="h-3 w-3 inline" />
                      </button>
                    )}
                    {m.confidence && (
                      <p className="mt-1 text-[9px] opacity-75 font-mono">Confidence: {m.confidence}%</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm glass px-4 py-3 border border-white/40 dark:border-white/10">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-brand-500 animate-typing"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-white/40 dark:border-white/10 p-3 bg-white/40 dark:bg-slate-900/40">
              <div className="flex items-center gap-2">
                <button
                  onClick={startVoice}
                  className={cn(
                    'grid place-items-center rounded-xl p-2.5 transition-colors',
                    listening ? 'bg-red-500 text-white animate-pulse' : 'glass hover:border-brand-500/40 text-slate-700 dark:text-slate-200',
                  )}
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send(input)}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-xs outline-none focus:border-brand-500"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  className="grid place-items-center rounded-xl bg-brand-600 p-2.5 text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
