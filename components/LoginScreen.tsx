import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { useAgendamentos } from './AgendamentosContext';
import { useAuthNavigation } from './AuthNavigationContext';
import LoadingScreen from './LoadingScreen';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const emailAnimation = useRef(new Animated.Value(0)).current;
  const passwordAnimation = useRef(new Animated.Value(0)).current;
  const emailScale = useRef(new Animated.Value(1)).current;
  const passwordScale = useRef(new Animated.Value(1)).current;

  const { login } = useAgendamentos();
  const { navigateToCadastro } = useAuthNavigation();

  function animateInput(animation: Animated.Value, scale: Animated.Value, isFocused: boolean) {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: isFocused ? 1.02 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }

  function handleEmailChange(text: string) {
    setEmail(text);
    if (text.length > 0 && !isEmailFocused) {
      setIsEmailFocused(true);
      animateInput(emailAnimation, emailScale, true);
    } else if (text.length === 0 && isEmailFocused) {
      setIsEmailFocused(false);
      animateInput(emailAnimation, emailScale, false);
    }
  }

  function handlePasswordChange(text: string) {
    setSenha(text);
    if (text.length > 0 && !isPasswordFocused) {
      setIsPasswordFocused(true);
      animateInput(passwordAnimation, passwordScale, true);
    } else if (text.length === 0 && isPasswordFocused) {
      setIsPasswordFocused(false);
      animateInput(passwordAnimation, passwordScale, false);
    }
  }

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const sucesso = await login(email.trim(), senha);
      
      if (sucesso) {
        setEmail('');
        setSenha('');
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gang Barbearia</Text>
      <Text style={styles.title}>Faça seu login e entre novamente na Gang!</Text>
      
      <Animated.View style={[
        styles.inputContainer,
        {
          transform: [{ scale: emailScale }],
          borderColor: emailAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['#333', '#ff6b35'],
          }),
        }
      ]}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
          onFocus={() => {
            setIsEmailFocused(true);
            animateInput(emailAnimation, emailScale, true);
          }}
          onBlur={() => {
            if (email.length === 0) {
              setIsEmailFocused(false);
              animateInput(emailAnimation, emailScale, false);
            }
          }}
        />
      </Animated.View>
      
      <Animated.View style={[
        styles.inputContainer,
        {
          transform: [{ scale: passwordScale }],
          borderColor: passwordAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['#333', '#ff6b35'],
          }),
        }
      ]}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          value={senha}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          editable={!isLoading}
          onFocus={() => {
            setIsPasswordFocused(true);
            animateInput(passwordAnimation, passwordScale, true);
          }}
          onBlur={() => {
            if (senha.length === 0) {
              setIsPasswordFocused(false);
              animateInput(passwordAnimation, passwordScale, false);
            }
          }}
        />
        {senha.length > 0 && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeText}>
              {showPassword ? '👁️' : '🔒'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={navigateToCadastro}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Não faz parte da Gang? Cadastre-se!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 24,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 18,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#ff6b35',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 