import { Request, Response } from "express"; 
import { User } from "../models";
import bcrypt from 'bcrypt';
import { calculateClassification } from "../services/userServices";

class UserController {
    
    public async create(req: Request, res: Response): Promise<Response> {
        const { name, mail, password, idade, peso, altura, genero, nivelAtividade, objetivoDieta, pesoAlvo } = req.body;
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            let birthDate: Date;
            try {
                birthDate = new Date(idade.split('/').reverse().join('-'));
            } catch (error) {
                return res.status(400).json({ message: "Data de nascimento inválida" });
            }
    
            const { classificacao, pesoIdeal } = await calculateClassification(peso, birthDate, genero);
    
            const document = new User({
                name,
                mail,
                password: hashedPassword,
                idade: birthDate,
                peso,
                altura,
                genero,
                nivelAtividade,
                objetivoDieta,
                pesoAlvo,
                classificacao 
            });
    
            const response = await document.save();
            
            
            return res.status(201).json({ 
                message: "Usuário criado com sucesso!", 
                data: response,
                classificacao,
                pesoIdeal 
            });
    
        } catch (error: any) {
            console.error("Erro ao criar usuário:", error);
            return res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
        }
    }
    
    public async list(req: Request, res: Response): Promise<Response> {
        try {
            const objects = await User.find().sort({ name: "asc" });
            return res.json(objects);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.body;
        try {
            const object = await User.findByIdAndDelete(_id);
            if (object) {
                return res.json({ message: "Registro excluído com sucesso" });
            } else {
                return res.json({ message: "Registro inexistente" });
            }
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        let { id: _id } = req.params;
        const { name, mail, password, peso, altura, genero, idade } = req.body;
    
        _id = _id.replace(/^/, '');
    
        try {
            const document = await User.findById(_id);
    
            if (!document) {
                return res.status(404).json({ message: "Usuário inexistente." });
            }
    
            const existingUser = await User.findOne({ mail });
    
            if (existingUser && existingUser.id !== _id) {
                return res.status(400).json({ message: "Este e-mail já está em uso." });
            }
    
            document.name = name || document.name;
            document.mail = mail || document.mail;
    
            if (password) {
                const salt = await bcrypt.genSalt(10);
                document.password = await bcrypt.hash(password, salt);
            }
    
            document.peso = peso || document.peso;
            document.altura = altura || document.altura;
            document.genero = genero || document.genero;
    
            if (idade) {
                const [day, month, year] = idade.split('/'); 
                const idadeFormatada = new Date(`${year}-${month}-${day}`); 
                if (isNaN(idadeFormatada.getTime())) {
                    return res.status(400).json({ message: "Formato de idade inválido." });
                }
                document.idade = idadeFormatada;
            }
            
           
            const classificacao = await calculateClassification(peso, document.idade, document.genero);
            document.classificacao = classificacao.classificacao;
             

            const resp = await document.save();
    
            return res.status(200).json({ message: "Perfil atualizado com sucesso.", user: resp });
    
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Este e-mail já está em uso." });
            }
    
            return res.status(500).json({ message: "Erro ao atualizar perfil.", error: error.message });
        }
    }
}

export default new UserController();
