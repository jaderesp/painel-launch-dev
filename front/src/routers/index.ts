import { Router } from 'express';
import usuarioRoutes from './usuarioRoute';
import contaRoutes from './contasRoute';
import configuracoesRoute from './configuracoesRoute';
import validateAccessToken from "./validateAccessTokenRoute"
import { home, login } from './default';

const router = Router();

router.get('/', login);
router.get('/dashboard', home);
router.use(usuarioRoutes); // Indexa as rotas de usuário
router.use(contaRoutes);    // Indexa as rotas de conta
router.use(configuracoesRoute);
router.use(validateAccessToken)

export default router;


