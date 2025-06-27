import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Gang Barbearia</Text>
        <Text style={styles.title}>Bem-vindo à sua experiência moderna de barbearia!</Text>
        <Text style={styles.text}>Agende seu horário, confira promoções e aproveite nossos serviços exclusivos.</Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Agendamento')}>
            <Text style={styles.buttonText}>Agendar Horário</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Servicos')}>
            <Text style={styles.buttonTextSecondary}>Ver Serviços</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MeusAgendamentos')}>
            <Text style={styles.buttonText}>Meus Agendamentos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Perfil')}>
            <Text style={styles.buttonTextSecondary}>Meu Perfil</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>🔥 Promoção da Semana</Text>
          <Text style={styles.promoDesc}>Corte + Barba por apenas R$39,90!</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#181818',
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 100,
    minHeight: '100%',
    backgroundColor: '#181818',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 24,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonSecondary: {
    backgroundColor: '#232323',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  buttonTextSecondary: {
    color: '#ff6b35',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  promoCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b35',
    marginTop: 8,
  },
  promoTitle: {
    color: '#ff6b35',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  promoDesc: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
}); 