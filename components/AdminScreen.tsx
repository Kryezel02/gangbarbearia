import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useAgendamentos } from './AgendamentosContext';

export default function AdminScreen() {
  const { agendamentos, cancelarAgendamento, concluirAgendamento, excluirAgendamento, logout } = useAgendamentos();
  const [refreshing, setRefreshing] = useState(false);

  function formatarData(data: string) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function formatarStatus(status: string) {
    switch (status) {
      case 'confirmado':
        return { texto: 'Confirmado', cor: '#28a745' };
      case 'cancelado':
        return { texto: 'Cancelado', cor: '#dc3545' };
      case 'concluido':
        return { texto: 'Concluído', cor: '#17a2b8' };
      default:
        return { texto: status, cor: '#6c757d' };
    }
  }

  function handleCancelarAgendamento(id: string, nomeCliente: string) {
    Alert.alert(
      'Cancelar Agendamento',
      `Deseja cancelar o agendamento de ${nomeCliente}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          style: 'destructive',
          onPress: () => {
            cancelarAgendamento(id);
            Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
          }
        }
      ]
    );
  }

  function handleConcluirAgendamento(id: string, nomeCliente: string) {
    Alert.alert(
      'Concluir Agendamento',
      `Deseja marcar o agendamento de ${nomeCliente} como concluído?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: () => {
            concluirAgendamento(id);
            Alert.alert('Sucesso', 'Agendamento marcado como concluído!');
          }
        }
      ]
    );
  }

  function handleExcluirAgendamento(id: string, nomeCliente: string) {
    Alert.alert(
      'Excluir Agendamento',
      `Deseja excluir permanentemente o agendamento de ${nomeCliente}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          style: 'destructive',
          onPress: () => {
            excluirAgendamento(id);
            Alert.alert('Sucesso', 'Agendamento excluído com sucesso!');
          }
        }
      ]
    );
  }

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Deseja sair da área administrativa?',
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: () => logout()
        }
      ]
    );
  }

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
    const dataA = new Date(a.data + ' ' + a.horario);
    const dataB = new Date(b.data + ' ' + b.horario);
    return dataA.getTime() - dataB.getTime();
  });

  const agendamentosConfirmados = agendamentosOrdenados.filter(a => a.status === 'confirmado');
  const agendamentosConcluidos = agendamentosOrdenados.filter(a => a.status === 'concluido');
  const agendamentosCancelados = agendamentosOrdenados.filter(a => a.status === 'cancelado');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel Administrativo</Text>
        <Text style={styles.headerSubtitle}>Gang Barbearia</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{agendamentosConfirmados.length}</Text>
          <Text style={styles.statLabel}>Confirmados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{agendamentosConcluidos.length}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{agendamentosCancelados.length}</Text>
          <Text style={styles.statLabel}>Cancelados</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Todos os Agendamentos</Text>
        
        {agendamentosOrdenados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
          </View>
        ) : (
          agendamentosOrdenados.map((agendamento) => {
            const statusInfo = formatarStatus(agendamento.status);
            
            return (
              <View key={agendamento.id} style={styles.agendamentoCard}>
                <View style={styles.agendamentoHeader}>
                  <Text style={styles.clienteNome}>{agendamento.nomeUsuario}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.cor }]}>
                    <Text style={styles.statusText}>{statusInfo.texto}</Text>
                  </View>
                </View>

                <View style={styles.agendamentoInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📞 Telefone:</Text>
                    <Text style={styles.infoValue}>{agendamento.telefoneUsuario}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📅 Data:</Text>
                    <Text style={styles.infoValue}>{formatarData(agendamento.data)}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🕐 Horário:</Text>
                    <Text style={styles.infoValue}>{agendamento.horario}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>✂️ Serviço:</Text>
                    <Text style={styles.infoValue}>{agendamento.servico}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>👨‍💼 Barbeiro:</Text>
                    <Text style={styles.infoValue}>{agendamento.barbeiro}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>💰 Valor:</Text>
                    <Text style={styles.infoValue}>R$ {agendamento.preco.toFixed(2)}</Text>
                  </View>
                </View>

                {agendamento.status === 'confirmado' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.concluirButton]}
                      onPress={() => handleConcluirAgendamento(agendamento.id, agendamento.nomeUsuario)}
                    >
                      <Text style={styles.actionButtonText}>Concluir</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.cancelarButton]}
                      onPress={() => handleCancelarAgendamento(agendamento.id, agendamento.nomeUsuario)}
                    >
                      <Text style={styles.actionButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {(agendamento.status === 'concluido' || agendamento.status === 'cancelado') && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.excluirButton]}
                      onPress={() => handleExcluirAgendamento(agendamento.id, agendamento.nomeUsuario)}
                    >
                      <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  header: {
    backgroundColor: '#ff6b35',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#232323',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  statLabel: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  agendamentoCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  agendamentoInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 12,
    color: '#ccc',
    flex: 1,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  concluirButton: {
    backgroundColor: '#28a745',
  },
  cancelarButton: {
    backgroundColor: '#dc3545',
  },
  excluirButton: {
    backgroundColor: '#6c757d',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 