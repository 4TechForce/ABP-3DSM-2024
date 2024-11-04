import React from 'react';
import styled from 'styled-components';
import { FaHistory, FaAppleAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <StyledNavBar>
      <NavButton onClick={() => handleNavigation('/historico')}>
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
      <NavButton onClick={() => handleNavigation('/informacoes')}>
        <IconContainer color="#e4f1ff">
          <FaInfoCircle color="#0077ff" size={24} />
        </IconContainer>
        <span>Informações</span>
      </NavButton>
    </StyledNavBar>
  );
};

// Estilos
const StyledNavBar = styled.nav`
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

export default NavBar;
