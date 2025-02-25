import { Router } from 'express';
import usuarioRoutes from './usuarioRoute';
import contaRoutes from './contasRoute';
import configuracoesRoute from './configuracoesRoute';
import validateAccessToken from "./validateAccessTokenRoute"
import PagesAdmin from './pagesAdmin';
import PagesReseller from './pagesReseller';


const router = Router();

//paginas
router.use(PagesAdmin);
router.use(PagesReseller);

//api
router.use(usuarioRoutes); // Indexa as rotas de usuário
router.use(contaRoutes);    // Indexa as rotas de conta
router.use(configuracoesRoute);
router.use(validateAccessToken)

export default router;


