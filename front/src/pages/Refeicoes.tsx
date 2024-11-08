import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaUserAlt } from 'react-icons/fa'; // Ícone do usuário
import { useNavigate } from 'react-router-dom';

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

type Value = Date | Date[] | null;

const HistoricoRefeicoes: React.FC = () => {
  const { userId } = useAuth();
  const [historico, setHistorico] = useState<Refeicao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);  // Tipo de chartData pode ser melhorado
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Estado para dropdown
  const navigate = useNavigate();

  // Função para abrir as configurações
  const handleConfiguraçõesClick = () => navigate(`/profile/update/${userId}`);

  // Função para realizar o logout
  const handleLogout = () => {
    navigate("/logout");
  };

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

  const handleDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0]);
    } else if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const getRefeicoesByDate = (date: Date) => {
    const dateString = date.toLocaleDateString();
    return historico.filter((item) => new Date(item.data).toLocaleDateString() === dateString);
  };
  

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  

  return (
    <Layout>
      <Header>
        <Logo><img src="../Imagens/Logo.png" alt="Logo" /></Logo>
        <UserProfile onClick={toggleDropdown}>
          <Avatar src="https://via.placeholder.com/50" alt="Avatar" />
          <span>Usuário</span>
          <FaUserAlt size={20} />
          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={handleConfiguraçõesClick}>Configurações</DropdownItem>
              <DropdownItem onClick={handleLogout}>Sair</DropdownItem>
              <DropdownItem>Perfil</DropdownItem>
            </DropdownMenu>
          )}
        </UserProfile>
      </Header>
      <ContentWrapper>
        <MainWrapper>
          {/* Novo contêiner para o layout flex */}
          <FlexContainer>
            <CalendarWrapper>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
              />
            </CalendarWrapper>

            <HistoricoWrapper>
              {getRefeicoesByDate(selectedDate).length > 0 ? (
                <>
                  <div>
                    {chartData && (
                      <ChartsWrapper>
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
                      </ChartsWrapper>
                    )}
                  </div>

                  {getRefeicoesByDate(selectedDate).map((item, index) => (
                    <HistoricoItem key={index}>
                      <RefeicaoTitle>{item.refeicao}</RefeicaoTitle>
                      <DateText>{new Date(item.data).toLocaleDateString()}</DateText>
                      <h4>Alimentos:</h4>
                      <AlimentosList>
                        {item.alimentos.map((alimento, idx) => (
                          <AlimentoItem key={idx}>
                            <AlimentoName>{alimento.DESCRICAO_ALIMENTO}</AlimentoName>
                            <p>Tipo: {alimento.tipo}</p>
                            <p>Calorias: {alimento.calorias}</p>
                            <p>Proteínas: {alimento.proteina}g</p>
                            <p>Carboidratos: {alimento.carboidratos}g</p>
                            <p>Gordura: {alimento.gordura}g</p>
                          </AlimentoItem>
                        ))}
                      </AlimentosList>
                    </HistoricoItem>
                  ))}
                </>
              ) : (
                <NoRecordsMessage>Sem refeições neste dia.</NoRecordsMessage>
              )}
            </HistoricoWrapper>
          </FlexContainer>
        </MainWrapper>
      </ContentWrapper>
    </Layout>
  );
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const MainWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const CalendarWrapper = styled.div`
  margin-top:10%;
  width: 40%;
`;

const HistoricoWrapper = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
`;



const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;
// Estilos
const Container = styled.div`
  padding: 0 0 0px 0px;
  font-family: Arial, sans-serif;
  background-color: #FFFF;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 97.5vw;
  background-color: #60b0ff;
  padding: 20px;
  color: black;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 250px;
    height: auto;
    @media (max-width: 768px) {
      width: 80px;
    }
    @media (max-width: 480px) {
      width: 60px;
    }
  }
`;

const UserProfile = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color:white;

  span {
    font-size: 16px;
  }
`;



const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  color:black
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #f7f7f7;
    transform: scale(1.05);
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #f8f9fa;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
`;

const NavButton = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  color: ${({ active }) => (active ? '#007bff' : '#333')};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  text-align: center;
  gap: 8px;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s;

  &:hover {
    color: #007bff;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
    transform: scale(1.05);
  }

  span {
    font-size: 14px;
  }
`;

const IconContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;



const HistoricoItem = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

const RefeicaoTitle = styled.h3`
  margin-bottom: 10px;
`;

const DateText = styled.p`
  font-style: italic;
`;

const AlimentosList = styled.div`
  margin-top: 10px;
`;

const AlimentoItem = styled.div`
  background-color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AlimentoName = styled.h4`
  margin-bottom: 5px;
`;

const NoRecordsMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export default HistoricoRefeicoes;
