import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import Calendar from 'react-calendar';  // Importando o Calendar
import 'react-calendar/dist/Calendar.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Alimento {
  DESCRICAO_ALIMENTO: string;
  calorias: number;
  proteina: number;
  carboidratos: number;
  gordura: number;
  tipo: string;
}

interface Refeicao {
  refeicao: string;
  alimentos: Alimento[];
  data: string;
}

// Definindo o tipo do valor do calendário para ser compatível com a API
type Value = Date | Date[] | null;

const HistoricoRefeicoes: React.FC = () => {
  const { userId } = useAuth();
  const [historico, setHistorico] = useState<Refeicao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchHistorico = async () => {
      if (!userId) {
        setError('Usuário não está autenticado');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/food/refeicoes?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico de refeições');
        }
        const data = await response.json();
        if (data && data.historico && data.historico.length > 0) {
          setHistorico(data.historico);
          processChartData(data.historico);
        } else {
          setError('Nenhuma refeição encontrada para este usuário.');
        }
      } catch (err: any) {
        setError('Erro ao buscar histórico de refeições');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistorico();
    }
  }, [userId]);

  const processChartData = (historico: Refeicao[]) => {
    let construtores = 0;
    let reguladores = 0;
    let energeticos = 0;

    historico.forEach((item) => {
      item.alimentos.forEach((alimento) => {
        if (alimento.tipo === 'Construtor') {
          construtores += alimento.proteina;
        } else if (alimento.tipo === 'Regulador') {
          reguladores += alimento.carboidratos;
        } else if (alimento.tipo === 'Energetico') {
          energeticos += alimento.gordura;
        }
      });
    });

    const totalNutrientes = construtores + reguladores + energeticos;
    if (totalNutrientes > 0) {
      setChartData({
        construtores: {
          percentage: (construtores / totalNutrientes) * 100,
          label: 'Construtores',
        },
        reguladores: {
          percentage: (reguladores / totalNutrientes) * 100,
          label: 'Reguladores',
        },
        energeticos: {
          percentage: (energeticos / totalNutrientes) * 100,
          label: 'Energéticos',
        },
      });
    } else {
      setChartData(null);
    }
  };

  // Atualizando o tipo de 'value' para Date | Date[] | null
  const handleDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      // Se o valor for um intervalo de datas (por exemplo, [Date, Date]), você pode tratar isso
      // Aqui estamos assumindo que você deseja selecionar a primeira data do intervalo
      setSelectedDate(value[0]);
    } else if (value instanceof Date) {
      // Se o valor for uma data única, basta atualizar o estado
      setSelectedDate(value);
    }
  };

  const getRefeicoesByDate = (date: Date) => {
    const dateString = date.toLocaleDateString();
    return historico.filter((item) => new Date(item.data).toLocaleDateString() === dateString);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Histórico de Refeições</h1>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName="calendar-tile"
      />
      
      <div>
        {getRefeicoesByDate(selectedDate).length > 0 ? (
          <div>
            {chartData && (
              <>
                <div>
                  <CircularProgressbar
                    value={chartData.construtores.percentage}
                    text={`${Math.round(chartData.construtores.percentage)}%`}
                    styles={buildStyles({
                      textColor: '#fff',
                      pathColor: '#FF5733',
                      trailColor: '#eee',
                    })}
                  />
                  <p>{chartData.construtores.label}</p>
                </div>
                <div>
                  <CircularProgressbar
                    value={chartData.reguladores.percentage}
                    text={`${Math.round(chartData.reguladores.percentage)}%`}
                    styles={buildStyles({
                      textColor: '#fff',
                      pathColor: '#33FF57',
                      trailColor: '#eee',
                    })}
                  />
                  <p>{chartData.reguladores.label}</p>
                </div>
                <div>
                  <CircularProgressbar
                    value={chartData.energeticos.percentage}
                    text={`${Math.round(chartData.energeticos.percentage)}%`}
                    styles={buildStyles({
                      textColor: '#fff',
                      pathColor: '#33A1FF',
                      trailColor: '#eee',
                    })}
                  />
                  <p>{chartData.energeticos.label}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>Sem refeições neste dia.</div>
        )}
        <div>
          {getRefeicoesByDate(selectedDate).map((item, index) => (
            <div key={index}>
              <h3>{item.refeicao}</h3>
              <p>{new Date(item.data).toLocaleDateString()}</p>
              <h4>Alimentos:</h4>
              <ul>
                {item.alimentos.map((alimento, idx) => (
                  <li key={idx}>
                    <p>{alimento.DESCRICAO_ALIMENTO}</p>
                    <p>Tipo: {alimento.tipo}</p>
                    <p>Calorias: {alimento.calorias}</p>
                    <p>Proteínas: {alimento.proteina}g</p>
                    <p>Carboidratos: {alimento.carboidratos}g</p>
                    <p>Gordura: {alimento.gordura}g</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const Layout = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 18px;
`;

const CalendarWrapper = styled.div`
  margin: 0 auto;
  max-width: 400px;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

const ChartWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin: 10px;
`;

const ChartLabel = styled.div`
  text-align: center;
  font-size: 14px;
`;

const HistoricoList = styled.div`
  margin-top: 20px;
`;

const HistoricoItem = styled.div`
  margin: 10px 0;
`;

const RefeicaoTitle = styled.h3`
  font-size: 18px;
  color: #333;
`;

const DateText = styled.p`
  font-size: 14px;
  color: #888;
`;

const AlimentosList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AlimentoItem = styled.li`
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const AlimentoName = styled.h4`
  font-size: 16px;
  color: #555;
`;

const NoRecordsMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #888;
`;

const RefeicoesWrapper = styled.div`
  margin-top: 30px;
`;

export default HistoricoRefeicoes;
