import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Globe, Apple, ChevronRight } from 'lucide-react-native';
import type { ChatUser, AuthProvider } from '../types/user';
import { getInitials } from '../utils/formatters';
import { getProviderBadgeColor, getProviderDisplayName } from '../utils/chatRules';

interface Props {
  user: ChatUser;
  onPress: (user: ChatUser) => void;
}

const ProviderIcon: React.FC<{ provider: AuthProvider; color: string }> = ({ provider, color }) => {
  switch (provider) {
    case 'password':
      return <Mail size={12} color={color} style={styles.badgeIcon} />;
    case 'google':
      return <Globe size={12} color={color} style={styles.badgeIcon} />;
    case 'apple':
      return <Apple size={12} color={color} style={styles.badgeIcon} />;
    default:
      return null;
  }
};

export const UserItem: React.FC<Props> = memo(({ user, onPress }) => {
  const badgeColor = getProviderBadgeColor(user.provider);
  const providerLabel = getProviderDisplayName(user.provider);
  const initials = getInitials(user.name);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.container}
      onPress={() => onPress(user)}
    >
      <View style={[styles.avatar, { borderColor: badgeColor }]}>
        <Text style={[styles.avatarText, { color: badgeColor }]}>{initials}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        {user.email && (
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
        )}
      </View>

      <View style={[styles.badge, { borderColor: badgeColor }]}>
        <ProviderIcon provider={user.provider} color={badgeColor} />
        <Text style={[styles.badgeText, { color: badgeColor }]}>{providerLabel}</Text>
      </View>

      <ChevronRight size={18} color="#455057" style={styles.chevron} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#15191b',
    borderWidth: 1,
    borderColor: '#262c2f',
    borderRadius: 0,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: '#0a0c0d',
    borderWidth: 1.5,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  email: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 0,
    backgroundColor: '#0d1011',
  },
  badgeIcon: {
    marginRight: 5,
  },
  badgeText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chevron: {
    marginLeft: 8,
  },
});
