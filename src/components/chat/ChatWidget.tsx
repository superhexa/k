import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, MessageCircle, Bot, Sparkles, Copy, Check } from 'lucide-react';
import { useChat } from './ChatContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const MessageBubble = ({ role, content }: { role: 'user' | 'assistant'; content: string }) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 sm:gap-3 mb-4 group ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 mt-1">
          <AvatarImage src="/school-logo.png" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[75%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl transition-all ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm sm:rounded-br-lg shadow-md'
            : 'glass-strong bg-white/8 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-lg'
        }`}
      >
        <p className="text-sm sm:text-base leading-relaxed break-words">{content}</p>
        {!isUser && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            onClick={handleCopy}
            className="mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 text-gray-300"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </motion.button>
        )}
      </div>
      {isUser && (
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 mt-1">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { messages, loading, handleSend } = useChat();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const hasMessages = messages.length > 0;
  const isRTL = i18n.language === 'ar';

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      handleSend(input.trim());
      setInput('');
    }
  };

  const suggestedQuestions = [
    t('chat.suggestionChemistry', 'How does photosynthesis work?'),
    t('chat.suggestionPhysics', 'What is quantum mechanics?'),
    t('chat.suggestionFormula', 'Help me solve this formula'),
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:shadow-cyan-500/50 transition-all group border border-white/20"
          aria-label={t('chat.openChat', 'Open AI Tutor Chat')}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            {!hasMessages && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-white"
              />
            )}
          </motion.div>
        </motion.button>
      </SheetTrigger>
      <SheetContent
        side={isRTL ? 'left' : 'right'}
        className="p-0 w-full sm:w-[90vw] md:w-[500px] glass-strong border-l sm:border-l border-white/10 flex flex-col h-screen"
        aria-describedby="chat-description"
      >
        {/* Header */}
        <motion.div className="sticky top-0 z-10 p-3 sm:p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/80 to-cyan-500/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm sm:text-base">{t('chat.title', 'Science AI Tutor')}</h2>
                <p className="text-xs sm:text-sm text-white/70">{t('chat.subtitle', 'Chemistry & Physics Expert')}</p>
              </div>
            </div>
            {hasMessages && (
              <Badge variant="secondary" className="text-xs">
                {messages.length}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3 sm:p-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {!hasMessages && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full space-y-4 py-8"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                    {t('chat.welcome', 'Welcome! 🧪')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {t('chat.askAnything', 'Ask me anything about Chemistry or Physics')}
                  </p>
                </div>
                <div className="w-full space-y-2 mt-6">
                  {suggestedQuestions.map((q, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSend(q)}
                      className="w-full text-left p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-gray-300 transition-all group"
                    >
                      <span className="opacity-70 group-hover:opacity-100">{q}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            {messages.map((msg: any) => (
              <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 glass-strong rounded-lg bg-white/5"
              >
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-cyan-400" />
                <span className="text-xs sm:text-sm text-gray-300">{t('chat.thinking', 'AI thinking...')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Input Area */}
        <div className="sticky bottom-0 p-3 sm:p-4 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-sm">
          <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder', 'Ask a question...')}
              disabled={loading}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm sm:text-base rounded-lg sm:rounded-xl"
              maxLength={1000}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg disabled:opacity-50 px-3 sm:px-4 rounded-lg sm:rounded-xl"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">{t('chat.charactersRemaining', `${1000 - input.length} characters left`)}</p>
        </div>

        <div id="chat-description" className="sr-only">
          {t('chat.description', 'Chat with an AI science tutor about chemistry and physics topics')}
        </div>
      </SheetContent>
    </Sheet>
  );
}

