import { Router } from 'express';
import { usuarios, categorias, home, login } from '../controllers/PagesAdminController';
import { verifySession } from './default';
import { verificarSessao } from '../middlewares/authMiddleware';

const router = Router();

router.get('/admin', login);
router.get('/verifySession', login);
router.get('/admin/dashboard', verificarSessao, home);
router.get('/admin/categorias', verificarSessao, categorias);
router.get('/admin/usuarios', verificarSessao, usuarios);

export default router;