import { Router } from 'express';
import { categorias, home, login } from '../controllers//PagesResellerController';
import { verifySession } from './default';
import { verificarSessao } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', login);
router.get('/verifySession', login);
router.get('/reseller/dashboard', verificarSessao, home);
router.get('/reseller/categorias', verificarSessao, categorias);

export default router;