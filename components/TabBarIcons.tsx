import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

export default function TabBarIcon({ routeName, focused, color, size }: TabBarIconProps) {
  const getIcon = () => {
    switch (routeName) {
      case 'Dashboard':
        return focused ? '🏠' : '🏠';
      case 'Servicos':
        return focused ? '✂️' : '✂️';
      case 'Agendamento':
        return focused ? '📅' : '📅';
      case 'MeusAgendamentos':
        return focused ? '📋' : '📋';
      case 'Perfil':
        return focused ? '👤' : '👤';
      default:
        return '🏠';
    }
  };

  const getLabel = () => {
    switch (routeName) {
      case 'Dashboard':
        return 'Início';
      case 'Servicos':
        return 'Serviços';
      case 'Agendamento':
        return 'Agendar';
      case 'MeusAgendamentos':
        return 'Agendamentos';
      case 'Perfil':
        return 'Perfil';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        focused && { backgroundColor: 'rgba(255, 107, 53, 0.1)' }
      ]}>
        <Text style={[
          styles.icon,
          {
            color,
            fontSize: focused ? size + 2 : size,
            opacity: focused ? 1 : 0.6,
          }
        ]}>
          {getIcon()}
        </Text>
      </View>
      {focused && (
        <View style={[styles.indicator, { backgroundColor: color }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  icon: {
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
}); 