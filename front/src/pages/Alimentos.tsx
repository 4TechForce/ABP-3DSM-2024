import React, { useState } from 'react';
import styled from 'styled-components';

const FoodSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <Container>
      <SearchBar>
        <input
          type="text"
          placeholder="Buscar alimentos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </SearchBar>

      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}

      {foods.length > 0 && (
        <Results>
          <h2>Resultados da busca:</h2>
          <ul>
            {foods.map((food, index) => (
              <li key={index}>
                <strong>{food.descricao}</strong><br />
                Preparação: {food.preparacao}<br />
                Tipo de alimento: {food.tipo_alimento}<br />
                Proteína: {food.construtores.proteina}g<br />
                Carboidratos: {food.energeticos.carboidratos}g<br />
                Calorias: {food.energeticos.calorias} kcal<br />
                Cálcio: {food.reguladores.nutrientes.calcio} mg<br />
                Ferro: {food.reguladores.nutrientes.ferro} mg<br />
                Fósforo: {food.reguladores.nutrientes.fosforo} mg<br />
                Sódio: {food.reguladores.nutrientes.sodio} mg<br />
                Potássio: {food.reguladores.nutrientes.potassio} mg
              </li>
            ))}
          </ul>
        </Results>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }

  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const Results = styled.div`
  margin-top: 20px;

  h2 {
    margin-bottom: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
    }
  }
`;

export default FoodSearch;
