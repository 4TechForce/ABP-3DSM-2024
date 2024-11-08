import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Componente de Header
const Header: React.FC<{ onSettingsClick: () => void; onLogoutClick: () => void }> = ({ onSettingsClick, onLogoutClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <NavContainer>
      <Logo><img src="../Imagens/Logo.png" alt="Logo" /></Logo>
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
  color:black;
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


export default Header;
