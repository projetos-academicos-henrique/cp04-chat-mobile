import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MessageSquare,
  User as UserIcon,
  Mail,
  Lock,
  Globe,
  Apple as AppleIcon,
  Info,
} from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { GradientBackground } from '../components/GradientBackground';
import { ErrorMessage } from '../components/ErrorMessage';

export const LoginScreen: React.FC = () => {
  const { login, register, loginWithGoogle, loginWithApple, loading, error, clearError } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  const toggleMode = useCallback(() => {
    clearError();
    setLocalError(null);
    setIsRegisterMode((prev) => !prev);
  }, [clearError]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          setLocalError('Por favor, informe seu nome completo.');
          return;
        }
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch {
      // Erro já tratado e definido no contexto
    }
  }, [isRegisterMode, name, email, password, register, login, clearError]);

  const handleGoogleLogin = useCallback(async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithGoogle();
    } catch {
      // Erro gerenciado no contexto
    }
  }, [loginWithGoogle, clearError]);

  const handleAppleLogin = useCallback(async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithApple();
    } catch {
      // Erro gerenciado no contexto
    }
  }, [loginWithApple, clearError]);

  const displayedError = error || localError;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Cabeçalho Visual */}
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <MessageSquare size={16} color="#FFFFFF" style={styles.logoIcon} />
                <Text style={styles.logoBadgeText}>CP4</Text>
              </View>
              <Text style={styles.title}>CHAT FIREBASE</Text>
              <Text style={styles.subtitle}>
                Autenticação + Realtime Database 1-para-1
              </Text>
            </View>

            {/* Caixa de Formulário */}
            <View style={styles.formCard}>
              <View style={styles.modeTabs}>
                <TouchableOpacity
                  style={[styles.tabButton, !isRegisterMode && styles.tabButtonActive]}
                  onPress={() => isRegisterMode && toggleMode()}
                >
                  <Text
                    style={[styles.tabButtonText, !isRegisterMode && styles.tabButtonTextActive]}
                  >
                    ENTRAR
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, isRegisterMode && styles.tabButtonActive]}
                  onPress={() => !isRegisterMode && toggleMode()}
                >
                  <Text
                    style={[styles.tabButtonText, isRegisterMode && styles.tabButtonTextActive]}
                  >
                    CADASTRAR
                  </Text>
                </TouchableOpacity>
              </View>

              {displayedError && (
                <ErrorMessage
                  message={displayedError}
                  onDismiss={() => {
                    setLocalError(null);
                    clearError();
                  }}
                />
              )}

              {isRegisterMode && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <UserIcon size={12} color="#ACC1CC" style={styles.labelIcon} />
                    <Text style={styles.label}>NOME COMPLETO</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    placeholderTextColor="#6a757b"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Mail size={12} color="#ACC1CC" style={styles.labelIcon} />
                  <Text style={styles.label}>E-MAIL</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="exemplo@dominio.com"
                  placeholderTextColor="#6a757b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Lock size={12} color="#ACC1CC" style={styles.labelIcon} />
                  <Text style={styles.label}>SENHA</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#6a757b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              {/* Botão de Envio Principal */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isRegisterMode ? 'CRIAR CONTA (E-MAIL)' : 'ENTRAR COM E-MAIL'}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU CONECTE COM</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Provedores Adicionais Obrigatórios com ícones Lucide */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Globe size={18} color="#ACC1CC" style={styles.socialButtonIcon} />
                <Text style={styles.googleButtonText}>CONTINUAR COM GOOGLE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.appleButton}
                onPress={handleAppleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <AppleIcon size={18} color="#FFFFFF" style={styles.socialButtonIcon} />
                <Text style={styles.appleButtonText}>CONTINUAR COM APPLE</Text>
              </TouchableOpacity>
            </View>

            {/* Informação sobre a Regra de Comunicação */}
            <View style={styles.ruleInfoBox}>
              <View style={styles.ruleHeaderRow}>
                <Info size={15} color="#ed145b" style={styles.ruleHeaderIcon} />
                <Text style={styles.ruleTitle}>REGRA DE COMUNICAÇÃO ENTRE PROVEDORES</Text>
              </View>
              <Text style={styles.ruleText}>
                • Contas com E-mail/Senha só podem conversar com contas Google ou Apple.
              </Text>
              <Text style={styles.ruleText}>
                • Contas Google ou Apple só podem conversar com contas E-mail/Senha.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ed145b',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 0,
    marginBottom: 8,
  },
  logoIcon: {
    marginRight: 6,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#131618',
    borderWidth: 1,
    borderColor: '#292f32',
    borderRadius: 0,
    padding: 18,
  },
  modeTabs: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#1b2023',
    borderWidth: 1,
    borderColor: '#292f32',
    borderRadius: 0,
  },
  tabButtonActive: {
    backgroundColor: '#2b101b',
    borderColor: '#ed145b',
  },
  tabButtonText: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tabButtonTextActive: {
    color: '#ed145b',
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  input: {
    height: 44,
    backgroundColor: '#0c0e0f',
    borderWidth: 1,
    borderColor: '#343A3C',
    borderRadius: 0,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  submitButton: {
    height: 46,
    backgroundColor: '#ed145b',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ff3074',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#262c2f',
  },
  dividerText: {
    color: '#6e7a82',
    fontFamily: 'Roboto',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginHorizontal: 10,
  },
  googleButton: {
    height: 44,
    backgroundColor: '#1b2226',
    borderWidth: 1,
    borderColor: '#ACC1CC',
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButtonText: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  appleButton: {
    height: 44,
    backgroundColor: '#111314',
    borderWidth: 1,
    borderColor: '#555f65',
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  socialButtonIcon: {
    marginRight: 8,
  },
  ruleInfoBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#0f1214',
    borderWidth: 1,
    borderColor: '#262c2f',
    borderRadius: 0,
  },
  ruleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ruleHeaderIcon: {
    marginRight: 6,
  },
  ruleTitle: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  ruleText: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});
