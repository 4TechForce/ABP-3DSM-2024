import { useState } from "react";
import styled from "styled-components";
import { Input, Button, Error, LinkButton } from "../components";
import { useUser } from "../hooks";
import confetti from 'canvas-confetti';

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [idade, setIdade] = useState(0);
  const [peso, setPeso] = useState(0);
  const [altura, setAltura] = useState(0);
  const [genero, setGenero] = useState(""); // Novo estado para gênero
  const { create, error, setError } = useUser();

  const handleCreate = () => {
    if (!name) {
      setError({ error: "Forneça o seu nome de usuário" });
    } else if (!mail) {
      setError({ error: "Forneça o e-mail" });
    } else if (!password) {
      setError({ error: "Forneça a senha" });
    } else if (idade <= 0) {
      setError({ error: "Forneça uma idade válida" });
    } else if (peso <= 0) {
      setError({ error: "Forneça um peso válido" });
    } else if (altura <= 0) {
      setError({ error: "Forneça uma altura válida" });
    } else if (!genero) {
      setError({ error: "Selecione o gênero" });
    } else {
      create(name, mail, password, idade, peso, altura, genero);

      // Efeito de confete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <Wrapper>
      {error && <Error>{error.error}</Error>}
      <FieldWrapper>
        <TextSld>Cadastro de novo usuário</TextSld>
        <Input
          type="text"
          id="name"
          label="Nome de usuário"
          value={name}
          setValue={setName}
        />
        <Input
          type="text"
          id="mail"
          label="e-mail"
          value={mail}
          setValue={setMail}
        />
        <Input
          type="password"
          id="password"
          label="Senha"
          value={password}
          setValue={setPassword}
        />
        <Input
          type="number"
          id="idade"
          label="Idade"
          value={idade.toString()} // Conversão para string
          setValue={(e) => setIdade(Number(e))} // Conversão para número
        />
        <Input
          type="number"
          id="peso"
          label="Peso (kg)"
          value={peso.toString()} // Conversão para string
          setValue={(e) => setPeso(Number(e))} // Conversão para número
        />
        <Input
          type="number"
          id="altura"
          label="Altura (cm)"
          value={altura.toString()} // Conversão para string
          setValue={(e) => setAltura(Number(e))} // Conversão para número
        />

        {/* Novo campo de seleção de gênero */}
        <SelectWrapper>
          <label htmlFor="genero">Gênero</label>
          <select
            id="genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="">Selecione o gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </SelectWrapper>

        <LineSld>
          <StyledButton label="Cadastrar" click={handleCreate} />
          <LinkButton label="Logar-se" to="/login" />
        </LineSld>
      </FieldWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
`;

const LineSld = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const TextSld = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  align-self: center;
  margin-top: auto;
  margin-bottom: auto;
  padding: 20px;
  border: 1px solid #999;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #f9f9f9;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  label {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  select {
    padding: 8px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const StyledButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3e8e41;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }
`;