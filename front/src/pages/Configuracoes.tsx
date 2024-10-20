import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const Configuracoes: React.FC = () => {
    const { token, updateMail, updatePassword, setError } = useContext(UserContext)!; // Acesse o UserContext
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [genero, setGenero] = useState('');
    const [idade, setIdade] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleAtualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');
    
        if (!email && !senha && !peso && !altura && !genero && !idade) {
            setMensagem('Por favor, preencha ao menos um campo para atualizar.');
            return;
        }
    
        try {
            if (email) {
                const emailUpdated = await updateMail(email);
                if (!emailUpdated) {
                    setMensagem('Erro ao atualizar o e-mail.');
                    return;
                }
            }
    
            if (senha) {
                const senhaUpdated = await updatePassword(senha);
                if (!senhaUpdated) {
                    setMensagem('Erro ao atualizar a senha.');
                    return;
                }
            }
    
    
            setMensagem('Informações atualizadas com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
            setMensagem('Ocorreu um erro ao atualizar as informações. Tente novamente.');
        }
    };
    

    return (
        <form onSubmit={handleAtualizar}>
            <h2>Atualizar Informações</h2>
            <input
                type="email"
                placeholder="Novo E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Nova Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <input
                type="text"
                placeholder="Novo Peso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nova Altura"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
            />
            <input
                type="text"
                placeholder="Gênero"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
            />
            <input
                type="text"
                placeholder="Idade (dd/mm/yyyy)"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
            />
            <button type="submit">Atualizar</button>
            {mensagem && <p>{mensagem}</p>}
        </form>
    );
};

export default Configuracoes;
