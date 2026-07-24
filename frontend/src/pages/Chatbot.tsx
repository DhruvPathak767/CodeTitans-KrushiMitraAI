import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, Plus, Volume2, Cpu, Activity } from 'lucide-react';
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
      speak(res.text);
    }, 800);
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
    <div className="flex h-[calc(100vh-8.5rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 mb-1 border border-brand-500/20">
            <Cpu className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
            <span>{t('chat.engineLabel')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('chat.title')}</h1>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left History Sidebar */}
        <div className="hidden w-64 shrink-0 flex-col md:flex glass-strong rounded-3xl p-4 border border-white/40 dark:border-white/10 shadow-card">
          <button
            onClick={() => setMsgs([])}
            className="btn-primary mb-3 w-full text-xs shadow-glow"
          >
            <Plus className="h-4 w-4" /> {t('chat.new')}
          </button>
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('chat.sidebarTitle')}</p>
          <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide mt-2">
            {[
              { title: 'Weather this week', time: '2m ago' },
              { title: 'Leaf blight treatment', time: '1h ago' },
              { title: 'Best time to sell tomato', time: '3h ago' },
              { title: 'PM-Kisan eligibility', time: '1d ago' },
              { title: 'Fertilizer for wheat', time: '2d ago' },
            ].map((c, i) => (
              <button key={i} className="w-full rounded-2xl glass p-3 text-left transition-all hover:border-brand-500/40">
                <p className="truncate text-xs font-bold">{c.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-400 font-mono">{c.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Conversation Box */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl glass-strong border border-white/40 dark:border-white/10 shadow-card">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-hide">
            {msgs.length === 0 && (
              <div className="space-y-4 max-w-lg mx-auto py-8 text-center">
                <div className="grid place-items-center rounded-3xl bg-gradient-to-br from-brand-500/20 to-sky-500/20 p-5 mx-auto w-16 h-16 shadow-glow">
                  <Sparkles className="h-8 w-8 text-brand-500 animate-spin-slow" />
                </div>
                <h3 className="font-display text-xl font-extrabold gradient-text">{t('chat.welcome')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('chat.askHint')}</p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {chatSuggestions[lang].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-2xl glass px-4 py-2 text-xs font-bold text-brand-700 dark:text-brand-300 border border-brand-500/30 hover:border-brand-500 hover:scale-105 transition-all shadow-sm"
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
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm relative group',
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                      : 'rounded-tl-sm glass border border-white/40 dark:border-white/10',
                  )}
                >
                  {m.text}
                  {m.role === 'ai' && (
                    <button
                      onClick={() => speak(m.text)}
                      className="ml-2.5 inline-block text-brand-500 hover:scale-110 transition-transform"
                      title="Listen Audio"
                    >
                      <Volume2 className="h-4 w-4 inline" />
                    </button>
                  )}
                  {m.confidence && (
                    <p className="mt-2 text-[10px] opacity-75 font-mono">Telemetry Confidence: {m.confidence}%</p>
                  )}
                </div>
              </motion.div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-sm glass px-5 py-4 border border-white/40 dark:border-white/10">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-typing"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Controls */}
          <div className="border-t border-white/40 dark:border-white/10 p-4 bg-white/40 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <button
                onClick={startVoice}
                className={cn(
                  'grid place-items-center rounded-2xl p-3 transition-all',
                  listening ? 'bg-red-500 text-white animate-pulse shadow-glow' : 'glass hover:border-brand-500/40 text-slate-700 dark:text-slate-200',
                )}
                title="Speech-to-Text Input"
              >
                <Mic className="h-5 w-5" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder={t('chat.placeholder')}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-xs sm:text-sm outline-none focus:border-brand-500"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="grid place-items-center rounded-2xl bg-brand-600 p-3 text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-40"
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
