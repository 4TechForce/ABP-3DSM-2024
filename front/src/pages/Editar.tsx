import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/user/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erro ao redefinir a senha.");
    }
  };

  return (
    <Container>
      <h2>Redefinir Senha</h2>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">Digite a nova senha</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Redefinir Senha</button>
      </Form>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default ResetPassword;

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
