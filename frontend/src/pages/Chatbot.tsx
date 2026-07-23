import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, Plus, Volume2, User } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { generateAIResponse, chatSuggestions } from '@/data/ai';
import { cn } from '@/components/ui';

interface Msg {
  role: 'user' | 'ai';
  text: string;
  confidence?: number;
  actions?: string[];
  impact?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function Chatbot() {
  const { t, lang } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = generateAIResponse(text, lang);
      setMsgs((p) => [...p, {
        role: 'ai',
        text: res.text,
        confidence: res.confidence,
        actions: res.actions,
        impact: res.impact,
        priority: res.priority,
      }]);
      setTyping(false);
      // Voice output
      speak(res.text);
    }, 800 + Math.random() * 600);
  }

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = (e: SpeechRecognitionEvent) => send(e.results[0][0].transcript);
    recog.start();
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('chat.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('chat.subtitle')}</p>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Chat history sidebar */}
        <div className="hidden w-56 shrink-0 flex-col md:flex">
          <button
            onClick={() => setMsgs([])}
            className="btn-primary mb-3 w-full text-sm"
          >
            <Plus className="h-4 w-4" /> {t('chat.new')}
          </button>
          <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {[
              { title: 'Weather this week', time: '2m ago' },
              { title: 'Leaf blight treatment', time: '1h ago' },
              { title: 'Best time to sell tomato', time: '3h ago' },
              { title: 'PM-Kisan eligibility', time: '1d ago' },
              { title: 'Fertilizer for wheat', time: '2d ago' },
            ].map((c, i) => (
              <button key={i} className="w-full rounded-2xl bg-slate-100/50 dark:bg-white/5 p-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
                <p className="truncate text-xs font-medium">{c.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{c.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl glass shadow-card">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-white/5 bg-gradient-to-r from-brand-500/10 to-sky-500/10 px-5 py-3">
            <div className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-2 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{t('chat.title')}</p>
              <p className="text-[10px] text-brand-600 dark:text-brand-400">● Online · {lang.toUpperCase()}</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-hide">
            {msgs.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="grid place-items-center rounded-3xl bg-gradient-to-br from-brand-500/20 to-sky-500/20 p-5"
                >
                  <Sparkles className="h-10 w-10 text-brand-500" />
                </motion.div>
                <p className="max-w-xs text-sm text-slate-600 dark:text-slate-300">{t('chat.welcome')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {chatSuggestions[lang].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-2 text-xs font-medium text-brand-700 dark:text-brand-300 transition-colors hover:bg-brand-500/15"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'ai' && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className={cn('max-w-[75%]', m.role === 'user' && 'order-first')}>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm',
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-brand-600 text-white'
                        : 'rounded-tl-sm bg-slate-100 dark:bg-white/5',
                    )}
                  >
                    {m.text}
                  </div>
                  {m.actions && (
                    <div className="mt-2 space-y-1.5 rounded-2xl bg-slate-50 dark:bg-white/5 p-3">
                      {m.actions.map((a, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs">
                          <span className="mt-0.5 text-brand-500">→</span>
                          <span>{a}</span>
                        </div>
                      ))}
                      {m.impact && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-sky-500/10 px-2.5 py-1.5 text-xs">
                          <span className="text-sky-600 dark:text-sky-400">📊</span>
                          <span><b>{t('common.impact')}: </b>{m.impact}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {m.confidence && (
                    <div className="mt-1.5 flex items-center gap-3 px-1">
                      <span className="text-[10px] text-slate-400">{t('common.confidence')}: {m.confidence}%</span>
                      {m.priority && (
                        <span className={cn(
                          'text-[10px] font-semibold',
                          m.priority === 'high' ? 'text-red-500' : m.priority === 'medium' ? 'text-amber-500' : 'text-sky-500',
                        )}>{t(`common.${m.priority}`)} {t('common.priority')}</span>
                      )}
                      <button onClick={() => speak(m.text)} className="text-[10px] text-slate-400 hover:text-brand-500">
                        <Volume2 className="h-3 w-3 inline" /> Listen
                      </button>
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-200 dark:bg-white/10">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200/60 dark:border-white/5 p-4">
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
                className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
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
        </div>
      </div>
    </div>
  );
}
