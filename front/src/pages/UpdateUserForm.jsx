import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
// Importando os estilos
import styled from 'styled-components';
import Header from '../components/Header';

const UpdateUserForm = () => {
    const { id } = useParams(); // Pega o _id da URL
    const [formData, setFormData] = useState({
        name: '',
        mail: '',
        password: '',
    });
    const [error, setError] = useState(null); // Para lidar com erros

    useEffect(() => {
        // Função para buscar os dados do usuário
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/profile/${id}`);
                if (response.data) {
                    setFormData(response.data);
                }
            } catch (error) {
                setError('Erro ao buscar os dados do usuário');
                console.error('Erro ao buscar usuário:', error);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Recuperando token e userId do localStorage
        const { token, userId } = JSON.parse(localStorage.getItem('user') || '{}');
      
        // Verificando se os dados estão presentes
        if (!token || !userId) {
          alert('Usuário não autenticado.');
          return;
        }
      
        try {
          // Enviando os dados para o backend
          const response = await axios.put(
            `http://localhost:3001/user/profile/${userId}`, // Incluindo o userId na URL
            {
              name: formData.name,
              mail: formData.mail,
              password: formData.password,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Enviando o token no cabeçalho
              },
            }
          );
          alert('Usuário atualizado com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar usuário:', error);
          alert('Erro ao atualizar usuário.');
        }
    };
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
    const handleConfiguraçõesClick = () => navigate(`/profile/update/${userId}`);
  
  
    const handleLogout = () => {
      navigate("/logout");
    };
    const handleHistorico = () => {
      navigate("/refeicoes");
    };

    return (
        <Container>
            <HeaderWrapper>
                <Header /> {/* Cabeçalho fixo */}
            </HeaderWrapper>
            <ContentWrapper>
                <h2>Atualizar Usuário</h2>
                {error && <Message>{error}</Message>}
                <FormContainer>
                    <Form onSubmit={handleSubmit}>
                        <label htmlFor="name">Nome</label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Digite seu nome"
                        />
                        <label htmlFor="mail">E-mail</label>
                        <Input
                            type="email"
                            id="mail"
                            name="mail"
                            value={formData.mail}
                            onChange={handleChange}
                            placeholder="Digite seu e-mail"
                        />
                        <label htmlFor="password">Senha</label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                        />
                        <Button type="submit">Atualizar</Button>
                    </Form>
                </FormContainer>
            </ContentWrapper>
        </Container>
    );
};

export default UpdateUserForm;


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5; /* Um fundo neutro */
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  flex-direction: column;
  padding-top: 60px; /* Para dar espaço abaixo do cabeçalho fixo */
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff; /* Cor do fundo do header */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave para destaque */
  z-index: 10; /* Garante que o header fique acima do conteúdo */
  padding: 10px 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  padding-top: 80px; /* Garantir que o conteúdo comece após o header */
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 450px;
  max-width: 100%;
  text-align: center;
  margin-top: 20px;
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
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 50px;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background: linear-gradient(112deg, #FF59BD 0%, #F60094 101.9%);
  color: white;
  border: none;
  border-radius: 50px;
  height: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 15px;

  &:hover {
    background-color: #e60073;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #ff0000;
  text-align: center;
`;

