import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Button, Error, LinkButton } from "../components"
import { loadFromLocalStorage } from "../utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks";

export default function SignInPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken, login, error, setError } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!mail) {
      setError({ error: "Forneça o e-mail" });
    } else if (!password) {
      setError({ error: "Forneça a senha" });
    } else {
      login(mail, password);
    }
  };

  useEffect(() => {
    if (!token) {
      // O usuário será redirecionado para a página de login se ele entrar por alguma outra rota
      const user = loadFromLocalStorage("user");
      if (user) {
        setToken(user);
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <LogoContainer>
        <LogoImage src='../Imagens/Imagem.png' alt='Descrição do logo' />
      </LogoContainer>
      <BalloonsImage
        src='../Imagens/grupo balões.png'
        alt='Grupo de balões'
      />
      <NuvensImage
      src='../Imagens/grupo de nuvens.png'
      />
      <Frase>
        <div>Seu site para contagem de<br></br>
          calorias e saúde</div>
      </Frase>
      <FraseMenor>
        <div>Faça seu log-In e aproveite todos os recursos<br></br>
          para manutenção de uma vida mais saudável</div>
      </FraseMenor>
      {error && <Error>{error.error}</Error>}
      <FieldWrapper>
        <TextSld>Login</TextSld>
        <Entrada>
          <Input
            type="text"
            id="mail"
            label="E-mail"
            value={mail}
            setValue={setMail}
            placeholder="Entre com seu e-mail"
          />

          <Input
            type="password"
            id="password"
            label="Senha"
            value={password}
            setValue={setPassword}
            placeholder="Entre com sua senha"
          />
        </Entrada>
        <LineSld>
          <Button label="Logar" click={handleLogin} />
          {/* <LinkButton label="Cadastrar-se" to="/signup" /> */}
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
  background-color:#F0F9FF;
`;
const LogoContainer = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
    margin-top: 7vh;
`;

const LogoImage = styled.img`
  max-width: 100%;
  height: auto;
`;
const Frase = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; /* Centraliza o texto */
  margin-top: 5vh;
  font-family: sans-serif;
  color: #868C95;
  font-size: 1.2rem;
  max-width: 100%; /* Limita a largura para que o texto não ocupe toda a tela */
  line-height: 1.4; /* Melhora a legibilidade */
  
  // Responsividade para telas menores
  @media (max-width: 1024px) {
    font-size: 1rem;
    margin-top: 6vh;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 2vh;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-top: 1.5vh;
    padding: 0 10px; /* Adiciona espaçamento nas laterais em telas muito pequenas */
  }
`;
const FraseMenor = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; /* Centraliza o texto */
  margin-top: 1vh;
  font-family: sans-serif;
  color: #868C95;
  font-size: 0.9rem;
  max-width: 100%; /* Limita a largura para que o texto não ocupe toda a tela */
  line-height: 1.4; /* Melhora a legibilidade */
  
  // Responsividade para telas menores
  @media (max-width: 1024px) {
    font-size: 0.7rem;
    margin-top: 6vh;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 2vh;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-top: 1.5vh;
    padding: 0 10px; /* Adiciona espaçamento nas laterais em telas muito pequenas */
  }
`;
const Entrada = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 1;
  font-family: sans-serif;


  input::placeholder {
    color: #868C95;
    font-family:sans-serif;
    font-size:0.8rem;
  }

  @media (max-width: 768px) {
    width: 100%; /* Responsivo para se ajustar à tela */
    padding: 0 20px; /* Adiciona um pouco de espaçamento nas laterais em telas pequenas */
  }
`;

const LineSld = styled.div`
  display: flex;
  margin-top: 10vh;
`;

const TextSld = styled.div`
  display: flex;
  font-size: 110%;
  font-weight: bold;
  color: #333;

  justify-content: center;
  align-items: center;
  font-family:sans-serif;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  align-self: center;
  margin-top: 4vh;
  margin-bottom: auto;
  padding: 20px;
  border-top: 2px solid #DAE3E9;  
  border-left: none;            
  border-right: none;          
  border-radius: 0;              
  box-sizing: border-box;
  z-index: 3; 
`;
const BalloonsImage = styled.img`
  position: absolute;
  bottom: 0;
    left:200px;
  width: 85vw;
  height:auto;
  z-index: 2;
  `;
  const NuvensImage = styled.img`
  position: absolute;
  bottom: 0;
  left:130px;
  width: 85vw;
  height: auto;
  z-index: 2;
  `;
