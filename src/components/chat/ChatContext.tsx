import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { generateChemPhysicsResponse } from '@/lib/google-ai';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Action = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean };

const ChatContext = createContext<any>(null);

const chatReducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, { messages: [], loading: false });
  const { toast } = useToast();

  useEffect(() => {
    if (state.messages.length > 0 && state.messages[state.messages.length - 1].role === 'user' && !state.loading) {
      handleSend(state.messages[state.messages.length - 1].content);
    }
  }, []);

  const addMessage = (role: Message['role'], content: string) => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_MESSAGE', payload: { id, role, content } });
  };

  const handleSend = async (content: string) => {
    addMessage('user', content);
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await generateChemPhysicsResponse(content);
    if (response) {
      addMessage('assistant', response);
    } else {
      addMessage('assistant', 'API key missing or error. Check console and .env');
      toast({ variant: 'destructive', title: 'AI Error', description: 'Set OPENROUTER_API_KEY in Vercel or VITE_OPENROUTER_API_KEY locally' });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'ADD_MESSAGE', payload: { id: 'clear', role: 'assistant' as const, content: '' } }); // Hack to clear
    // Better: add CLEAR_ALL action
  };

  return (
    <ChatContext.Provider value={{ ...state, addMessage, handleSend, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be inside ChatProvider');
  return context;
};

