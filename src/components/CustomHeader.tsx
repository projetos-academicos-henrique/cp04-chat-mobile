import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, LogOut } from 'lucide-react-native';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightActionText?: string;
  onRightAction?: () => void;
}

export const CustomHeader: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  rightActionText,
  onRightAction,
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={14} color="#ACC1CC" style={styles.backIcon} />
              <Text style={styles.backText}>VOLTAR</Text>
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightActionText && onRightAction && (
          <TouchableOpacity onPress={onRightAction} style={styles.rightButton}>
            {rightActionText.toUpperCase() === 'SAIR' && (
              <LogOut size={13} color="#ed145b" style={styles.rightIcon} />
            )}
            <Text style={styles.rightButtonText}>{rightActionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#121517',
    borderBottomWidth: 1,
    borderBottomColor: '#343A3C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#202528',
    borderWidth: 1,
    borderColor: '#343A3C',
    borderRadius: 0,
  },
  backIcon: {
    marginRight: 4,
  },
  backText: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 12,
    marginTop: 2,
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#200810',
    borderWidth: 1,
    borderColor: '#ed145b',
    borderRadius: 0,
    marginLeft: 8,
  },
  rightIcon: {
    marginRight: 6,
  },
  rightButtonText: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
