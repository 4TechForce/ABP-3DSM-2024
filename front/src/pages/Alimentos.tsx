import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHistory, FaAppleAlt, FaInfoCircle, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FoodSearch: React.FC = () => {
  const { userId } = useAuth();
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/food/search?q=${query}`);
      const data = await response.json();

      if (response.ok) {
        setFoods(data);
      } else {
        throw new Error(data.message || 'Erro ao buscar alimentos');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleConfiguraçõesClick = () => navigate(`/profile/update/${userId}`);


  const handleLogout = () => {
    navigate("/logout");
  };
  const handleHistorico = () => {
    navigate("/refeicoes");
  };

  return (
    <Container>
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
      <NavBar>
        <NavButton onClick={handleHistorico}>
          <IconContainer color="#d4e4ff">
            <FaHistory color="#007bff" size={24} />
          </IconContainer>
          <span>Meu histórico</span>
        </NavButton>
        <NavButton active>
          <IconContainer color="#ffe4e4">
            <FaAppleAlt color="#ff4d4d" size={24} />
          </IconContainer>
          <span>Alimentos</span>
        </NavButton>
        <NavButton>
          <IconContainer color="#e4f1ff">
            <FaInfoCircle color="#0077ff" size={24} />
          </IconContainer>
          <span>Informações</span>
        </NavButton>
      </NavBar>
      <SearchSection>
        <input
          type="text"
          placeholder="Buscar alimentos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </SearchSection>

      {loading && <Message>Carregando...</Message>}
      {error && <Message error>{error}</Message>}

      {foods.length > 0 && (
        <TableContainer>
          <Table>
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
              {foods.map((food, index) => (
                <tr key={index}>
                  <td>{food.descricao}</td>
                  <td>{food.energeticos.calorias}</td>
                  <td>{food.construtores.proteina}</td>
                  <td>{food.energeticos.carboidratos}</td>
                  <td>{food.reguladores.nutrientes.fibras}</td>
                  <td>{food.reguladores.nutrientes.gordura}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
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

const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  input {
    width: 300px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-right: 10px;
    outline: none;
    font-size: 16px;
  }

  button {
    padding: 10px 20px;
    background-color: #6a8cff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
      background-color: #5a7be1;
    }
  }
`;

const Message = styled.p<{ error?: boolean }>`
  text-align: center;
  font-size: 16px;
  color: ${({ error }) => (error ? '#e63946' : '#333')};
  margin-top: 10px;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 12px;
    border: 1px solid #e0e0e0;
    text-align: center;
    font-size: 14px;
    color: #333;
  }

  th {
    background-color: #6a8cff;
    color: white;
  }

  tbody tr:nth-child(even) {
    background-color: #f7f7f7;
  }
`;

export default FoodSearch;
