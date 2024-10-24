// PratoComponent.tsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Interface de dados
interface Food {
  id: number;
  name: string;
  type: 'energetico' | 'construtor' | 'regulador';
  image: string;
}

const PratoComponent = () => {
  const [energetico, setEnergetico] = useState<Food | null>(null);
  const [construtor, setConstrutor] = useState<Food | null>(null);
  const [regulador, setRegulador] = useState<Food | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    // Consulta à API de alimentos (ajuste a rota conforme a sua API)
    fetch('/api/foods')
      .then((response) => response.json())
      .then((data) => setFoods(data));
  }, []);

  // Função para tocar som de feedback
  const playSound = (sound: string) => {
    const audio = new Audio(sound);
    audio.play();
  };

  return (
    <PageContainer>
      <Title>Monte o seu prato saudável!</Title>
      <Plate>
        <PlateSection
          className={energetico ? 'filled' : ''}
          position={{ top: '5%', left: '50%', transform: 'translate(-50%, 0)' }}
        >
          {energetico ? <FoodImage src={energetico.image} alt={energetico.name} /> : 'Energético'}
        </PlateSection>
        <PlateSection
          className={construtor ? 'filled' : ''}
          position={{ top: '55%', left: '20%' }}
        >
          {construtor ? <FoodImage src={construtor.image} alt={construtor.name} /> : 'Construtor'}
        </PlateSection>
        <PlateSection
          className={regulador ? 'filled' : ''}
          position={{ top: '55%', left: '80%', transform: 'translate(-100%, 0)' }}
        >
          {regulador ? <FoodImage src={regulador.image} alt={regulador.name} /> : 'Regulador'}
        </PlateSection>
      </Plate>

      <FoodSelectorContainer>
        <h2>Escolha os alimentos:</h2>

        <FoodGroup>
          <h3>Energéticos</h3>
          {foods.filter(food => food.type === 'energetico').map(food => (
            <FoodButton key={food.id} onClick={() => { setEnergetico(food); playSound('/sounds/click.mp3'); }}>
              {food.name}
            </FoodButton>
          ))}
        </FoodGroup>

        <FoodGroup>
          <h3>Construtores</h3>
          {foods.filter(food => food.type === 'construtor').map(food => (
            <FoodButton key={food.id} onClick={() => { setConstrutor(food); playSound('/sounds/click.mp3'); }}>
              {food.name}
            </FoodButton>
          ))}
        </FoodGroup>

        <FoodGroup>
          <h3>Reguladores</h3>
          {foods.filter(food => food.type === 'regulador').map(food => (
            <FoodButton key={food.id} onClick={() => { setRegulador(food); playSound('/sounds/click.mp3'); }}>
              {food.name}
            </FoodButton>
          ))}
        </FoodGroup>
      </FoodSelectorContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background-color: #f0f8ff;
`;

const Title = styled.h1`
  color: #ff6347;
  font-size: 36px;
  margin-bottom: 20px;
`;

const Plate = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: #ffe4b5;
  margin-bottom: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
`;

const plateBounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const growIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const FoodImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  animation: ${growIn} 0.6s ease-in-out;
`;

interface PlateSectionProps {
  position: {
    top?: string;
    left?: string;
    transform?: string;
  };
}

const PlateSection = styled.div<PlateSectionProps>`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.3s;
  font-size: 24px;
  ${({ position }) => position && `
    top: ${position.top};
    left: ${position.left};
    transform: ${position.transform || 'none'};
  `}

  &.filled {
    background-color: #f9d423;
    animation: ${plateBounce} 0.6s ease-in-out;
    font-size: 32px;
  }
`;

const FoodSelectorContainer = styled.div`
  width: 80%;
  max-width: 600px;
  background-color: #fffbea;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const FoodGroup = styled.div`
  margin: 15px 0;
`;

const FoodButton = styled.button`
  background-color: #ffeb3b;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    background-color: #ffca28;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1.05);
  }
`;

export default PratoComponent;
