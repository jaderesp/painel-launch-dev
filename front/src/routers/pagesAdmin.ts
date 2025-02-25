import { Router } from 'express';
import { categorias, home, login } from '../controllers/PagesAdminController';
import { verifySession } from './default';
import { verificarSessao } from '../middlewares/authMiddleware';

const router = Router();

router.get('/admin', login);
router.get('/verifySession', login);
router.get('/admin/dashboard', verificarSessao, home);
router.get('/admin/categorias', verificarSessao, categorias);

export default router;