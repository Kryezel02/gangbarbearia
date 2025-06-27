import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TabBarIcon from './TabBarIcons';
import { useAgendamentos } from './AgendamentosContext';

const { width, height } = Dimensions.get('window');

interface MenuItem {
  name: string;
  route: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: 'Início', route: 'Dashboard', icon: 'Dashboard' },
  { name: 'Serviços', route: 'Servicos', icon: 'Servicos' },
  { name: 'Agendar', route: 'Agendamento', icon: 'Agendamento' },
  { name: 'Agendamentos', route: 'MeusAgendamentos', icon: 'MeusAgendamentos' },
  { name: 'Perfil', route: 'Perfil', icon: 'Perfil' },
];

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation<any>();
  const { usuario, logout } = useAgendamentos();

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  function handleNavigation(screen: string) {
    setIsLoading(true);
    setTimeout(() => {
      navigation.navigate(screen);
      setIsOpen(false);
      setIsLoading(false);
    }, 300);
  }

  async function handleLogout() {
    setIsLoading(true);
    try {
      await logout();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <Animated.View
        style={[
          styles.menuButton,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuButtonInner}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.menuIcon}>🧔</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>🧔 GANG</Text>
          <Text style={styles.menuSubtitle}>BARBEARIA</Text>
          {usuario && (
            <Text style={styles.userInfo}>
              Olá, {usuario.nome.split(' ')[0]}!
            </Text>
          )}
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Dashboard')}
            disabled={isLoading}
          >
            <Text style={styles.menuItemIcon}>🏠</Text>
            <Text style={styles.menuItemText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Servicos')}
            disabled={isLoading}
          >
            <Text style={styles.menuItemIcon}>✂️</Text>
            <Text style={styles.menuItemText}>Serviços</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Agendamento')}
            disabled={isLoading}
          >
            <Text style={styles.menuItemIcon}>📅</Text>
            <Text style={styles.menuItemText}>Agendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('MeusAgendamentos')}
            disabled={isLoading}
          >
            <Text style={styles.menuItemIcon}>📋</Text>
            <Text style={styles.menuItemText}>Meus Agendamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Perfil')}
            disabled={isLoading}
          >
            <Text style={styles.menuItemIcon}>👤</Text>
            <Text style={styles.menuItemText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>🧔</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  menuButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 24,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: height,
    backgroundColor: '#181818',
    zIndex: 1000,
    paddingTop: 50,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    letterSpacing: 2,
  },
  menuSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    letterSpacing: 1,
  },
  userInfo: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 12,
    textAlign: 'center',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#232323',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 40,
  },
}); 