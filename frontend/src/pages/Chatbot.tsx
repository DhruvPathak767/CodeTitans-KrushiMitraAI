import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Sparkles, Plus, Volume2, VolumeX, Cpu, Trash2, Search, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '@/i18n/AppContext';
import { chatSuggestions } from '@/data/ai';
import { cn } from '@/components/ui';
import { sendChatMessageApi, getChatHistoryApi, clearChatHistoryApi, ChatMessageItem } from '@/api/chat';

export function Chatbot() {
  const { t, lang } = useApp();
  const [msgs, setMsgs] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch live chat history from MongoDB on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        setLoadingHistory(true);
        const history = await getChatHistoryApi();
        setMsgs(history || []);
      } catch (err) {
        console.warn('Failed to load chat history:', err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  async function send(text: string) {
    if (!text.trim() || typing) return;
    const userPrompt = text.trim();

    // Optimistically render user message
    const tempUserMsg: ChatMessageItem = { role: 'user', content: userPrompt };
    setMsgs((p) => [...p, tempUserMsg]);
    setInput('');
    setTyping(true);

    try {
      const response = await sendChatMessageApi(userPrompt);
      setMsgs((p) => [...p, response.message]);
      speak(response.message.content);
    } catch (err: any) {
      console.error('Chat AI request failed:', err);
      setMsgs((p) => [
        ...p,
        {
          role: 'assistant',
          content: 'I apologize, I am experiencing temporary network connectivity issues with the AI service.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  const handleClearHistory = async () => {
    setMsgs([]);
    await clearChatHistoryApi();
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState<number | null>(null);

  // Monitor SpeechSynthesis onEnd / onError
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMsgIndex(null);
  }

  function speak(text: string, index?: number) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[#*`_~]/g, ''); // strip markdown for speech
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    u.rate = 0.95;

    u.onstart = () => {
      setIsSpeaking(true);
      if (index !== undefined) setSpeakingMsgIndex(index);
    };

    u.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgIndex(null);
    };

    u.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgIndex(null);
    };

    window.speechSynthesis.speak(u);
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = (e: any) => send(e.results[0][0].transcript);
    recog.start();
  }

  const filteredHistory = msgs.filter(
    (m) => searchQuery === '' || m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {msgs.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="btn-ghost text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" /> Clear Chat History
          </button>
        )}
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left History Sidebar */}
        <div className="hidden w-64 shrink-0 flex-col md:flex glass-strong rounded-3xl p-4 border border-white/40 dark:border-white/10 shadow-card">
          <button
            onClick={handleClearHistory}
            className="btn-primary mb-3 w-full text-xs shadow-glow flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> {t('chat.new')}
          </button>

          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat..."
              className="w-full rounded-xl bg-slate-200/50 dark:bg-white/5 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-brand-500"
            />
          </div>

          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('chat.sidebarTitle')}</p>
          
          <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide mt-2">
            {loadingHistory ? (
              <div className="py-4 text-center text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" /> Loading...
              </div>
            ) : filteredHistory.length === 0 ? (
              <p className="text-[11px] text-slate-400 p-2">No previous conversations.</p>
            ) : (
              filteredHistory
                .filter((m) => m.role === 'user')
                .slice(-8)
                .reverse()
                .map((c, i) => (
                  <div key={i} className="w-full rounded-2xl glass p-3 text-left transition-all hover:border-brand-500/40">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{c.content}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400 font-mono">
                      {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Main Conversation Box */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl glass-strong border border-white/40 dark:border-white/10 shadow-card">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-hide">
            {msgs.length === 0 && !typing && (
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
                key={m._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm relative group',
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                      : 'rounded-tl-sm glass border border-white/40 dark:border-white/10 text-slate-800 dark:text-slate-100',
                  )}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  {m.role === 'assistant' && (
                    isSpeaking && speakingMsgIndex === i ? (
                      <button
                        onClick={stopSpeaking}
                        className="ml-2 mt-2 inline-flex items-center gap-1.5 rounded-xl bg-red-500/20 border border-red-500/30 px-2.5 py-1 text-xs font-bold text-red-500 hover:bg-red-500/30 transition-all animate-pulse"
                        title="Stop Audio"
                      >
                        <VolumeX className="h-3.5 w-3.5 inline" /> Stop Audio
                      </button>
                    ) : (
                      <button
                        onClick={() => speak(m.content, i)}
                        className="ml-2 mt-2 inline-flex items-center gap-1 text-brand-500 hover:scale-105 transition-transform text-xs font-bold"
                        title="Listen Audio"
                      >
                        <Volume2 className="h-4 w-4 inline" /> Listen
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-3xl rounded-tl-sm glass px-5 py-4 border border-white/40 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-400 animate-pulse">KrishiMitra AI is thinking</span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-brand-500 animate-ping"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
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
                disabled={!input.trim() || typing}
                className="grid place-items-center rounded-2xl bg-brand-600 p-3 text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-40"
              >
                {typing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
