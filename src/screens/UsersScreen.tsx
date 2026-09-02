import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { User as UserIcon, Info, Users as UsersIcon } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { subscribeToUsers } from '../services/userService';
import { canCommunicate, getProviderDisplayName, getProviderBadgeColor } from '../utils/chatRules';
import type { ChatUser } from '../types/user';
import type { RootStackParamList } from '../types/navigation';
import { GradientBackground } from '../components/GradientBackground';
import { CustomHeader } from '../components/CustomHeader';
import { UserItem } from '../components/UserItem';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Users'>;

export const UsersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { currentUser, logoutUser, error: authError } = useAuth();

  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ouve usuários cadastrados em tempo real no Realtime Database com limpeza de listener
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToUsers((usersList) => {
      setAllUsers(usersList);
      setLoading(false);
      setRefreshing(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // FILTRO OBRIGATÓRIO: Apenas contatos compatíveis com a regra do provedor
  // e impedindo conversa consigo mesmo
  const compatibleUsers = useMemo<ChatUser[]>(() => {
    if (!currentUser) return [];
    return allUsers.filter((other) => canCommunicate(currentUser, other));
  }, [allUsers, currentUser]);

  const handleSelectUser = useCallback(
    (targetUser: ChatUser) => {
      navigation.navigate('Chat', { targetUser });
    },
    [navigation]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao encerrar sessão.');
    }
  }, [logoutUser]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const userProviderLabel = currentUser ? getProviderDisplayName(currentUser.provider) : '';
  const userBadgeColor = currentUser ? getProviderBadgeColor(currentUser.provider) : '#ACC1CC';

  return (
    <GradientBackground>
      <CustomHeader
        title="CONTATOS"
        subtitle="Chat 1-para-1"
        rightActionText="SAIR"
        onRightAction={handleLogout}
      />

      {/* Cartão de Perfil do Usuário Logado */}
      {currentUser && (
        <View style={styles.profileBar}>
          <View style={styles.profileInfo}>
            <View style={styles.profileLabelRow}>
              <UserIcon size={12} color="#ed145b" style={styles.profileLabelIcon} />
              <Text style={styles.profileLabel}>CONECTADO COMO</Text>
            </View>
            <Text style={styles.profileName} numberOfLines={1}>
              {currentUser.name}
            </Text>
            {currentUser.email && (
              <Text style={styles.profileEmail} numberOfLines={1}>
                {currentUser.email}
              </Text>
            )}
          </View>
          <View style={[styles.profileBadge, { borderColor: userBadgeColor }]}>
            <Text style={[styles.profileBadgeText, { color: userBadgeColor }]}>
              {userProviderLabel}
            </Text>
          </View>
        </View>
      )}

      {/* Regra de comunicação ativa */}
      <View style={styles.ruleBanner}>
        <Info size={14} color="#ACC1CC" style={styles.ruleBannerIcon} />
        <Text style={styles.ruleBannerText}>
          {currentUser?.provider === 'password'
            ? 'Você está autenticado com E-mail. Só pode conversar com usuários Google ou Apple.'
            : 'Você está autenticado com Google/Apple. Só pode conversar com usuários de E-mail.'}
        </Text>
      </View>

      <View style={styles.container}>
        {(error || authError) && (
          <ErrorMessage message={error || authError || ''} onDismiss={() => setError(null)} />
        )}

        {loading ? (
          <Loading message="Carregando contatos compatíveis..." />
        ) : (
          <FlatList
            data={compatibleUsers}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <UserItem user={item} onPress={handleSelectUser} />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ed145b"
                colors={['#ed145b']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyBox}>
                  <UsersIcon size={36} color="#ed145b" style={styles.emptyIcon} />
                  <Text style={styles.emptyTitle}>NENHUM CONTATO COMPATÍVEL</Text>
                  <Text style={styles.emptyDescription}>
                    Não há outros usuários disponíveis para conversa com as regras atuais do seu provedor.
                  </Text>
                  <Text style={styles.emptyHint}>
                    {currentUser?.provider === 'password'
                      ? 'Cadastre ou conecte um usuário via Google ou Apple para iniciar um chat 1-para-1.'
                      : 'Cadastre ou conecte um usuário com E-mail/Senha para iniciar um chat 1-para-1.'}
                  </Text>
                </View>
              </View>
            }
          />
        )}
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121517',
    borderBottomWidth: 1,
    borderBottomColor: '#252a2d',
  },
  profileInfo: {
    flex: 1,
    marginRight: 10,
  },
  profileLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLabelIcon: {
    marginRight: 4,
  },
  profileLabel: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  profileName: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  profileEmail: {
    color: '#8d989f',
    fontFamily: 'Roboto',
    fontSize: 12,
    marginTop: 1,
  },
  profileBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
    backgroundColor: '#0a0d0e',
  },
  profileBadgeText: {
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c171a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#341d26',
  },
  ruleBannerIcon: {
    marginRight: 8,
  },
  ruleBannerText: {
    flex: 1,
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
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
  emptyIcon: {
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyHint: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
