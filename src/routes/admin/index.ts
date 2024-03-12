import { Router } from "express";


import  AuthController  from "../../controllers/admin/auth.controller";
import dashboardController from "../../controllers/admin/dashboard.controller";


const routerAdmin:Router = Router();

const defaultRoutes  = [
    {
        path: '/',
        route: dashboardController.router
    },
    {
        path: '/auth',
        route: AuthController.router
    }
];

defaultRoutes.forEach((route) => {
    routerAdmin.use(route.path, route.route);
});

export default routerAdmin;
