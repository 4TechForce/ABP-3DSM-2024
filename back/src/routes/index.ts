import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";



const routes = Router();
routes.post("/cadastro", UserController.create);
routes.post("/login", UserController.login);




routes.use( (_:Request,res:Response) => res.json({error:"Requisição desconhecida"}) );
export default routes;