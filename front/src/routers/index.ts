import { Router } from 'express';
import usuarioRoutes from './usuarioRoute';
import contaRoutes from './contasRoute';
import configuracoesRoute from './configuracoesRoute';
import validateAccessToken from "./validateAccessTokenRoute"
import PagesAdmin from './pagesAdmin';
import PagesReseller from './pagesReseller';
import CategoriasRoute from './categoriasRoute';
import GamesRoute from './gamesRoute';
import InstallRegsRoute from './installRegsRoute';
import StoreRoute from './StoreRoute'


const router = Router();

//admin pages
router.use(PagesAdmin);

//reseller pages
router.use(PagesReseller);

//api admin
router.use(CategoriasRoute);
router.use(StoreRoute);
router.use(GamesRoute);
router.use(usuarioRoutes); // Indexa as rotas de usuário
router.use(contaRoutes);    // Indexa as rotas de conta
router.use(configuracoesRoute);
router.use(validateAccessToken)

//api reseller
router.use(InstallRegsRoute);


export default router;


