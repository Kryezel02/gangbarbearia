import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgendamentos } from './AgendamentosContext';

const { width } = Dimensions.get('window');

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  categoria: string;
  destaque?: boolean;
  popular: boolean;
}

const servicos: Servico[] = [
  {
    id: 1,
    nome: 'Corte Masculino',
    descricao: 'Corte moderno e personalizado. Inclui lavagem, corte, finalização e dicas de manutenção. Técnicas atualizadas para todos os tipos de cabelo.',
    preco: 25.00,
    duracao: 30,
    categoria: 'Cortes',
    popular: true,
  },
  {
    id: 2,
    nome: 'Corte Degradê',
    descricao: 'Corte com transição suave do comprimento. Técnica moderna que cria volume e movimento natural. Ideal para quem busca um visual contemporâneo.',
    preco: 30.00,
    duracao: 35,
    categoria: 'Cortes',
    destaque: true,
    popular: true,
  },
  {
    id: 3,
    nome: 'Corte Pompadour',
    descricao: 'Corte clássico com volume na parte superior. Estilo retrô que nunca sai de moda. Inclui modelagem e finalização com produtos específicos.',
    preco: 35.00,
    duracao: 40,
    categoria: 'Cortes',
    popular: true,
  },
  {
    id: 4,
    nome: 'Corte Undercut',
    descricao: 'Corte com laterais e nuca raspadas. Contraste marcante entre as partes. Estilo moderno e versátil que combina com diferentes looks.',
    preco: 35.00,
    duracao: 35,
    categoria: 'Cortes',
    popular: true,
  },
  {
    id: 5,
    nome: 'Barba Tradicional',
    descricao: 'Acabamento e modelagem da barba com navalha. Inclui hidratação, alinhamento perfeito e finalização com produtos específicos para barba.',
    preco: 20.00,
    duracao: 20,
    categoria: 'Barba',
    popular: true,
  },
  {
    id: 6,
    nome: 'Barba Desenhada',
    descricao: 'Modelagem artística da barba com desenhos e formas personalizadas. Trabalho de precisão para criar linhas definidas e simétricas.',
    preco: 25.00,
    duracao: 25,
    categoria: 'Barba',
    popular: false,
  },
  {
    id: 7,
    nome: 'Corte + Barba',
    descricao: 'Combo completo: corte masculino + barba tradicional. Economia garantida com qualidade premium. Inclui todos os cuidados de ambos os serviços.',
    preco: 39.90,
    duracao: 45,
    categoria: 'Combos',
    destaque: true,
    popular: true,
  },
  {
    id: 8,
    nome: 'Hidratação Capilar',
    descricao: 'Tratamento profundo para cabelos ressecados. Nutrição intensiva com produtos profissionais. Ideal para cabelos danificados ou que precisam de revitalização.',
    preco: 35.00,
    duracao: 40,
    categoria: 'Tratamentos',
    popular: false,
  },
  {
    id: 9,
    nome: 'Pigmentação',
    descricao: 'Coloração natural para cabelos grisalhos ou brancos. Técnica que disfarça os fios brancos mantendo um visual natural e elegante.',
    preco: 45.00,
    duracao: 60,
    categoria: 'Tratamentos',
    popular: false,
  },
  {
    id: 10,
    nome: 'Sobrancelha',
    descricao: 'Design e alinhamento das sobrancelhas. Modelagem personalizada para harmonizar com o formato do rosto. Inclui pinça e navalha.',
    preco: 15.00,
    duracao: 15,
    categoria: 'Estética',
    popular: false,
  },
  {
    id: 11,
    nome: 'Pacote Completo',
    descricao: 'Experiência completa: corte + barba + sobrancelha + hidratação. O pacote ideal para quem quer renovar completamente o visual.',
    preco: 79.90,
    duracao: 90,
    categoria: 'Combos',
    destaque: true,
    popular: true,
  },
];

export default function ServicosScreen() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todos');
  const navigation = useNavigation<any>();
  const { adicionarAgendamento } = useAgendamentos();

  const categorias = ['Todos', 'Cortes', 'Barba', 'Tratamentos', 'Estética', 'Combos'];

  const servicosFiltrados = categoriaSelecionada === 'Todos' 
    ? servicos 
    : servicos.filter(servico => servico.categoria === categoriaSelecionada);

  function handleAgendar(servico: Servico) {
    Alert.alert(
      'Agendar Serviço',
      `Deseja agendar ${servico.nome} por R$ ${servico.preco.toFixed(2)}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Agendar',
          onPress: () => {
            const hoje = new Date();
            const proximaData = new Date(hoje);
            proximaData.setDate(hoje.getDate() + 1);
            
            const dataFormatada = proximaData.toISOString().split('T')[0];
            
            adicionarAgendamento({
              data: dataFormatada,
              horario: '10:00',
              barbeiro: 'João Silva',
              servico: servico.nome,
              preco: servico.preco,
              status: 'confirmado',
            });

            Alert.alert(
              'Agendamento Criado!',
              `${servico.nome} foi adicionado aos seus agendamentos. Você pode editar os detalhes na tela de agendamentos.`,
              [
                {
                  text: 'Ver Agendamentos',
                  onPress: () => navigation.navigate('MeusAgendamentos'),
                },
                {
                  text: 'Continuar',
                },
              ]
            );
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gang Barbearia</Text>
      <Text style={styles.title}>Nossos Serviços</Text>
      <Text style={styles.subtitle}>Qualidade e estilo em cada detalhe</Text>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.filterButton,
                categoriaSelecionada === categoria && styles.filterButtonSelected
              ]}
              onPress={() => setCategoriaSelecionada(categoria)}
            >
              <Text style={[
                styles.filterText,
                categoriaSelecionada === categoria && styles.filterTextSelected
              ]}>
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.servicosContainer}>
        {servicosFiltrados.map((servico) => (
          <View key={servico.id} style={[
            styles.servicoCard,
            servico.destaque && styles.servicoCardDestaque
          ]}>
            {servico.destaque && (
              <View style={styles.destaqueBadge}>
                <Text style={styles.destaqueText}>🔥 DESTAQUE</Text>
              </View>
            )}
            
            <View style={styles.servicoHeader}>
              <Text style={styles.servicoNome}>{servico.nome}</Text>
              <Text style={styles.servicoPreco}>R$ {servico.preco.toFixed(2)}</Text>
            </View>

            <Text style={styles.servicoDescricao}>{servico.descricao}</Text>

            <View style={styles.servicoFooter}>
              <View style={styles.servicoInfo}>
                <Text style={styles.servicoDuracao}>⏱️ {servico.duracao} min</Text>
                <Text style={styles.servicoCategoria}>📂 {servico.categoria}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.agendarButton}
                onPress={() => handleAgendar(servico)}
              >
                <Text style={styles.agendarButtonText}>Agendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>💡 Dicas da Gang</Text>
        <Text style={styles.infoText}>
          • Agende com antecedência para garantir seu horário preferido{'\n'}
          • Traga referências de cortes que você gosta{'\n'}
          • Nossos profissionais são especializados em cada tipo de serviço{'\n'}
          • Produtos de qualidade premium inclusos em todos os serviços
        </Text>
      </View>
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
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#232323',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
  servicosContainer: {
    gap: 16,
  },
  servicoCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  servicoCardDestaque: {
    borderColor: '#ff6b35',
    borderWidth: 2,
  },
  destaqueBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  destaqueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  servicoHeader: {
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
  servicoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  servicoDescricao: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
    lineHeight: 20,
  },
  servicoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicoInfo: {
    gap: 8,
  },
  servicoDuracao: {
    fontSize: 14,
    color: '#999',
  },
  servicoCategoria: {
    fontSize: 14,
    color: '#999',
  },
  agendarButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
}); 