import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  sending?: boolean;
}

export const ChatInput: React.FC<Props> = memo(
  ({ value, onChangeText, onSend, disabled = false, sending = false }) => {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#78848c"
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && !sending}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={onSend}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.sendButton,
            (!value.trim() || disabled || sending) && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={!value.trim() || disabled || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Send size={15} color="#FFFFFF" style={styles.sendIcon} />
              <Text style={styles.sendButtonText}>ENVIAR</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#101314',
    borderTopWidth: 1,
    borderTopColor: '#343A3C',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#191e20',
    borderWidth: 1,
    borderColor: '#ACC1CC',
    borderRadius: 0,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#ed145b',
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3375',
  },
  sendIcon: {
    marginRight: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#401524',
    borderColor: '#521d30',
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
