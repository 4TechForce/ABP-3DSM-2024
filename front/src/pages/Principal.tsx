import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { FaHistory, FaAppleAlt, FaInfoCircle } from 'react-icons/fa';

interface Meal {
  descricao: string;
  tipo_alimento: string;
  grupo: string;
  DESCRICAO_ALIMENTO?: string;
}

const Principal: React.FC = () => {
  const { userId } = useAuth();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
  const [mealType, setMealType] = useState("CafeDaManha"); // Tipo de refeição
  const [dropdownVisible, setDropdownVisible] = useState(false); // Controla a visibilidade do dropdown
  const [plateImage, setPlateImage] = useState<string>('path/to/empty-plate.png'); // Caminho da imagem do prato
  const navigate = useNavigate();

  // Função para buscar alimentos
  const fetchMeals = async () => {
    if (!query) {
      setDropdownVisible(false); // Esconde o dropdown se o campo de busca estiver vazio
      return;
    }

    setDropdownVisible(true); // Exibe o dropdown quando houver texto no input

    try {
      const response = await fetch(`http://localhost:3001/food/group?q=${query}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.error("Resposta inesperada da API:", data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar as refeições:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [query]);

  const checkPlateCondition = (selectedMeals: Meal[]) => {
    const hasEnergetico = selectedMeals.some((meal) => meal.grupo === 'Energéticos');
    const hasConstrutor = selectedMeals.some((meal) => meal.grupo === 'Construtores');
    const hasRegulador = selectedMeals.some((meal) => meal.grupo === 'Reguladores');
  
    console.log("Has Energetico:", hasEnergetico);
    console.log("Has Construtor:", hasConstrutor);
    console.log("Has Regulador:", hasRegulador);
  
    if (hasEnergetico && hasConstrutor && hasRegulador) {
      setPlateImage('../Imagens/Completo.png'); // Imagem do prato completo
    } else {
      setPlateImage('../Imagens/Incompleto.png'); // Imagem do prato incompleto
    }
  };
  
  
  const handleAddMeal = (meal: Meal) => {
    const updatedMeal = {
      DESCRICAO_ALIMENTO: meal.descricao,
      tipo_alimento: meal.tipo_alimento,
      grupo: meal.grupo,
      descricao: meal.descricao,
    };
    const updatedMeals = [...selectedMeals, updatedMeal];
    setSelectedMeals(updatedMeals);
  
    // Log para verificar o tipo de alimento
    console.log("Tipo de alimento selecionado:", meal.tipo_alimento);
    console.log("Grupo de alimento:", meal.grupo);  // Log do grupo do alimento
  
    // Chama checkPlateCondition após a atualização do estado
    setTimeout(() => {
      checkPlateCondition(updatedMeals);
    }, 0);
  
    setDropdownVisible(false); // Esconde o dropdown quando um item é selecionado
  };
  

  const handleSaveMeals = async () => {
    try {
      const response = await fetch('http://localhost:3001/food/historico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          refeicao: mealType,
          alimentos: selectedMeals,
        }),
      });
      if (response.ok) {
        console.log("Refeição salva com sucesso!");
      } else {
        console.error("Erro ao salvar refeição.");
      }
    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
    }
  };

  // Navegação
  const handleLogout = () => navigate('/logout');
  const handleHistoricoClick = () => navigate('/refeicoes');
  const handleAlimentosClick = () => navigate('/alimentos');
  const handleConfiguraçõesClick = () => navigate(`/profile/update/${userId}`);

  return (
    <>
      <GlobalStyle />
      <Header onSettingsClick={handleConfiguraçõesClick} onLogoutClick={handleLogout} />
      <NavBar>
        <NavButton onClick={handleHistoricoClick}>
          <IconContainer color="#d4e4ff">
            <FaHistory color="#007bff" size={24} />
          </IconContainer>
          <span>Meu Histórico</span>
        </NavButton>
        <NavButton onClick={handleAlimentosClick}>
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

      <Layout>
        <h1>Adicionar Alimento ao Histórico</h1>

        {/* Imagem do prato */}
        <PlateImage src={"../Imagens/vazio.png"} alt="Prato" />

        <Input
          placeholder="Digite o nome do alimento"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <SelectMealType value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="CafeDaManha">Café da Manhã</option>
          <option value="Almoco">Almoço</option>
          <option value="CafeDaTarde">Café da Tarde</option>
          <option value="Janta">Janta</option>
        </SelectMealType>

        {dropdownVisible && (
          <SearchResults>
            {Array.isArray(searchResults) && searchResults.map((meal, index) => (
              <ResultItem key={index} onClick={() => handleAddMeal(meal)}>
                {meal.descricao}
              </ResultItem>
            ))}
          </SearchResults>
        )}

        <SelectedMeals>
          <h2>Alimentos Selecionados</h2>
          {selectedMeals.map((meal, index) => (
            <div key={index}>{meal.DESCRICAO_ALIMENTO}</div>
          ))}
        </SelectedMeals>

        <SaveButton onClick={handleSaveMeals}>Salvar</SaveButton>
      </Layout>
    </>
  );
};

// Estilos globais
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

// Estilos
const Layout = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  background-color: ${({ color }) => color};
  border-radius: 50%;
  padding: 10px;
`;

const PlateImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin: 20px 0;
  border-radius: 8px;
  transition: opacity 0.3s ease-in-out;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const SelectMealType = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const SearchResults = styled.div`
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ResultItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const SelectedMeals = styled.div`
  margin-top: 20px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

export default Principal;
