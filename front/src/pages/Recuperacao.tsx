import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/user/forgot-password", { mail: email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erro ao enviar o email.");
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <TextContainer>
          <h1>Esqueceu a senha?</h1>
          <p>Digite o seu e-mail que vamos<br /> enviar um link para você criar<br /> uma nova senha.</p>
        </TextContainer>
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Insira seu e-mail"
            />
            <Button type="submit">Enviar</Button>
          </Form>
          {message && <Message>{message}</Message>}
        </FormContainer>
      </ContentWrapper>
    </Container>
  );
};

export default ForgotPassword;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('../Imagens/Esqueceu.png'); /* Use o caminho correto da sua imagem */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TextContainer = styled.div`
  margin-bottom: 20px;
  max-width: 700px;
  text-align: center;

  h1 {
    font-size: 3.5rem;
    color: #FFF;
    margin-bottom: 10px;
    position: relative;
    top: -20px; /* Eleva o título para ficar mais alto */
  }

  p {
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 126%;
    letter-spacing: 0.36px;
    color: #29384E;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    p {
      font-size: 1.2rem;
    }
  }
`;

const FormContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 450px;
  max-width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
    width: 90%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    text-align: left;
    font-size: 14px;
    margin-bottom: 5px;
    color: #666;
  }
`;

const Input = styled.input`
  padding: 12px; /* Definindo padding igual ao botão */
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 50px;
  width: 100%;
  height: 50px; /* Altura definida */
  box-sizing: border-box; /* Para incluir o padding na altura total */
`;

const Button = styled.button`
  padding: 12px; /* Mesmo padding do input */
  font-size: 16px;
  background: var(--Gradient-Pink, linear-gradient(112deg, #FF59BD 0%, #F60094 101.9%));
  box-shadow: 0px 16px 25px -6px rgba(246, 0, 148, 0.15);
  color: white;
  border: none;
  border-radius: 50px; /* Mesmo border-radius do input */
  height: 50px; /* Mesmo tamanho do input */
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%; /* Garantindo que o botão tenha a mesma largura do input */

  &:hover {
    background-color: #e60073;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #ff0000;
`;
