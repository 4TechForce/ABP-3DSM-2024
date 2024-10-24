import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

export default function Inicial() {
  const [startAnimation, setStartAnimation] = useState(false);

  const handleClick = () => {
    setStartAnimation(true);

    // Redireciona para a próxima página após 4 segundos (tempo da animação)
    setTimeout(() => {
      window.location.href = '/login';
    }, 4000);
  };

  return (
    <Sld>
      <BackgroundImage src='../Imagens/fundo.png' alt='Imagem de fundo' />
      <LogoContainer>
        <LogoImage src='../Imagens/Logo.png' alt='Descrição do logo' />
      </LogoContainer>

      <BotaoContainer>
        <Botao onClick={handleClick}>Comece já</Botao>
      </BotaoContainer>

      <BalloonsImage
        src='../Imagens/grupo balões.png'
        alt='Grupo de balões'
        animate={startAnimation} // Aqui passa a prop animate corretamente
      />
    </Sld>
  );
}

// Animação para o grupo de balões subir
const balloonFloat = keyframes`
  0% {
    transform: translateY(0); /* Posição inicial */
  }
  100% {
    transform: translateY(-150vh); /* Subir além do topo da tela */
  }
`;

const Sld = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #47B6FF;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

const LogoContainer = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const BotaoContainer = styled.div`
  position: relative;
  z-index: 3;
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const Botao = styled.button`
  background-color: #FFD700;
  color: #fff;
  font-size: 1.2rem;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #FFC700;
    transform: scale(1.05);
  }

  &:active {
    background-color: #FFA500;
  }
`;

// Definir o tipo para as props de BalloonsImage
interface BalloonsImageProps {
  animate: boolean; // Prop animate como boolean
}

// Ajuste para que a animação seja aplicada corretamente com base na prop `animate`
const BalloonsImage = styled.img<BalloonsImageProps>`
  position: absolute;
  bottom: 0;
  width: 85vw;
  height: auto;
  z-index: 2;

  ${({ animate }) => 
    animate &&
    css`
      animation: ${balloonFloat} 4s linear forwards;
  `}

  // Media queries para ajustes em diferentes tamanhos de tela
  @media (max-width: 1024px) {
    width: 75vw; // Ajusta para tablets
  }

  @media (max-width: 768px) {
    width: 70vw;
// Ajusta para telas menores
  }

  @media (max-width: 480px) {
    width: 65vw; // Ajusta para smartphones pequenos
  }
`;

