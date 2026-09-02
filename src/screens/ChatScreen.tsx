import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import type { RootStackParamList } from '../types/navigation';
import type { ChatMessage as ChatMessageType } from '../types/chat';
import { getProviderDisplayName } from '../utils/chatRules';
import { GradientBackground } from '../components/GradientBackground';
import { CustomHeader } from '../components/CustomHeader';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { targetUser } = route.params;
  const { currentUser } = useAuth();
  const { messages, loading, sending, error, sendTextMessage, clearChatError } = useChat(
    currentUser,
    targetUser
  );

  const [inputText, setInputText] = useState<string>('');
  const flatListRef = useRef<FlatList<ChatMessageType>>(null);

  // Rolagem automática para o fim da lista quando novas mensagens chegam
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const textToSend = inputText.trim();
    if (!textToSend || sending) return;

    setInputText('');
    try {
      await sendTextMessage(textToSend);
    } catch {
      // Caso ocorra falha, restaura o texto para que o usuário não perca a mensagem
      setInputText(textToSend);
    }
  }, [inputText, sending, sendTextMessage]);

  const targetProviderLabel = useMemo(
    () => getProviderDisplayName(targetUser.provider),
    [targetUser.provider]
  );

  const renderMessageItem = useCallback(
    ({ item }: { item: ChatMessageType }) => {
      const isCurrentUser = item.senderId === currentUser?.uid;
      return <ChatMessage message={item} isCurrentUser={isCurrentUser} />;
    },
    [currentUser?.uid]
  );

  const keyExtractor = useCallback((item: ChatMessageType) => item.id, []);

  return (
    <GradientBackground>
      <CustomHeader
        title={targetUser.name}
        subtitle={`Via ${targetProviderLabel}`}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {error && (
          <View style={styles.errorWrapper}>
            <ErrorMessage message={error} onDismiss={clearChatError} />
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <Loading message="Sincronizando mensagens em tempo real..." />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: false });
              }
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>CONVERSA 1-PARA-1 INICIADA</Text>
                  <Text style={styles.emptyDescription}>
                    Você e {targetUser.name} estão conectados pelo Realtime Database.
                  </Text>
                  <Text style={styles.emptyHint}>
                    Nenhuma mensagem enviada ainda. Digite algo abaixo para começar!
                  </Text>
                </View>
              </View>
            }
          />
        )}

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          disabled={loading}
          sending={sending}
        />
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorWrapper: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyBox: {
    backgroundColor: '#121517',
    borderWidth: 1,
    borderColor: '#292f32',
    borderRadius: 0,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  emptyTitle: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 12,
    textAlign: 'center',
  },
});
