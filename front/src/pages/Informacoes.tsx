// src/components/UserHistory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';  // Importa o contexto de autenticação
import { useNavigate } from 'react-router-dom';

interface Alimento {
  DESCRICAO_ALIMENTO: string;
  calorias: number;
  proteina: number;
  carboidratos: number;
  gordura: number;
}

interface HistoricoEntry {
  _id: string;
  data: string;
  refeicao: string;
  alimentos: Alimento[];
}

const UserHistory: React.FC = () => {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoricoEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Função para buscar o histórico
  const fetchHistory = async () => {
    if (!userId) {
      setError("Erro: ID de usuário não encontrado.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get<HistoricoEntry[]>(`/food/refeicoes?userId=${userId}`);
      setHistory(response.data);
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? `Nenhum registro encontrado para o usuário ${userId}`
          : 'Erro ao buscar dados do histórico'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Histórico de Refeições do Usuário</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '20px' }}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          history.length > 0 && (
            <div>
              <h3>Histórico de refeições para o usuário:</h3>
              <ul>
                {history.map((entry) => (
                  <li key={entry._id}>
                    <p><strong>Data:</strong> {new Date(entry.data).toLocaleDateString()}</p>
                    <p><strong>Refeição:</strong> {entry.refeicao}</p>
                    <p><strong>Alimentos:</strong></p>
                    <ul>
                      {entry.alimentos.map((alimento, index) => (
                        <li key={index}>
                          {alimento.DESCRICAO_ALIMENTO} - 
                          {` Calorias: ${alimento.calorias}, Proteína: ${alimento.proteina}g, Carboidratos: ${alimento.carboidratos}g, Gordura: ${alimento.gordura}g`}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserHistory;
