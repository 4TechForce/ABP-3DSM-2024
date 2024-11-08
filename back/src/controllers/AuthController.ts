import { Request, Response } from "express"; 
import { User } from "../models";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


class AuthController{
    
    private transport: nodemailer.Transporter;

    constructor() {
        this.transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER, 
                pass: process.env.MAILTRAP_PASS
            }
        });
        
        console.log('Mailtrap User:', process.env.MAILTRAP_USER);
            console.log('Mailtrap Password:', process.env.MAILTRAP_PASS);
            this.transport.verify((error, success) => {
                if (error) {
                    console.log('Erro ao verificar transporte:', error);
                } else {
                    console.log('Transporter está pronto para enviar emails!');
                }
            });
        
    }

    
    async forgotPassword(req: Request, res: Response): Promise<Response> {
        const { mail } = req.body;
    
        try {
            const user = await User.findOne({ mail });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            console.log("Token gerado:", token);
    
            const mailOptions = {
                from: process.env.MAILTRAP_USER,
                to: user.mail,
                subject: 'Recuperação de Senha',
                html: `<p>Clique <a href="${process.env.CLIENT_URL}/reset-password/${token}">aqui</a> para redefinir sua senha</p>`,
            };
    
            await this.transport.sendMail(mailOptions);
            console.log(`Email enviado para: ${user.mail}`); 
    
            return res.json({ message: 'Email de recuperação de senha enviado!' });
        } catch (error) {
            console.error('Erro ao enviar email:', error); 
            return res.status(500).json({ message: 'Erro ao enviar email', error });
        }
    }
    

    async resetPassword(req: Request, res: Response): Promise<Response> {
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            if (!newPassword) {
                return res.status(400).json({ message: 'Nova senha não pode ser vazia' });
            }

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            await user.save();

            return res.json({ message: 'Senha redefinida com sucesso!' });
        } catch (error) {
            return res.status(400).json({ message: 'Token inválido ou expirado', error });
        }
    }

    

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

                res.status(200).json({
                    token,
                    userId: user._id.toString(),
                  });
            } else {
                console.log("Email ou senha incorretos");
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
    }



}

export default new AuthController();