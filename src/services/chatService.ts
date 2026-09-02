import { ref, set, get, push, onValue, off, query, orderByChild, DataSnapshot } from 'firebase/database';
import { db } from './firebase';
import type { ChatUser } from '../types/user';
import type { ChatMessage, Conversation } from '../types/chat';
import { canCommunicate, getConversationId } from '../utils/chatRules';

interface ConversationRecord {
  id: string;
  participants: [string, string];
  createdAt: number;
}

interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: number;
}

export async function getOrCreateConversation(
  currentUser: ChatUser,
  targetUser: ChatUser
): Promise<Conversation> {
  if (!canCommunicate(currentUser, targetUser)) {
    throw new Error(
      `Comunicação não permitida entre ${currentUser.provider} e ${targetUser.provider}. Usuários com E-mail só conversam com Google/Apple e vice-versa.`
    );
  }

  const convId = getConversationId(currentUser.uid, targetUser.uid);
  const convRef = ref(db, `conversations/${convId}`);

  const snapshot = await get(convRef);
  if (snapshot.exists()) {
    const data = snapshot.val() as ConversationRecord;
    return {
      id: data.id,
      participants: data.participants,
      createdAt: data.createdAt,
    };
  }

  const newConversation: Conversation = {
    id: convId,
    participants: [currentUser.uid, targetUser.uid],
    createdAt: Date.now(),
  };

  await set(convRef, newConversation);
  return newConversation;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  receiverId: string,
  text: string
): Promise<ChatMessage> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('A mensagem não pode estar vazia.');
  }

  const messagesRef = ref(db, `messages/${conversationId}`);
  const newMsgRef = push(messagesRef);

  if (!newMsgRef.key) {
    throw new Error('Falha ao gerar identificador da mensagem no Firebase.');
  }

  const message: ChatMessage = {
    id: newMsgRef.key,
    conversationId,
    senderId,
    receiverId,
    text: trimmed,
    createdAt: Date.now(),
  };

  await set(newMsgRef, message);
  return message;
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const messagesRef = ref(db, `messages/${conversationId}`);
  const messagesQuery = query(messagesRef, orderByChild('createdAt'));

  const listener = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val() as Record<string, MessageRecord>;
    const list: ChatMessage[] = Object.keys(data)
      .map((key) => ({
        id: data[key].id || key,
        conversationId: data[key].conversationId,
        senderId: data[key].senderId,
        receiverId: data[key].receiverId,
        text: data[key].text,
        createdAt: data[key].createdAt,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

    callback(list);
  };

  onValue(messagesQuery, listener);

  return () => {
    off(messagesQuery, 'value', listener);
  };
}
