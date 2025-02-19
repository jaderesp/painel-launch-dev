import { Router } from 'express';
import usuarioRoutes from './usuarioRoute';
import contaRoutes from './contasRoute';
import configuracoesRoute from './configuracoesRoute';
import validateAccessToken from "./validateAccessTokenRoute"
import { home, login, verifySession } from './default';
import { verificarSessao } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', login);
router.get('/verifySession', login);
router.get('/dashboard', verificarSessao, home);
router.use(usuarioRoutes); // Indexa as rotas de usuário
router.use(contaRoutes);    // Indexa as rotas de conta
router.use(configuracoesRoute);
router.use(validateAccessToken)

export default router;


