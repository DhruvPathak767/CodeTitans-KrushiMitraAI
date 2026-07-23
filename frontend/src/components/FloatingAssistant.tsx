import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, Send, Mic } from 'lucide-react';
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

  // Don't show on chatbot page (it's redundant)
  if (location.pathname === '/app/chatbot') return null;

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
    }, 900 + Math.random() * 600);
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
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow no-tap"
        aria-label="AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-sky-400 ring-2 ring-white dark:ring-[#090b0f]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-5 z-40 flex h-[460px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl glass-strong shadow-card"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 bg-gradient-to-r from-brand-500/10 to-sky-500/10 px-4 py-3">
              <div className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-1.5 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('chat.title')}</p>
                <p className="text-[10px] text-brand-600 dark:text-brand-400">● Online</p>
              </div>
              <button onClick={() => navigate('/app/chatbot')} className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
                {t('common.viewAll')}
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-hide">
              {msgs.length === 0 && (
                <div className="space-y-3">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/5 px-3 py-2.5 text-sm">
                    {t('chat.welcome')}
                  </div>
                  <p className="px-1 text-xs text-slate-400">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {chatSuggestions[lang].map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 transition-colors hover:bg-brand-500/15"
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
                      'max-w-[85%] rounded-2xl px-3 py-2.5 text-sm',
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-brand-600 text-white'
                        : 'rounded-tl-sm bg-slate-100 dark:bg-white/5',
                    )}
                  >
                    {m.text}
                    {m.confidence && (
                      <p className="mt-1.5 text-[10px] opacity-60">{t('common.confidence')}: {m.confidence}%</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/5 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-slate-400 animate-typing"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200/60 dark:border-white/5 p-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={startVoice}
                  className={cn(
                    'grid place-items-center rounded-xl p-2.5 transition-colors',
                    listening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-white/10',
                  )}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send(input)}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  className="grid place-items-center rounded-xl bg-brand-600 p-2.5 text-white transition-transform hover:scale-105 disabled:opacity-40"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
