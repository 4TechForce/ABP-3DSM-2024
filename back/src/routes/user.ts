import { Router } from "express";
import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";
import { validadeAcess } from "../middleware";

const routes = Router();
routes.post('/', validadeAcess ,UserController.create);
routes.get('/', UserController.list);

routes.delete('/deleteProfile/:id', UserController.delete);
routes.put('/profile/:id', UserController.update);

routes.post('/forgot-password', AuthController.forgotPassword.bind(AuthController));
routes.post('/reset-password/:token', AuthController.resetPassword);

export default routes;