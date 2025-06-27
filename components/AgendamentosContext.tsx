import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  isAdmin: boolean;
}

interface Agendamento {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  telefoneUsuario: string;
  data: string;
  horario: string;
  barbeiro: string;
  servico: string;
  preco: number;
  status: 'confirmado' | 'cancelado' | 'concluido';
  dataCriacao: Date;
}

interface AgendamentosContextData {
  usuario: Usuario | null;
  agendamentos: Agendamento[];
  login: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (nome: string, email: string, telefone: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id' | 'usuarioId' | 'nomeUsuario' | 'telefoneUsuario' | 'dataCriacao'>) => void;
  cancelarAgendamento: (id: string) => void;
  concluirAgendamento: (id: string) => void;
  excluirAgendamento: (id: string) => void;
  remarcarAgendamento: (id: string, novaData: string, novoHorario: string) => void;
  getAgendamentosPorUsuario: (usuarioId: string) => Agendamento[];
  isLoading: boolean;
}

const AgendamentosContext = createContext<AgendamentosContextData | undefined>(undefined);

const USUARIO_STORAGE_KEY = '@gang_barbearia_usuario';
const AGENDAMENTOS_STORAGE_KEY = '@gang_barbearia_agendamentos';
const USUARIOS_STORAGE_KEY = '@gang_barbearia_usuarios';

export function AgendamentosProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 'admin',
      nome: 'Administrador',
      email: 'admin',
      telefone: '(11) 99999-9999',
      senha: 'admin',
      isAdmin: true,
    }
  ]);

  useEffect(() => {
    carregarDadosSalvos();
  }, []);

  async function carregarDadosSalvos() {
    try {
      const [usuarioSalvo, agendamentosSalvos, usuariosSalvos] = await Promise.all([
        AsyncStorage.getItem(USUARIO_STORAGE_KEY),
        AsyncStorage.getItem(AGENDAMENTOS_STORAGE_KEY),
        AsyncStorage.getItem(USUARIOS_STORAGE_KEY),
      ]);

      if (usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }

      if (agendamentosSalvos) {
        const agendamentosParsed = JSON.parse(agendamentosSalvos);
        const agendamentosComData = agendamentosParsed.map((ag: any) => ({
          ...ag,
          dataCriacao: new Date(ag.dataCriacao)
        }));
        setAgendamentos(agendamentosComData);
      }

      if (usuariosSalvos) {
        const usuariosCarregados = JSON.parse(usuariosSalvos);
        
        const adminUser = usuariosCarregados.find((u: Usuario) => u.email === 'admin');
        if (!adminUser) {
          const usuariosComAdmin = [
            {
              id: 'admin',
              nome: 'Administrador',
              email: 'admin',
              telefone: '(11) 99999-9999',
              senha: 'admin',
              isAdmin: true,
            },
            ...usuariosCarregados
          ];
          setUsuarios(usuariosComAdmin);
        } else {
          setUsuarios(usuariosCarregados);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function salvarUsuario(usuario: Usuario | null) {
    try {
      if (usuario) {
        await AsyncStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario));
      } else {
        await AsyncStorage.removeItem(USUARIO_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  async function salvarAgendamentos(agendamentos: Agendamento[]) {
    try {
      await AsyncStorage.setItem(AGENDAMENTOS_STORAGE_KEY, JSON.stringify(agendamentos));
    } catch (error) {
      console.error('Erro ao salvar agendamentos:', error);
    }
  }

  async function salvarUsuarios(usuarios: Usuario[]) {
    try {
      const adminUser = usuarios.find(u => u.email === 'admin');
      if (!adminUser) {
        const usuariosComAdmin = [
          {
            id: 'admin',
            nome: 'Administrador',
            email: 'admin',
            telefone: '(11) 99999-9999',
            senha: 'admin',
            isAdmin: true,
          },
          ...usuarios
        ];
        await AsyncStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuariosComAdmin));
      } else {
        await AsyncStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
      }
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
    }
  }

  async function login(email: string, senha: string): Promise<boolean> {
    if (email === 'admin' && senha === 'admin') {
      const adminUser = usuarios.find(u => u.email === 'admin');
      if (adminUser) {
        setUsuario(adminUser);
        await salvarUsuario(adminUser);
        return true;
      }
    }
    
    const user = usuarios.find(u => u.email === email);
    
    if (user && user.senha === senha) {
      setUsuario(user);
      await salvarUsuario(user);
      return true;
    }
    
    return false;
  }

  async function cadastrar(nome: string, email: string, telefone: string, senha: string): Promise<boolean> {
    const emailExiste = usuarios.some(u => u.email === email);
    
    if (emailExiste) {
      return false;
    }
    
    const novoUsuario: Usuario = {
      id: Date.now().toString(),
      nome,
      email,
      telefone,
      senha,
      isAdmin: false,
    };
    
    const novosUsuarios = [...usuarios, novoUsuario];
    setUsuarios(novosUsuarios);
    setUsuario(novoUsuario);
    
    try {
      await Promise.all([
        salvarUsuario(novoUsuario),
        salvarUsuarios(novosUsuarios)
      ]);
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }

  async function logout(): Promise<void> {
    setUsuario(null);
    await salvarUsuario(null);
  }

  function adicionarAgendamento(agendamentoData: Omit<Agendamento, 'id' | 'usuarioId' | 'nomeUsuario' | 'telefoneUsuario' | 'dataCriacao'>) {
    if (!usuario) return;

    const novoAgendamento: Agendamento = {
      ...agendamentoData,
      id: Date.now().toString(),
      usuarioId: usuario.id,
      nomeUsuario: usuario.nome,
      telefoneUsuario: usuario.telefone,
      dataCriacao: new Date(),
    };

    const novosAgendamentos = [...agendamentos, novoAgendamento];
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  }

  function cancelarAgendamento(id: string) {
    const novosAgendamentos = agendamentos.map(ag => 
      ag.id === id ? { ...ag, status: 'cancelado' as const } : ag
    );
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  }

  function concluirAgendamento(id: string) {
    const novosAgendamentos = agendamentos.map(ag => 
      ag.id === id ? { ...ag, status: 'concluido' as const } : ag
    );
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  }

  function excluirAgendamento(id: string) {
    const novosAgendamentos = agendamentos.filter(ag => ag.id !== id);
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  }

  function remarcarAgendamento(id: string, novaData: string, novoHorario: string) {
    const novosAgendamentos = agendamentos.map(ag => 
      ag.id === id ? { ...ag, data: novaData, horario: novoHorario } : ag
    );
    setAgendamentos(novosAgendamentos);
    salvarAgendamentos(novosAgendamentos);
  }

  function getAgendamentosPorUsuario(usuarioId: string): Agendamento[] {
    return agendamentos.filter(ag => ag.usuarioId === usuarioId);
  }

  const value: AgendamentosContextData = {
    usuario,
    agendamentos,
    login,
    cadastrar,
    logout,
    adicionarAgendamento,
    cancelarAgendamento,
    concluirAgendamento,
    excluirAgendamento,
    remarcarAgendamento,
    getAgendamentosPorUsuario,
    isLoading,
  };

  return (
    <AgendamentosContext.Provider value={value}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  const context = useContext(AgendamentosContext);
  if (context === undefined) {
    throw new Error('useAgendamentos deve ser usado dentro de um AgendamentosProvider');
  }
  return context;
} 