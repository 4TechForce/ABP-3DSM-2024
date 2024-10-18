import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import user from "./user";
import AuthController from "../controllers/AuthController";
import food from "./food";



const routes = Router();
routes.post("/cadastro", UserController.create);
routes.post("/login", AuthController.login);
routes.use("/user", user);
routes.use("/food", food)




routes.use( (_:Request,res:Response) => res.json({error:"Requisição desconhecida"}) );
export default routes;