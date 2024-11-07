import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importe o hook useAuth para acessar o contexto
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Alimento {
  DESCRICAO_ALIMENTO: string;
  calorias: number;
  proteina: number;
  carboidratos: number;
  gordura: number;
  tipo: string;  // Pode ser 'Construtor', 'Regulador' ou 'Energetico'
}

interface Refeicao {
  refeicao: string;
  alimentos: Alimento[]; // Agora alimentos tem a estrutura correta com os dados nutricionais
  data: string;
}

const HistoricoRefeicoes: React.FC = () => {
  const { userId } = useAuth(); // Aqui obtemos o userId do contexto de autenticação
  const [historico, setHistorico] = useState<Refeicao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchHistorico = async () => {
      console.log("UserId:", userId);  // Verifique se o userId está sendo recuperado corretamente
      if (!userId) {
        setError('Usuário não está autenticado');
        return;
      }
    
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/food/refeicoes?userId=${userId}`);  // Envie o userId na URL da requisição
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico de refeições');
        }
        const data = await response.json();
    
        console.log('Resposta da API:', data);  // Veja a estrutura da resposta
    
        if (data && data.historico && data.historico.length > 0) {
          setHistorico(data.historico);  // Preencha o estado com as refeições recebidas
          processChartData(data.historico);
        } else {
          setError('Nenhuma refeição encontrada para este usuário.');
        }
        setError(null);
      } catch (err: any) {
        setError('Erro ao buscar histórico de refeições');
        console.error(err);  // Exiba o erro completo no console
      } finally {
        setLoading(false);
      }
    };
  
    // Verifique se o userId foi definido
    if (userId) {
      fetchHistorico();
    }
  }, [userId]); 

  const processChartData = (historico: Refeicao[]) => {
    let construtores = 0;
    let reguladores = 0;
    let energeticos = 0;
  
    // Soma os valores de cada tipo de nutriente
    historico.forEach((item) => {
      item.alimentos.forEach((alimento) => {
        console.log(`Alimento: ${alimento.DESCRICAO_ALIMENTO}, Tipo: ${alimento.tipo}`); // Verifica o tipo do alimento
        if (alimento.tipo === 'Construtor') {
          construtores += alimento.proteina;  // Aqui você pode somar as proteínas, por exemplo
        } else if (alimento.tipo === 'Regulador') {
          reguladores += alimento.carboidratos;  // Você pode somar carboidratos, por exemplo
        } else if (alimento.tipo === 'Energetico') {
          energeticos += alimento.gordura;  // Aqui você pode somar a gordura, por exemplo
        }
      });
    });
  
    console.log(`Construtores: ${construtores}, Reguladores: ${reguladores}, Energéticos: ${energeticos}`);  // Verifica os totais
  
    // Calcular a soma total dos nutrientes
    const totalNutrientes = construtores + reguladores + energeticos;
  
    // Verifique se o totalNutrientes está maior que 0 para evitar divisões por zero
    if (totalNutrientes > 0) {
      // Configuração dos dados para o gráfico circular
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
      // Caso não haja nutrientes válidos
      setChartData(null);
    }
  };

  if (loading) return <LoadingMessage>Carregando...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Layout>
      <Title>Histórico de Refeições</Title>
      {historico.length > 0 ? (
        <>
          <ChartsWrapper>
            <ChartWrapper>
              <CircularProgressbar
                value={chartData?.construtores?.percentage || 0}
                text={`${Math.round(chartData?.construtores?.percentage || 0)}%`}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: '#FF5733',  // Cor para os Construtores
                  trailColor: '#eee',
                })}
              />
              <ChartLabel>{chartData?.construtores?.label}</ChartLabel>
            </ChartWrapper>
            <ChartWrapper>
              <CircularProgressbar
                value={chartData?.reguladores?.percentage || 0}
                text={`${Math.round(chartData?.reguladores?.percentage || 0)}%`}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: '#33FF57',  // Cor para os Reguladores
                  trailColor: '#eee',
                })}
              />
              <ChartLabel>{chartData?.reguladores?.label}</ChartLabel>
            </ChartWrapper>
            <ChartWrapper>
              <CircularProgressbar
                value={chartData?.energeticos?.percentage || 0}
                text={`${Math.round(chartData?.energeticos?.percentage || 0)}%`}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: '#33A1FF',  // Cor para os Energéticos
                  trailColor: '#eee',
                })}
              />
              <ChartLabel>{chartData?.energeticos?.label}</ChartLabel>
            </ChartWrapper>
          </ChartsWrapper>

          <HistoricoList>
            {historico.map((item, index) => (
              <HistoricoItem key={index}>
                <RefeicaoTitle>{item.refeicao}</RefeicaoTitle>
                <DateText>{new Date(item.data).toLocaleDateString()}</DateText>
                <h4>Alimentos:</h4>
                <AlimentosList>
                  {item.alimentos.map((alimento, idx) => (
                    <AlimentoItem key={idx}>
                      <AlimentoName>{alimento.DESCRICAO_ALIMENTO}</AlimentoName>
                      <p>Tipo: {alimento.tipo}</p>  {/* Exibe o tipo do alimento */}
                      <p>Proteína: {alimento.proteina} g</p>
                      <p>Carboidrato: {alimento.carboidratos} g</p>
                      <p>Gordura: {alimento.gordura} g</p>
                    </AlimentoItem>
                  ))}
                </AlimentosList>
              </HistoricoItem>
            ))}
          </HistoricoList>
        </>
      ) : (
        <NoRecordsMessage>Não há registros de refeições para este usuário.</NoRecordsMessage>
      )}
    </Layout>
  );
};

const Layout = styled.div`
  padding: 30px;
  max-width: 900px;
  margin: 40px auto;
  background-color: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #007BFF;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 1.2rem;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const ChartWrapper = styled.div`
  width: 25%;
`;

const ChartLabel = styled.p`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const HistoricoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const HistoricoItem = styled.li`
  padding: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  border-radius: 8px;
`;

const RefeicaoTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const DateText = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const AlimentosList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AlimentoItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const AlimentoName = styled.strong`
  font-size: 1rem;
  display: block;
`;

const NoRecordsMessage = styled.p`
  text-align: center;
  color: #888;
  font-size: 1rem;
`;

export default HistoricoRefeicoes;
