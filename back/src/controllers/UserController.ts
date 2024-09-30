import { Request, Response } from "express"; 
import { User } from "../models";
import bcrypt from 'bcrypt';

class UserController {

    
    public async create(req: Request, res: Response): Promise<Response> {
        const { name, mail, password, idade, peso, altura, genero, nivelAtividade, objetivoDieta, pesoAlvo } = req.body;
        console.log("Dados recebidos para criação do usuário:", { name, mail, password, idade, peso, altura, genero });
        
        try {

            console.log("Senha antes do hash:", password);

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Senha após o hash:", hashedPassword);

            const document = new User({ name, mail, password: hashedPassword, idade, peso, altura, genero, nivelAtividade, objetivoDieta, pesoAlvo});
            const response = await document.save();

            return res.status(201).json({ message: "Usuário criado com sucesso!", data: response });

        } catch (error: any) {
            console.error("Erro ao criar usuário:", error);

            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este email já está em uso" });
            } else if (error && error.errors["mail"]) {
                return res.json({ message: error.errors["mail"].message });
            }

            return res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
        }
    }

   
    public async list(req: Request, res: Response): Promise<Response> {
        const { name, mail, password, idade, peso, altura, genero } = req.body; 
        try {
            const objects = await User.find({ name, mail, password, idade, peso, altura, genero }).sort({ name: "asc" });
            return res.json(objects);
        } catch (error: any) {
            return res.json({ message: error.message });
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
            return res.json({ message: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const {id: _id} = req.params
        const { name, mail, password, peso, altura, genero, idade} = req.body;
    
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
            document.idade = idade || document.idade; 
    
            

            const resp = await document.save();
    
            return res.status(200).json({ message: "Perfil atualizado com sucesso.", user: resp });
        } catch (error: any) {
            
            if (error.code === 11000) {
                return res.status(400).json({ message: "Este e-mail já está em uso." });
            } else if (error.errors && error.errors["name"]) {
                return res.status(400).json({ message: error.errors["name"].message });
            }
    
            return res.status(500).json({ message: "Erro ao atualizar perfil.", error: error.message });
        }
    }
}

export default new UserController();
