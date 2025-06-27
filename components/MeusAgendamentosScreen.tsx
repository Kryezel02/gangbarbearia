import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAgendamentos } from './AgendamentosContext';

export default function MeusAgendamentosScreen() {
  const { agendamentos, cancelarAgendamento, concluirAgendamento } = useAgendamentos();
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'confirmado' | 'cancelado' | 'concluido'>('todos');

  function formatarData(data: string) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmado':
        return '#28a745';
      case 'cancelado':
        return '#dc3545';
      case 'concluido':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  }

  function handleCancelarAgendamento(id: string, servico: string) {
    Alert.alert(
      'Cancelar Agendamento',
      `Deseja cancelar o agendamento de ${servico}?`,
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

  function handleConcluirAgendamento(id: string, servico: string) {
    Alert.alert(
      'Concluir Agendamento',
      `Deseja marcar o agendamento de ${servico} como concluído?`,
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

  const agendamentosFiltrados = filtroStatus === 'todos' 
    ? agendamentos 
    : agendamentos.filter(agendamento => agendamento.status === filtroStatus);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gang Barbearia</Text>
      <Text style={styles.title}>Meus Agendamentos</Text>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'confirmado', label: 'Confirmados' },
            { key: 'cancelado', label: 'Cancelados' },
            { key: 'concluido', label: 'Concluídos' },
          ].map((filtro) => (
            <TouchableOpacity
              key={filtro.key}
              style={[
                styles.filterButton,
                filtroStatus === filtro.key && styles.filterButtonSelected
              ]}
              onPress={() => setFiltroStatus(filtro.key as any)}
            >
              <Text style={[
                styles.filterText,
                filtroStatus === filtro.key && styles.filterTextSelected
              ]}>
                {filtro.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.agendamentosContainer}>
        {agendamentosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum agendamento encontrado</Text>
            <Text style={styles.emptyText}>
              {filtroStatus === 'todos' 
                ? 'Você ainda não tem agendamentos. Que tal agendar um serviço?'
                : `Nenhum agendamento ${filtroStatus === 'confirmado' ? 'confirmado' : filtroStatus === 'cancelado' ? 'cancelado' : 'concluído'} encontrado.`
              }
            </Text>
          </View>
        ) : (
          agendamentosFiltrados.map((agendamento) => (
            <View key={agendamento.id} style={styles.agendamentoCard}>
              <View style={styles.agendamentoHeader}>
                <Text style={styles.servicoNome}>{agendamento.servico}</Text>
                <Text style={[styles.statusText, { color: getStatusColor(agendamento.status) }]}>
                  {getStatusText(agendamento.status)}
                </Text>
              </View>

              <View style={styles.agendamentoInfo}>
                <Text style={styles.infoText}>📅 {formatarData(agendamento.data)}</Text>
                <Text style={styles.infoText}>🕐 {agendamento.horario}</Text>
                <Text style={styles.infoText}>👨‍💼 {agendamento.barbeiro}</Text>
                <Text style={styles.infoText}>💰 R$ {agendamento.preco.toFixed(2)}</Text>
              </View>

              {agendamento.status === 'confirmado' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleConcluirAgendamento(agendamento.id, agendamento.servico)}
                  >
                    <Text style={styles.actionButtonText}>✅ Concluir</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancelarAgendamento(agendamento.id, agendamento.servico)}
                  >
                    <Text style={[styles.actionButtonText, styles.cancelButtonText]}>❌ Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {agendamento.status === 'cancelado' && (
                <View style={styles.canceledInfo}>
                  <Text style={styles.canceledText}>Este agendamento foi cancelado</Text>
                </View>
              )}

              {agendamento.status === 'concluido' && (
                <View style={styles.completedInfo}>
                  <Text style={styles.completedText}>✅ Serviço realizado com sucesso!</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {agendamentos.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Resumo</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{agendamentos.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {agendamentos.filter(a => a.status === 'confirmado').length}
              </Text>
              <Text style={styles.statLabel}>Confirmados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {agendamentos.filter(a => a.status === 'concluido').length}
              </Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b35',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#232323',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterButtonSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  filterText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  agendamentosContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  agendamentoCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  servicoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  agendamentoInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
  },
  canceledInfo: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  canceledText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
  },
  completedInfo: {
    backgroundColor: 'rgba(23, 162, 184, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#17a2b8',
  },
  completedText: {
    color: '#17a2b8',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
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
  },
}); 