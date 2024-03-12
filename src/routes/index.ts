import { log } from "console";
import { Router } from "express";
import indexController from "../controllers/index.controller";

import routerAdmin from "./admin/index";



const router:Router = Router();

const defaultRoutes  = [
    {
        path: '/',
        route: indexController
    },
    {
        'path': '/admin',
        'route': routerAdmin
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;