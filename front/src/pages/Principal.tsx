import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaInfoCircle, FaHistory, FaUserAlt, FaAppleAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

// Interface para refeição
interface Meal {
  descricao: string; // Alimento
  tipo_alimento: string; // Tipo de alimento
  grupo: string; // Grupo do alimento
}

// Componente principal
const Principal: React.FC = () => {
  const { userId } = useAuth();
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');
  const [groupedMeals, setGroupedMeals] = useState<{ [key: string]: Meal[] }>({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const navigate = useNavigate();

  // Função para buscar dados da API
  const fetchMeals = async () => {
    try {
      const response = await fetch(`http://localhost:3001/food/group?q=${query}`);
      const data = await response.json();

      // Agrupar as refeições pelo tipo
      const grouped = data.reduce((acc: { [key: string]: Meal[] }, meal: Meal) => {
        const { grupo } = meal;
        if (!acc[grupo]) {
          acc[grupo] = [];
        }
        acc[grupo].push(meal);
        return acc;
      }, {});

      setGroupedMeals(grouped);
    } catch (error) {
      console.error('Erro ao buscar as refeições:', error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [query]);

  // Funções para navegação
  const handleLogout = () => {
    navigate("/logout");
  };

  const handleHistoricoClick = () => {
    navigate('/historico');
  };

  const handleAlimentosClick = () => {
    navigate('/alimentos');
  };

  const handleInformacoesClick = () => {
    navigate('/informacoes');
  };

  // Função para abrir/fechar o modal de configurações
  const toggleConfigModal = () => setShowConfigModal(!showConfigModal);

  // Função para salvar as configurações no banco de dados
  const handleSaveConfig = async () => {
    if (!userId) {
      alert("ID do usuário não está definido.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mail, password }),
      });

      if (response.ok) {
        alert("Configurações salvas com sucesso!");
      } else {
        alert("Erro ao salvar as configurações.");
      }
    } catch (error) {
      console.error("Erro ao salvar as configurações:", error);
      alert("Erro ao salvar as configurações.");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header
        onSettingsClick={toggleConfigModal}
        onLogoutClick={handleLogout}
      />
      <NavBar1>
        <NavButton1>
          <IconContainer1 color="#d4e4ff">
            <FaHistory color="#007bff" size={24} />
          </IconContainer1>
          <span>Meu histórico</span>
        </NavButton1>
        <NavButton1 active onClick={handleAlimentosClick}>
          <IconContainer1 color="#ffe4e4">
            <FaAppleAlt color="#ff4d4d" size={24} />
          </IconContainer1>
          <span>Alimentos</span>
        </NavButton1>
        <NavButton1>
          <IconContainer1 color="#e4f1ff">
            <FaInfoCircle color="#0077ff" size={24} />
          </IconContainer1>
          <span>Informações</span>
        </NavButton1>
      </NavBar1>
      <Layout>
        <h1>Café da Manhã</h1>

        {/* Renderizando os alimentos agrupados em colunas */}
        <Columns>
  {Object.keys(groupedMeals).map((grupo) => (
    <Column key={grupo}>
      <h2>{grupo}</h2>
      <table>
        <thead>
          <tr>
            <th>Alimento</th>
          </tr>
        </thead>
        <tbody>
          {groupedMeals[grupo].map((meal, index) => (
            <tr key={index}>
              <td>{meal.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Column>
  ))}
</Columns>

        <AddButton>Adicionar +</AddButton>
      </Layout>

      {/* Modal de Configurações */}
      {showConfigModal && (
        <ConfigModalOverlay>
          <ConfigModalContent>
            <h2>Configurações</h2>
            <TextField
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              type="email"
              placeholder="Email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
            <TextField
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ButtonGroup>
              <ModalButton onClick={handleSaveConfig}>Salvar</ModalButton>
              <ModalButton onClick={toggleConfigModal}>Cancelar</ModalButton>
            </ButtonGroup>
          </ConfigModalContent>
        </ConfigModalOverlay>
      )}
    </>
  );
};


const NavBar1 = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #f8f9fa;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
`;

const NavButton1 = styled.button<{ active?: boolean }>`
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

const IconContainer1 = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;




// Estilo do Modal de Configurações
const ConfigModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfigModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextField = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

// Estilo da Tabela e Botão de Adicionar
const Layout = styled.div`
  padding: 20px;
`;

const Columns = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px; /* Adicionando um espaço acima das colunas */
`;

const Column = styled.div`
  flex: 1; /* Isso faz cada coluna ocupar o mesmo espaço */
  margin-right: 20px; /* Espaçamento entre colunas */
  
  &:last-child {
    margin-right: 0; /* Remove a margem da última coluna */
  }

  h2 {
    margin-bottom: 10px; /* Adiciona um espaçamento abaixo do título da coluna */
    color: #333; /* Cor do texto do título */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra na tabela para destaque */
    border-radius: 8px; /* Bordas arredondadas */
    overflow: hidden; /* Para que as bordas arredondadas apareçam */
  }

  th, td {
    padding: 12px; /* Mais espaço interno */
    border: 1px solid #e0e0e0; /* Borda mais suave */
    text-align: left;
    transition: background-color 0.2s;
  }

  th {
    background-color: #007bff; /* Cor de fundo dos cabeçalhos */
    color: white; /* Cor do texto dos cabeçalhos */
    font-weight: bold; /* Texto em negrito */
  }

  td {
    background-color: #ffffff; /* Cor de fundo das células */
  }

  tr:hover td {
    background-color: #f1f1f1; /* Cor de destaque ao passar o mouse */
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #ff8c00;
    transform: scale(1.05);
  }
`;

// Estilo Global
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f2f2f2;
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
  border: none;
  cursor: pointer;
  color: ${(props) => (props.active ? '#007bff' : '#333')};

  span {
    margin-top: 5px;
  }
`;

const IconContainer = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  border-radius: 50%;
  padding: 10px;
`;

export default Principal;
