import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgendamentos } from './AgendamentosContext';
import LoadingScreen from './LoadingScreen';

const { width, height } = Dimensions.get('window');

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: number;
}

interface Barbeiro {
  id: number;
  nome: string;
  especialidade: string;
}

interface Horario {
  id: number;
  hora: string;
  disponivel: boolean;
}

const servicos: Servico[] = [
  { id: 1, nome: 'Corte Masculino', preco: 25.00, duracao: 30 },
  { id: 2, nome: 'Barba', preco: 20.00, duracao: 20 },
  { id: 3, nome: 'Corte + Barba', preco: 39.90, duracao: 45 },
  { id: 4, nome: 'Hidratação', preco: 35.00, duracao: 40 },
  { id: 5, nome: 'Pigmentação', preco: 45.00, duracao: 60 },
];

const barbeiros: Barbeiro[] = [
  { id: 1, nome: 'João Silva', especialidade: 'Cortes Modernos' },
  { id: 2, nome: 'Pedro Santos', especialidade: 'Barbas' },
  { id: 3, nome: 'Carlos Oliveira', especialidade: 'Técnicas Avançadas' },
];

const horarios: Horario[] = [
  { id: 1, hora: '09:00', disponivel: true },
  { id: 2, hora: '10:00', disponivel: true },
  { id: 3, hora: '11:00', disponivel: false },
  { id: 4, hora: '14:00', disponivel: true },
  { id: 5, hora: '15:00', disponivel: true },
  { id: 6, hora: '16:00', disponivel: true },
  { id: 7, hora: '17:00', disponivel: false },
  { id: 8, hora: '18:00', disponivel: true },
];

export default function AgendamentoScreen() {
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horarioSelecionado, setHorarioSelecionado] = useState<Horario | null>(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<Barbeiro | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<any>();
  const { adicionarAgendamento } = useAgendamentos();

  const proximasDatas = [
    { data: '2024-01-15', dia: '15', mes: 'Jan', diaSemana: 'Seg' },
    { data: '2024-01-16', dia: '16', mes: 'Jan', diaSemana: 'Ter' },
    { data: '2024-01-17', dia: '17', mes: 'Jan', diaSemana: 'Qua' },
    { data: '2024-01-18', dia: '18', mes: 'Jan', diaSemana: 'Qui' },
    { data: '2024-01-19', dia: '19', mes: 'Jan', diaSemana: 'Sex' },
    { data: '2024-01-20', dia: '20', mes: 'Jan', diaSemana: 'Sáb' },
  ];

  function confirmarAgendamento() {
    if (!dataSelecionada || !horarioSelecionado || !barbeiroSelecionado || !servicoSelecionado) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos para confirmar o agendamento.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      adicionarAgendamento({
        data: dataSelecionada,
        horario: horarioSelecionado.hora,
        barbeiro: barbeiroSelecionado.nome,
        servico: servicoSelecionado.nome,
        preco: servicoSelecionado.preco,
        status: 'confirmado',
      });

      Alert.alert(
        'Agendamento Confirmado!',
        `Seu horário foi marcado para ${dataSelecionada} às ${horarioSelecionado.hora} com ${barbeiroSelecionado.nome} para ${servicoSelecionado.nome}.`,
        [
          {
            text: 'Ver Meus Agendamentos',
            onPress: () => navigation.navigate('MeusAgendamentos'),
          },
          {
            text: 'Continuar',
          },
        ]
      );

      setDataSelecionada('');
      setHorarioSelecionado(null);
      setBarbeiroSelecionado(null);
      setServicoSelecionado(null);
      setIsLoading(false);
    }, 2000);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.header}>Gang Barbearia</Text>
        <Text style={styles.title}>Agendamento</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Escolha a Data</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateContainer}>
            {proximasDatas.map((item) => (
              <TouchableOpacity
                key={item.data}
                style={[
                  styles.dateCard,
                  dataSelecionada === item.data && styles.dateCardSelected
                ]}
                onPress={() => setDataSelecionada(item.data)}
              >
                <Text style={[styles.dateDay, dataSelecionada === item.data && styles.dateDaySelected]}>
                  {item.dia}
                </Text>
                <Text style={[styles.dateMonth, dataSelecionada === item.data && styles.dateMonthSelected]}>
                  {item.mes}
                </Text>
                <Text style={[styles.dateWeekday, dataSelecionada === item.data && styles.dateWeekdaySelected]}>
                  {item.diaSemana}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 Escolha o Horário</Text>
          <View style={styles.timeGrid}>
            {horarios.map((horario) => (
              <TouchableOpacity
                key={horario.id}
                style={[
                  styles.timeCard,
                  !horario.disponivel && styles.timeCardUnavailable,
                  horarioSelecionado?.id === horario.id && styles.timeCardSelected
                ]}
                onPress={() => horario.disponivel && setHorarioSelecionado(horario)}
                disabled={!horario.disponivel}
              >
                <Text style={[
                  styles.timeText,
                  !horario.disponivel && styles.timeTextUnavailable,
                  horarioSelecionado?.id === horario.id && styles.timeTextSelected
                ]}>
                  {horario.hora}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💼 Escolha o Barbeiro</Text>
          <View style={styles.barbeiroContainer}>
            {barbeiros.map((barbeiro) => (
              <TouchableOpacity
                key={barbeiro.id}
                style={[
                  styles.barbeiroCard,
                  barbeiroSelecionado?.id === barbeiro.id && styles.barbeiroCardSelected
                ]}
                onPress={() => setBarbeiroSelecionado(barbeiro)}
              >
                <Text style={[styles.barbeiroNome, barbeiroSelecionado?.id === barbeiro.id && styles.barbeiroNomeSelected]}>
                  {barbeiro.nome}
                </Text>
                <Text style={[styles.barbeiroEspecialidade, barbeiroSelecionado?.id === barbeiro.id && styles.barbeiroEspecialidadeSelected]}>
                  {barbeiro.especialidade}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✂️ Escolha o Serviço</Text>
          <View style={styles.servicoContainer}>
            {servicos.map((servico) => (
              <TouchableOpacity
                key={servico.id}
                style={[
                  styles.servicoCard,
                  servicoSelecionado?.id === servico.id && styles.servicoCardSelected
                ]}
                onPress={() => setServicoSelecionado(servico)}
              >
                <Text style={[styles.servicoNome, servicoSelecionado?.id === servico.id && styles.servicoNomeSelected]}>
                  {servico.nome}
                </Text>
                <Text style={[styles.servicoPreco, servicoSelecionado?.id === servico.id && styles.servicoPrecoSelected]}>
                  R$ {servico.preco.toFixed(2)}
                </Text>
                <Text style={[styles.servicoDuracao, servicoSelecionado?.id === servico.id && styles.servicoDuracaoSelected]}>
                  {servico.duracao} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!dataSelecionada || !horarioSelecionado || !barbeiroSelecionado || !servicoSelecionado) && styles.confirmButtonDisabled
          ]}
          onPress={confirmarAgendamento}
          disabled={!dataSelecionada || !horarioSelecionado || !barbeiroSelecionado || !servicoSelecionado}
        >
          <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  content: {
    padding: Math.min(width * 0.05, 20),
    paddingTop: Math.max(height * 0.08, 60),
    paddingBottom: Math.max(height * 0.1, 80),
  },
  header: {
    fontSize: Math.min(width * 0.08, 28),
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Math.min(width * 0.06, 20),
    color: '#fff',
    marginBottom: Math.max(height * 0.03, 24),
    textAlign: 'center',
  },
  section: {
    marginBottom: Math.max(height * 0.025, 20),
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: Math.max(height * 0.015, 12),
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateCard: {
    backgroundColor: '#232323',
    borderRadius: Math.min(width * 0.03, 12),
    padding: Math.min(width * 0.04, 16),
    marginRight: Math.min(width * 0.03, 12),
    alignItems: 'center',
    minWidth: Math.min(width * 0.18, 70),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a2a2a',
  },
  dateDay: {
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: 'bold',
    color: '#fff',
  },
  dateDaySelected: {
    color: '#ff6b35',
  },
  dateMonth: {
    fontSize: Math.min(width * 0.03, 12),
    color: '#ccc',
    marginTop: 4,
  },
  dateMonthSelected: {
    color: '#ff6b35',
  },
  dateWeekday: {
    fontSize: Math.min(width * 0.025, 10),
    color: '#999',
    marginTop: 2,
  },
  dateWeekdaySelected: {
    color: '#ff6b35',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeCard: {
    backgroundColor: '#232323',
    borderRadius: Math.min(width * 0.02, 8),
    padding: Math.min(width * 0.03, 12),
    marginBottom: Math.min(height * 0.01, 8),
    width: (width - Math.min(width * 0.15, 60)) / 3,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeCardSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a2a2a',
  },
  timeCardUnavailable: {
    backgroundColor: '#1a1a1a',
    opacity: 0.5,
  },
  timeText: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
    color: '#fff',
  },
  timeTextSelected: {
    color: '#ff6b35',
  },
  timeTextUnavailable: {
    color: '#666',
  },
  barbeiroContainer: {
    gap: Math.min(height * 0.015, 12),
  },
  barbeiroCard: {
    backgroundColor: '#232323',
    borderRadius: Math.min(width * 0.03, 12),
    padding: Math.min(width * 0.04, 16),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  barbeiroCardSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a2a2a',
  },
  barbeiroNome: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  barbeiroNomeSelected: {
    color: '#ff6b35',
  },
  barbeiroEspecialidade: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#ccc',
  },
  barbeiroEspecialidadeSelected: {
    color: '#ff6b35',
  },
  servicoContainer: {
    gap: Math.min(height * 0.015, 12),
  },
  servicoCard: {
    backgroundColor: '#232323',
    borderRadius: Math.min(width * 0.03, 12),
    padding: Math.min(width * 0.04, 16),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  servicoCardSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#2a2a2a',
  },
  servicoNome: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  servicoNomeSelected: {
    color: '#ff6b35',
  },
  servicoPreco: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 2,
  },
  servicoPrecoSelected: {
    color: '#ff6b35',
  },
  servicoDuracao: {
    fontSize: Math.min(width * 0.03, 12),
    color: '#ccc',
  },
  servicoDuracaoSelected: {
    color: '#ff6b35',
  },
  confirmButton: {
    backgroundColor: '#ff6b35',
    borderRadius: Math.min(width * 0.03, 12),
    paddingVertical: Math.min(height * 0.02, 16),
    alignItems: 'center',
    marginTop: Math.max(height * 0.02, 16),
  },
  confirmButtonDisabled: {
    backgroundColor: '#666',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
  },
}); 