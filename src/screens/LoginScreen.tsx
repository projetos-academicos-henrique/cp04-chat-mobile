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
      // Erro gerenciado no contexto
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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Bloco Central Superior estilo App Mobile (Instagram / Threads) */}
            <View style={styles.topSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBadge}>
                  <MessageSquare size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.brandTitle}>CP4 CHAT</Text>
              </View>
              <Text style={styles.brandSubtitle}>
                {isRegisterMode ? 'Crie sua conta para começar' : 'Conecte-se para conversar em tempo real'}
              </Text>
            </View>

            {/* Mensagens de Erro */}
            {displayedError && (
              <View style={styles.errorContainer}>
                <ErrorMessage
                  message={displayedError}
                  onDismiss={() => {
                    setLocalError(null);
                    clearError();
                  }}
                />
              </View>
            )}

            {/* Formulário Direto na Tela (Sem caixa/card fechado) */}
            <View style={styles.formSection}>
              {isRegisterMode && (
                <View style={styles.inputWrapper}>
                  <UserIcon size={16} color="#ACC1CC" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome completo"
                    placeholderTextColor="#6a757b"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              )}

              <View style={styles.inputWrapper}>
                <Mail size={16} color="#ACC1CC" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#6a757b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={16} color="#ACC1CC" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha (mínimo 6 caracteres)"
                  placeholderTextColor="#6a757b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              {/* Botão de Ação Primário Full Width */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {isRegisterMode ? 'CADASTRAR' : 'ENTRAR'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divisor "OU" */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botões de Acesso Rápido / Provedores Sociais */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Globe size={18} color="#ACC1CC" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continuar com o Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <AppleIcon size={18} color="#FFFFFF" style={styles.socialIcon} />
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                  Continuar com a Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Aviso Sutil da Regra de Provedores */}
            <View style={styles.ruleNotice}>
              <Info size={14} color="#ed145b" style={styles.ruleNoticeIcon} />
              <Text style={styles.ruleNoticeText}>
                Regra CP4: Usuários de E-mail conversam exclusivamente com Google/Apple e vice-versa.
              </Text>
            </View>
          </ScrollView>

          {/* Rodapé Estilo Instagram ancorado na base */}
          <View style={styles.footerBar}>
            <Text style={styles.footerText}>
              {isRegisterMode ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
            </Text>
            <TouchableOpacity onPress={toggleMode} activeOpacity={0.7}>
              <Text style={styles.footerActionText}>
                {isRegisterMode ? 'Conecte-se' : 'Cadastre-se'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBadge: {
    backgroundColor: '#ed145b',
    padding: 8,
    borderRadius: 0, // Sem bordas arredondadas
    marginRight: 10,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  errorContainer: {
    marginBottom: 16,
  },
  formSection: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#14181a',
    borderWidth: 1,
    borderColor: '#262d31',
    borderRadius: 0, // Sem bordas arredondadas
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#ed145b',
    borderRadius: 0, // Sem bordas arredondadas
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ff2d72',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#262c30',
  },
  dividerText: {
    color: '#717d84',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 14,
  },
  socialButton: {
    height: 46,
    backgroundColor: '#171c1f',
    borderWidth: 1,
    borderColor: '#30383d',
    borderRadius: 0, // Sem bordas arredondadas
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    color: '#ACC1CC',
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '600',
  },
  appleButton: {
    backgroundColor: '#0c0e0f',
    borderColor: '#333b40',
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  ruleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 8,
  },
  ruleNoticeIcon: {
    marginRight: 6,
  },
  ruleNoticeText: {
    color: '#8e9aa1',
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    flexShrink: 1,
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#22282b',
    backgroundColor: '#0c0e0f',
  },
  footerText: {
    color: '#B7B7B7',
    fontFamily: 'Roboto',
    fontSize: 13,
  },
  footerActionText: {
    color: '#ed145b',
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '700',
  },
});
