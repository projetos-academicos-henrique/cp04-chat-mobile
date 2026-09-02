import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';

interface Props {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<Props> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <AlertCircle size={18} color="#ed145b" style={styles.alertIcon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>ATENÇÃO</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={16} color="#ACC1CC" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#200810',
    borderLeftWidth: 4,
    borderLeftColor: '#ed145b',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#3e101f',
    borderRadius: 0,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertIcon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  message: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 13,
    lineHeight: 18,
  },
  dismissButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 0,
  },
});
