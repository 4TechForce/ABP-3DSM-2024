// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';

const Header2: React.FC = () => {
  return (
    <HeaderContainer>
      <h1>Atualização de Perfil</h1>
    </HeaderContainer>
  );
};

// Estilos
const HeaderContainer = styled.header`
  background-color: #60b0ff;
  padding: 20px;
  color: white;
  text-align: center;
  border-radius: 8px;
`;

export default Header2;
