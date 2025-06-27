import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgendamentos } from './AgendamentosContext';

export default function PerfilScreen() {
  const { usuario, logout, getAgendamentosPorUsuario } = useAgendamentos();
  const navigation = useNavigation<any>();

  async function handleLogout() {
    Alert.alert(
      'Sair',
      'Deseja sair da sua conta?',
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  }

  const meusAgendamentos = usuario ? getAgendamentosPorUsuario(usuario.id) : [];
  const agendamentosConfirmados = meusAgendamentos.filter(a => a.status === 'confirmado');
  const agendamentosConcluidos = meusAgendamentos.filter(a => a.status === 'concluido');

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Gang Barbearia</Text>
        <Text style={styles.title}>Perfil do Usuário</Text>
        <Text style={styles.text}>Faça login para ver seus dados</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Gang Barbearia</Text>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{usuario.nome.charAt(0).toUpperCase()}</Text>
          </View>
          
          <Text style={styles.userName}>{usuario.nome}</Text>
          <Text style={styles.userEmail}>{usuario.email}</Text>
          <Text style={styles.userPhone}>{usuario.telefone}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agendamentosConfirmados.length}</Text>
            <Text style={styles.statLabel}>Agendamentos Confirmados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agendamentosConcluidos.length}</Text>
            <Text style={styles.statLabel}>Serviços Realizados</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Agendamentos</Text>
          
          {meusAgendamentos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
              <Text style={styles.emptySubtext}>Faça seu primeiro agendamento!</Text>
            </View>
          ) : (
            meusAgendamentos.slice(0, 5).map((agendamento) => (
              <View key={agendamento.id} style={styles.agendamentoItem}>
                <View style={styles.agendamentoHeader}>
                  <Text style={styles.agendamentoData}>
                    {new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.horario}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: agendamento.status === 'confirmado' ? '#28a745' : 
                                     agendamento.status === 'concluido' ? '#17a2b8' : '#dc3545' }
                  ]}>
                    <Text style={styles.statusText}>
                      {agendamento.status === 'confirmado' ? 'Confirmado' :
                       agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.agendamentoServico}>{agendamento.servico}</Text>
                <Text style={styles.agendamentoBarbeiro}>Barbeiro: {agendamento.barbeiro}</Text>
                <Text style={styles.agendamentoPreco}>R$ {agendamento.preco.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#181818',
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#ccc',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#232323',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#232323',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  agendamentoItem: {
    backgroundColor: '#232323',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agendamentoData: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  agendamentoServico: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  agendamentoBarbeiro: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  agendamentoPreco: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 