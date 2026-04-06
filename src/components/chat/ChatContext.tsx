import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { generateChemPhysicsResponse } from '@/lib/google-ai';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Action = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_CHAT' };

const ChatContext = createContext<any>(null);

const chatReducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_CHAT':
      return { ...state, messages: [], loading: false };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, { messages: [], loading: false });
  const { toast } = useToast();
  const { t } = useTranslation();

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
      addMessage('assistant', t('chat.errorMessage', 'Sorry, I encountered an error. Please try again.'));
      toast({ 
        variant: 'destructive', 
        title: t('chat.error', 'AI Error'), 
        description: t('chat.errorDescription', 'Could not connect to the AI service. Please check your settings.')
      });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
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


