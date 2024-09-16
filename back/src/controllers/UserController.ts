import { Request, Response } from "express"; 
import { User } from "../models";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class UserController {

    public async login(req: Request, res: Response) {
        const { mail, password } = req.body;
        console.log("Iniciando login com email:", mail);

        try {
            const user = await User.findOne({ mail }).select('+password');
            console.log("Usuário encontrado:", user);

            
            if (user && await bcrypt.compare(password, user.password)) {
                console.log("Senha correta, gerando token...");

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                    expiresIn: '1h',
                });

                console.log("Token gerado:", token);
                return res.json({ token });
            } else {
                console.log("Email ou senha incorretos");
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
    }

    
    public async create(req: Request, res: Response): Promise<Response> {
        const { name, mail, password, idade, peso, altura, genero } = req.body;
        console.log("Dados recebidos para criação do usuário:", { name, mail, password, idade, peso, altura, genero });

        try {
            console.log("Senha antes do hash:", password);

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Senha após o hash:", hashedPassword);

            const document = new User({ name, mail, password: hashedPassword, idade, peso, altura, genero });
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
        const { id, name } = req.body;
        try {
            const document = await User.findById(id);
            if (!document) {
                return res.json({ message: "Nome inexistente" });
            }

            document.name = name;

            const resp = await document.save();
            return res.json(resp);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este nome já está em uso" });
            } else if (error && error.errors["name"]) {
                return res.json({ message: error.errors["name"].message });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new UserController();
