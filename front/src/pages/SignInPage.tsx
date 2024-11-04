import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Button, Error } from "../components";
import { isErrorProps, loadFromLocalStorage, saveToLocalStorage } from "../utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks";
import User from "../services/User"; // Supondo que User é o serviço de API para login

export default function SignInPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken, error, setError } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!mail) {
      setError({ error: "Forneça o e-mail" });
    } else if (!password) {
      setError({ error: "Forneça a senha" });
    } else {
      try {
        const response = await User.login(mail, password);
        
        if (isErrorProps(response)) {
          setError(response);
        } else {
          setError(null);
          setToken(response); // Define o token no estado do usuário
          saveToLocalStorage("user", response); // Salva o token no localStorage
          navigate("/"); // Redireciona após login bem-sucedido
        }
      } catch (err) {
        setError({ error: "Erro no servidor. Tente novamente." });
      }
    }
  };

  const handleClickCadastro = () => {
    navigate("/cadastro");
  };

  const handleRecuperaSenha = () => {
    navigate("/reset-password");
  };

  useEffect(() => {
    if (!token) {
      const user = loadFromLocalStorage("user");
      if (user) {
        setToken(user);
        navigate("/");
      }
    }
  }, [token, navigate, setToken]);

  return (
    <Wrapper>
      <LogoContainer>
        <LogoImage src="../Imagens/Camada_1.png" alt="Descrição do logo" />
      </LogoContainer>
      <BalloonsImage src="../Imagens/grupo balões.png" alt="Grupo de balões" />
      <NuvensImage src="../Imagens/grupo de nuvens.png" />
      <Frase>
        <div>
          Seu site para contagem de
          <br />
          calorias e saúde
        </div>
      </Frase>
      <FraseMenor>
        <div>
          Faça seu log-In e aproveite todos os recursos
          <br />
          para manutenção de uma vida mais saudável
        </div>
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
        </LineSld>
        <AdditionalButtons>
          <SimpleButton onClick={handleClickCadastro}>Cadastrar</SimpleButton>
          <SimpleButton onClick={handleRecuperaSenha}>
            Esqueceu sua senha?
          </SimpleButton>
        </AdditionalButtons>
      </FieldWrapper>
    </Wrapper>
  );
}

// Estilos

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f0f9ff;
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
  text-align: center;
  margin-top: 5vh;
  font-family: sans-serif;
  color: #29384e;
  font-size: 1.2rem;
  max-width: 100%;
  line-height: 1.4;

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
    padding: 0 10px;
  }
`;

const FraseMenor = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 1vh;
  font-family: sans-serif;
  color: #29384e;
  font-size: 0.9rem;
  max-width: 100%;
  line-height: 1.4;

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
    padding: 0 10px;
  }
`;

const Entrada = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: sans-serif;

  input {
    border-radius: 50px;
    border: 1px solid #dae3e9;
    display: flex;
    padding: 10px 16px;
    align-items: center;
    gap: 120px;
  }

  input::placeholder {
    color: #868c95;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 20px;
  }
`;

const LineSld = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10vh;
`;

const TextSld = styled.div`
  display: flex;
  font-size: 110%;
  font-weight: bold;
  color: #333;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  align-self: center;
  margin-top: 4vh;
  padding: 20px;
  border-top: 2px solid #dae3e9;
  box-sizing: border-box;
  z-index: 3;
`;

const AdditionalButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const SimpleButton = styled.button`
  background: none;
  color: #007bff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const BalloonsImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 200px;
  width: 85vw;
  height: auto;
  z-index: 2;
`;

const NuvensImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 130px;
  width: 85vw;
  height: auto;
  z-index: 2;
`;
