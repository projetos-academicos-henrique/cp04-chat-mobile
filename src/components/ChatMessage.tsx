import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ChatMessage as ChatMessageType } from '../types/chat';
import { formatMessageTime } from '../utils/formatters';

interface Props {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<Props> = memo(({ message, isCurrentUser }) => {
  const timeFormatted = formatMessageTime(message.createdAt);

  return (
    <View
      style={[
        styles.row,
        isCurrentUser ? styles.rowSent : styles.rowReceived,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        <Text style={[styles.text, isCurrentUser ? styles.textSent : styles.textReceived]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isCurrentUser ? styles.timeSent : styles.timeReceived]}>
          {timeFormatted}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  rowSent: {
    justifyContent: 'flex-end',
  },
  rowReceived: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 0, // Regra obrigatória: sem bordas arredondadas
  },
  bubbleSent: {
    backgroundColor: '#ed145b',
    borderWidth: 1,
    borderColor: '#ff3a7a',
  },
  bubbleReceived: {
    backgroundColor: '#161a1c',
    borderWidth: 1,
    borderColor: '#ACC1CC',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
  },
  textSent: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  textReceived: {
    color: '#E0E0E0',
    fontWeight: '400',
  },
  time: {
    fontFamily: 'Roboto',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  timeSent: {
    color: '#ffc1d3',
  },
  timeReceived: {
    color: '#ACC1CC',
  },
});
