import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAgendamentos } from './AgendamentosContext';
import { useAuthNavigation } from './AuthNavigationContext';
import LoadingScreen from './LoadingScreen';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { cadastrar } = useAgendamentos();
  const { navigateToLogin } = useAuthNavigation();

  function formatarTelefone(texto: string) {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  function validarFormulario(): boolean {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'E-mail inválido');
      return false;
    }
    if (!telefone.trim() || telefone.replace(/\D/g, '').length < 10) {
      Alert.alert('Erro', 'Telefone inválido');
      return false;
    }
    if (!senha.trim() || senha.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'Senhas não coincidem');
      return false;
    }
    return true;
  }

  async function handleCadastro() {
    if (!validarFormulario()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const sucesso = await cadastrar(nome.trim(), email.trim(), telefone, senha);
      
      if (sucesso) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        setNome('');
        setEmail('');
        setTelefone('');
        setSenha('');
        setConfirmarSenha('');
      } else {
        Alert.alert('Erro', 'E-mail já cadastrado. Tente outro e-mail.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao realizar cadastro');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Gang Barbearia</Text>
        <Text style={styles.title}>Junte-se à Gang!</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#aaa"
          value={telefone}
          onChangeText={(text) => setTelefone(formatarTelefone(text))}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#aaa"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          editable={!isLoading}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleCadastro}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={navigateToLogin}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Já tem conta? Faça login!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
    padding: 24,
    minHeight: '100%',
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
  input: {
    width: '100%',
    height: 48,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#222',
    color: '#fff',
    fontSize: 16,
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
  buttonDisabled: {
    backgroundColor: '#666',
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