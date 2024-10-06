import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/forgot-password", { mail: email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erro ao enviar o email.");
    }
  };

  return (
    <Container>
      <h2>Recuperação de Senha</h2>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="email">Digite seu e-mail</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar e-mail de recuperação</button>
      </Form>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default ForgotPassword;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f6f6f6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;

  label {
    font-size: 16px;
  }

  input {
    padding: 10px;
    font-size: 16px;
  }

  button {
    padding: 10px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #ff0000;
`;
