import { Router } from 'express';
import usuarioRoutes from './usuarioRoute';
import contaRoutes from './contasRoute';
import configuracoesRoute from './configuracoesRoute';
import validateAccessToken from "./validateAccessTokenRoute"
import PagesAdmin from './pagesAdmin';
import PagesReseller from './pagesReseller';


const router = Router();

//admin pages
router.use(PagesAdmin);

//reseller pages
router.use(PagesReseller);

//api admin
router.use(usuarioRoutes); // Indexa as rotas de usuário
router.use(contaRoutes);    // Indexa as rotas de conta
router.use(configuracoesRoute);
router.use(validateAccessToken)

//api reseller


export default router;


