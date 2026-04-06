import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, MessageCircle, Bot, X } from 'lucide-react';
import { useChat } from './ChatContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const MessageBubble = ({ role, content }: { role: 'user' | 'assistant'; content: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 mb-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div className={`max-w-[70%] p-3 rounded-2xl ${role === 'user' 
      ? 'bg-primary text-primary-foreground' 
      : 'glass-strong bg-white/5 backdrop-blur-sm border border-border/50'
    }`}>
      {content}
    </div>
    <Avatar className="w-8 h-8 flex-shrink-0">
      <AvatarImage src={role === 'user' ? undefined : '/school-logo.png'} />
      <AvatarFallback className={role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}>
        {role === 'user' ? '👤' : <Bot className="w-4 h-4" />}
      </AvatarFallback>
    </Avatar>
  </motion.div>
);

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const { messages, loading, handleSend } = useChat();
  const { t } = useTranslation();
  const { toast } = useToast();
  const hasMessages = messages.length > 0;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      handleSend(input.trim());
      setInput('');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass-strong border-2 border-primary/50 shadow-2xl flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
          aria-label="Chat with AI tutor"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 w-[90vw] max-w-md glass-strong border-primary/30" aria-describedby="chat-description">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Science AI Tutor</h2>
            {hasMessages && <Badge variant="secondary">{messages.length}</Badge>}
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] p-4">
          <AnimatePresence>
            {messages.map((msg: any) => (
              <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-3 p-3 glass-strong rounded-2xl">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-muted-foreground">AI thinking...</span>
            </div>
          )}
          {!hasMessages && !loading && (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Ask about Chemistry or Physics!</p>
            </div>
          )}
        </ScrollArea>
        <div id="chat-description" className="sr-only">Chat with an AI science tutor about chemistry and physics topics</div>
        <form onSubmit={sendMessage} className="p-4 border-t border-border/50 gap-2 flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="sm" disabled={!input.trim() || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

