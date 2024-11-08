// routes/foodRoutes.ts
import { Router } from 'express';

import FoodController from '../controllers/FoodController';
import GroupController from '../controllers/GroupController';
import HistoricoController from '../controllers/HistoricoController';

const routes = Router();

routes.get("/search", FoodController.search); //URL de requisição = http://localhost:3001/food/search?q=nome do alimento 
routes.get("/group", GroupController.group);
routes.post("/historico", HistoricoController.salvarRefeicao);
routes.get('/refeicoes', HistoricoController.listarHistorico);


export default routes;