import { Router } from 'express';
import ConfiguracoesController from '../controllers/ConfiguracoesController';
import { authenticateToken } from "../middlewares/accessToken";

const router = Router();

router.post('/configuracoes/add', authenticateToken, ConfiguracoesController.create);
router.post('/configuracoes/setup', authenticateToken, ConfiguracoesController.createOrUpdate);
router.post('/configuracoes/list', authenticateToken, ConfiguracoesController.getAll);
router.post('/configuracoes/getById', authenticateToken, ConfiguracoesController.getById);
router.post('/configuracoes/update', authenticateToken, ConfiguracoesController.update);
router.post('/configuracoes/remove', authenticateToken, ConfiguracoesController.delete);

export default router;