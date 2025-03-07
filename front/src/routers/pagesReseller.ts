import { Router } from 'express';
import { categorias, home, login, perfil, configuracoes } from '../controllers//PagesResellerController';
import { verifySession } from './default';
import { verificarSessao } from '../middlewares/authResellers';

const router = Router();

router.get('/', login);
router.get('/verifySession', login);
router.get('/reseller/dashboard', verificarSessao, home);
router.get('/reseller/categorias', verificarSessao, categorias);
router.get('/reseller/perfil', verificarSessao, perfil);
router.get('/reseller/configuracoes', verificarSessao, configuracoes);

export default router;