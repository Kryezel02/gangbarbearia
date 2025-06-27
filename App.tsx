import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AgendamentosProvider, useAgendamentos } from './components/AgendamentosContext';
import { AuthNavigationContext } from './components/AuthNavigationContext';
import MainLayout from './components/MainLayout';
import LoadingScreen from './components/LoadingScreen';

import LoginScreen from './components/LoginScreen';
import CadastroScreen from './components/CadastroScreen';
import AdminScreen from './components/AdminScreen';
import AgendamentoScreen from './components/AgendamentoScreen';
import DashboardScreen from './components/DashboardScreen';
import ServicosScreen from './components/ServicosScreen';
import MeusAgendamentosScreen from './components/MeusAgendamentosScreen';
import PerfilScreen from './components/PerfilScreen';

const Stack = createStackNavigator();

function DashboardWrapper() {
  return (
    <MainLayout>
      <DashboardScreen />
    </MainLayout>
  );
}

function ServicosWrapper() {
  return (
    <MainLayout>
      <ServicosScreen />
    </MainLayout>
  );
}

function AgendamentoWrapper() {
  return (
    <MainLayout>
      <AgendamentoScreen />
    </MainLayout>
  );
}

function MeusAgendamentosWrapper() {
  return (
    <MainLayout>
      <MeusAgendamentosScreen />
    </MainLayout>
  );
}

function PerfilWrapper() {
  return (
    <MainLayout>
      <PerfilScreen />
    </MainLayout>
  );
}

function AppNavigator() {
  const { usuario, isLoading } = useAgendamentos();
  const [authScreen, setAuthScreen] = useState<'login' | 'cadastro'>('login');
  const [showSplash, setShowSplash] = useState(true);

  const authNavigation = {
    navigateToCadastro: () => setAuthScreen('cadastro'),
    navigateToLogin: () => setAuthScreen('login'),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthNavigationContext.Provider value={authNavigation}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          {!usuario ? (
            <>
              <Stack.Screen 
                name="Login" 
                component={authScreen === 'login' ? LoginScreen : CadastroScreen}
                options={{ gestureEnabled: false }}
              />
              <Stack.Screen 
                name="Cadastro" 
                component={CadastroScreen}
                options={{ gestureEnabled: false }}
              />
            </>
          ) : (
            <>
              {usuario.isAdmin ? (
                <Stack.Screen name="Admin" component={AdminScreen} />
              ) : (
                <>
                  <Stack.Screen name="Dashboard" component={DashboardWrapper} />
                  <Stack.Screen name="Servicos" component={ServicosWrapper} />
                  <Stack.Screen name="Agendamento" component={AgendamentoWrapper} />
                  <Stack.Screen name="MeusAgendamentos" component={MeusAgendamentosWrapper} />
                  <Stack.Screen name="Perfil" component={PerfilWrapper} />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthNavigationContext.Provider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AgendamentosProvider>
        <AppNavigator />
      </AgendamentosProvider>
    </GestureHandlerRootView>
  );
} 