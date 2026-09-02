import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ChatUser } from '../types/user';
import type { ChatMessage, Conversation } from '../types/chat';
import { getOrCreateConversation, sendMessage, subscribeToMessages } from '../services/chatService';

export interface UseChatResult {
  messages: ChatMessage[];
  conversation: Conversation | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  sendTextMessage: (text: string) => Promise<void>;
  clearChatError: () => void;
}

export function useChat(currentUser: ChatUser | null, targetUser: ChatUser): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearChatError = useCallback(() => {
    setError(null);
  }, []);

  // Inicializa a conversa e o listener em tempo real
  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    let unsubscribeMessages: (() => void) | null = null;

    setLoading(true);
    setError(null);

    getOrCreateConversation(currentUser, targetUser)
      .then((conv) => {
        if (!isMounted) return;
        setConversation(conv);

        // Ouve mensagens no Realtime Database em tempo real
        unsubscribeMessages = subscribeToMessages(conv.id, (loadedMessages) => {
          if (!isMounted) return;
          // Atualização imutável do estado
          setMessages([...loadedMessages]);
          setLoading(false);
        });
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Falha ao carregar conversa.';
        setError(msg);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [currentUser, targetUser]);

  // Envio de mensagem com preservação de imutabilidade
  const sendTextMessage = useCallback(
    async (text: string) => {
      if (!currentUser || !conversation) {
        setError('Conversa não inicializada.');
        return;
      }

      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      setSending(true);
      setError(null);

      try {
        const newMessage = await sendMessage(
          conversation.id,
          currentUser.uid,
          targetUser.uid,
          trimmed
        );

        // Atualização respeitando rigorosamente a regra de imutabilidade
        setMessages((previous) => {
          // Evita duplicatas caso o snapshot do listener chegue rapidamente
          if (previous.some((m) => m.id === newMessage.id)) {
            return previous;
          }
          return [...previous, newMessage];
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Falha ao enviar mensagem.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setSending(false);
      }
    },
    [currentUser, targetUser, conversation]
  );

  // Ordenação memoizada das mensagens por timestamp
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => a.createdAt - b.createdAt);
  }, [messages]);

  return {
    messages: sortedMessages,
    conversation,
    loading,
    sending,
    error,
    sendTextMessage,
    clearChatError,
  };
}
