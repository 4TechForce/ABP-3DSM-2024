import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {  Error} from "../components";
import { useUser } from "../hooks";
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom'; // Importação para navegação

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState(0);
  const [altura, setAltura] = useState(0);
  const [genero, setGenero] = useState("");
  const [nivelAtividade, setNivelAtividade] = useState("");
  const [objetivoDieta, setObjetivoDieta] = useState("");
  const [pesoAlvo, setPesoAlvo] = useState(0);
  const [successMessage, setSuccessMessage] = useState(""); // Mensagem de sucesso

  const { create, error, setError } = useUser();
  const navigate = useNavigate(); // Hook para navegação

  const handleCreate = () => {
    if (!name) {
      setError({ error: "Forneça o seu nome de usuário" });
    } else if (!mail) {
      setError({ error: "Forneça o e-mail" });
    } else if (!password) {
      setError({ error: "Forneça a senha" });
    } else if (!idade) {
      setError({ error: "Forneça uma data de nascimento válida" });
    } else if (peso <= 0) {
      setError({ error: "Forneça um peso válido" });
    } else if (altura <= 0) {
      setError({ error: "Forneça uma altura válida" });
    } else if (!genero) {
      setError({ error: "Selecione o gênero" });
    } else if (!nivelAtividade) {
      setError({ error: "Selecione o seu nível de atividades" });
    } else if (!objetivoDieta) {
      setError({ error: "Selecione o seu objetivo" });
    } else if (pesoAlvo <= 0) {
      setError({ error: "Forneça um peso alvo válido" });
    } else {
      // Envia os dados para o backend
      create(name, mail, password, idade, peso, altura, genero, nivelAtividade, objetivoDieta, pesoAlvo);

      // Efeito de confete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Definir mensagem de sucesso
      setSuccessMessage("Cadastro realizado com sucesso!");

      // Redirecionar para a tela de login após 2 segundos
      setTimeout(() => {
        navigate('/login'); // Redireciona para a página de login
      }, 2000); // 2 segundos de delay
    }
  };

  return (
    <Wrapper>
      {error && <Error>{error.error}</Error>}
      {successMessage && <Success>{successMessage}</Success>} {/* Exibe a mensagem de sucesso */}
      <Header>
        <Logo src="../Imagens/Camada_1.png" alt="Pequenos Sabores" />
      </Header>
      <Content>
        <Container>
          <GlobalStyle />
          <Title>Meus Dados</Title>
          <FormGroup>
            <label>Sexo</label>
            <RadioGroup>
              <label>
                <input
                  type="radio"
                  name="genero"
                  value="Feminino"
                  onChange={(e) => setGenero(e.target.value)}
                />
                Feminino
              </label>
              <label>
                <input
                  type="radio"
                  name="genero"
                  value="Masculino"
                  onChange={(e) => setGenero(e.target.value)}
                />
                Masculino
              </label>
            </RadioGroup>
          </FormGroup>
          <FormGroup>
            <label>Peso atual (kg)</label>
            <input
              className="entrada"
              type="number"
              value={peso || ""}
              onChange={(e) => setPeso(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <label>Altura (cm)</label>
            <input
              className="entrada"
              type="number"
              value={altura || ""}
              onChange={(e) => setAltura(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={idade}
              onChange={(e) => setIdade(e.target.value)} // Mantém o valor como string de data
            />
          </FormGroup>
          <FormGroup>
            <label>Nível de Atividade Física</label>
            <RadioGroup>
              <label>
                <input
                  type="radio"
                  name="Sedentário"
                  value="Sedentário"
                  onChange={(e) => setNivelAtividade(e.target.value)}
                />
                Sedentário
              </label>
              <label>
                <input
                  type="radio"
                  name="Moderado"
                  value="Moderado"
                  onChange={(e) => setNivelAtividade(e.target.value)}
                />
                Moderado
              </label>
              <label>
                <input
                  type="radio"
                  name="Ativo"
                  value="Ativo"
                  onChange={(e) => setNivelAtividade(e.target.value)}
                />
                Ativo
              </label>
              <label>
                <input
                  type="radio"
                  name="Muito Ativo"
                  value="Muito Ativo"
                  onChange={(e) => setNivelAtividade(e.target.value)}
                />
                Muito Ativo
              </label>
            </RadioGroup>
          </FormGroup>
        </Container>
        <Container1>
  <Title1>Meu Objetivo</Title1>
  <FormGroup1>
    <label>Objetivo da Dieta</label>
    <select
      value={objetivoDieta}
      onChange={(e) => setObjetivoDieta(e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="Perder peso">Perder peso</option>
      <option value="Manter peso">Manter peso</option>
      <option value="Ganhar peso">Ganhar peso</option>
    </select>
  </FormGroup1>
  <FormGroup1>
    <label>Peso alvo (kg)</label>
    <input
      className="entrada"
      type="number"
      value={pesoAlvo || ""}
      onChange={(e) => setPesoAlvo(Number(e.target.value))}
    />
  </FormGroup1>
</Container1>
        <Container2>
          <Title2>Meu Perfil</Title2>
          <FormGroup2>
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup2>
          <FormGroup2>
            <label>E-mail</label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </FormGroup2>
          <FormGroup2>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup2>
        </Container2>
        <ButtonContainer>
          <Button>Cancelar</Button>
          <Button1 onClick={handleCreate}>Confirma</Button1>
        </ButtonContainer>
      </Content>
    </Wrapper>
  );
}

// Estilos

const Success = styled.div`
  color: green;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 20px;
`;

// Outros estilos já definidos...


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const Header = styled.header`
  width: 100%;
  padding: 10px;
  background-color: #f6f6f6;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  top: 0;
  left: 0;
`;


const Logo = styled.img`
  width: 200px;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px; /* Ajustar para não sobrepor o logo */
  align-self: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Alinha os botões nas extremidades */
  margin-top: auto; /* Empurra os botões para o final */
  padding: 20px; /* Espaçamento em volta dos botões */
`;

const Button1 = styled.button`
display: flex;
width: 410px;
height: 42px;
padding: 12px 8px;
justify-content: center;
align-items: center;
gap: var(--Totalitems, 10px);
flex-shrink: 0;
border-radius: 25px;
background: var(--Success-Primary, #11BDB5);
box-shadow: 0px 16px 25px -6px rgba(246, 0, 148, 0.15);
`;
const Button = styled.button`
display: flex;
width: 410px;
height: 42px;
padding: 12px 8px;
justify-content: center;
align-items: center;
gap: var(--Totalitems, 10px);
flex-shrink: 0;
border-radius: 25px;
background: var(--Text-Secondary, #868C95);
box-shadow: 0px 16px 25px -6px rgba(246, 0, 148, 0.15);
`;
const Container = styled.div`
  border-radius: 39px;
  background: var(--CoresPrincipais-Background-Secundrio, #FFF);
  width: 95vw;
  height: 500px;
  padding: 20px;
  flex-shrink: 0;
`;

const Title = styled.h2`
  width: 168px;
  position: relative;
  font-size: 24px;
  letter-spacing: 0.02em;
  line-height: 24px;
  font-weight: 600;
  font-family: Inter;
  color: #29384e;
  text-align: center;
  display: inline-block;
  height: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    display: flex;
    width: 230px;
    padding: var(--Totalitems, 10px) var(--Padding, 16px);
    justify-content: space-between;
    align-items: center;
    border-radius: var(--Totalitems, 10px);
    border: 1px solid var(--Border-Primary, #DAE3E9);
  }
`;

const RadioGroup = styled.div`
   display: flex;
  gap: 10px;

  input {
    margin-right: 5px;
  }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap');

  body {
    margin: 0;
    line-height: normal;
    font-family: 'Inter', sans-serif;
  }
`;



// meu objetivo
const Container1 = styled.div`
  border-radius: 39px;
  background: var(--CoresPrincipais-Background-Secundrio, #FFF);
  width: 95vw;
  height: auto; /* Muda para auto para se ajustar ao conteúdo */
  padding: 20px;
  flex-shrink: 0;
`;

// Título acima dos inputs
const Title1 = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

// Usar um novo FormGroup para cada input
const FormGroup1 = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    display: flex;
    width: 230px;
    padding: var(--Totalitems, 10px) var(--Padding, 16px);
    justify-content: space-between;
    align-items: center;
    border-radius: var(--Totalitems, 10px);
    border: 1px solid var(--Border-Primary, #DAE3E9);
  }
`;



// meuperfil
const Container2 = styled.div`
  border-radius: 39px;
  background: var(--CoresPrincipais-Background-Secundrio, #FFF);
  width: 95vw;
  height: 40vh;
  padding: 20px;
  flex-shrink: 0;
`;

const Title2 = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const FormGroup2 = styled.div`
    margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    display: flex;
    width: 230px;
    padding: var(--Totalitems, 10px) var(--Padding, 16px);
    justify-content: space-between;
    align-items: center;
    border-radius: var(--Totalitems, 10px);
    border: 1px solid var(--Border-Primary, #DAE3E9);
  }
`;


