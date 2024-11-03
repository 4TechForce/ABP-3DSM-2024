// routes/foodRoutes.ts
import { Router } from 'express';

import { validadeAcess } from '../middleware'; 
import FoodController from '../controllers/FoodController';
import GroupController from '../controllers/GroupController';

const routes = Router();

routes.get("/search", FoodController.search); //URL de requisição = http://localhost:3001/food/search?q=nome do alimento 
routes.get("/group", GroupController.group);


export default routes;