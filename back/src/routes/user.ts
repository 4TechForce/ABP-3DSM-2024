import { Router } from "express";
import controller from "../controllers/UserController";
import { validadeAcess } from "../middleware";

const routes = Router();
routes.post('/', validadeAcess ,controller.create);
routes.get('/', controller.list);
routes.delete('/', controller.delete);
routes.put('/', controller.update);
export default routes;