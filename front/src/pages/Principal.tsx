import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaCalendarAlt, FaBook, FaInfoCircle, FaHistory, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Interface para refeição
interface Meal {
  alimento: string;
  calorias: number;
  proteina: number;
  carboidratos: number;
  fibras: number;
  gordura: number;
}

// Componente principal
const Principal: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Para redirecionamento

  // Função para buscar dados da API
  const fetchMeals = async () => {
    try {
      const response = await fetch('http://localhost:3000/food/search');
      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Erro ao buscar as refeições:', error);
    }
  };

  // Chama a função fetchMeals quando o componente for montado
  useEffect(() => {
    fetchMeals();
  }, []);

  // Função para alternar o dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Funções para navegação
  const handleSettingsClick = () => {
    navigate('/configuracoes');
  };

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

  return (
    <>
      <GlobalStyle />
      <NavBar 
        dropdownOpen={dropdownOpen} 
        toggleDropdown={toggleDropdown} 
        onSettingsClick={handleSettingsClick} 
        onLogoutClick={handleLogout} 
        onHistoricoClick={handleHistoricoClick} 
        onAlimentosClick={handleAlimentosClick} 
        onInformacoesClick={handleInformacoesClick} 
      />
      <Layout>
        <h1>Café da manhã</h1>
        <TableSection>
          <table>
            <thead>
              <tr>
                <th>Alimento</th>
                <th>Calorias</th>
                <th>Proteína</th>
                <th>Carboidratos</th>
                <th>Fibras</th>
                <th>Gordura</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.alimento}</td>
                  <td>{meal.calorias}</td>
                  <td>{meal.proteina}g</td>
                  <td>{meal.carboidratos}g</td>
                  <td>{meal.fibras}g</td>
                  <td>{meal.gordura}g</td>
                </tr>
              ))}
            </tbody>
          </table>
          <AddButton>Adicionar +</AddButton>
        </TableSection>
      </Layout>
    </>
  );
};

// Componente de Barra de Navegação
const NavBar: React.FC<{ 
  dropdownOpen: boolean; 
  toggleDropdown: () => void; 
  onSettingsClick: () => void; 
  onLogoutClick: () => void; 
  onHistoricoClick: () => void; 
  onAlimentosClick: () => void; 
  onInformacoesClick: () => void; 
}> = ({ dropdownOpen, toggleDropdown, onSettingsClick, onLogoutClick, onHistoricoClick, onAlimentosClick, onInformacoesClick }) => {
  return (
    <NavContainer>
      <Logo>Pequenos <span>Sabores</span></Logo>
      <NavOptions>
        <NavItem onClick={onHistoricoClick}>
          <FaHistory size={20} />
          <span>Histórico</span>
        </NavItem>
        <NavItem onClick={onAlimentosClick}>
          <FaBook size={20} />
          <span>Alimentos</span>
        </NavItem>
        <NavItem onClick={onInformacoesClick}>
          <FaInfoCircle size={20} />
          <span>Informações</span>
        </NavItem>
      </NavOptions>
      <UserProfile onClick={toggleDropdown}>
        <Avatar src="https://via.placeholder.com/50" alt="Avatar" />
        <span>Usuário</span>
        <FaUserAlt size={20} />
        {dropdownOpen && (
          <DropdownMenu>
            <DropdownItem onClick={onSettingsClick}>Configurações</DropdownItem>
            <DropdownItem onClick={onLogoutClick}>Sair</DropdownItem>
            <DropdownItem>Perfil</DropdownItem>
          </DropdownMenu>
        )}
      </UserProfile>
    </NavContainer>
  );
};

// Estilos com styled-components
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #60b0ff;
  padding: 20px;
  color: black;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;

  span {
    color: #f7a8ff;
  }
`;

const NavOptions = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 20px;
    span {
      font-size: 12px;
    }
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin-bottom: 5px;
  }

  span {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const UserProfile = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  span {
    font-size: 16px;
  }
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
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #f7f7f7;
  }
`;

// Estilo da Tabela e Botão de Adicionar
const Layout = styled.div`
  padding: 20px;
`;

const TableSection = styled.section`
  margin-top: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f7f7f7;
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff8c00;
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
    background-color: #f0f0f0;
    color: #333;
  }
`;

export default Principal;
