import { Router } from 'express';
import ConfiguracoesController from '../controllers/ConfiguracoesController';

const router = Router();

router.post('/configuracoes/add', ConfiguracoesController.create);
router.post('/configuracoes/setup', ConfiguracoesController.createOrUpdate);
router.post('/configuracoes', ConfiguracoesController.getAll);
router.get('/configuracoes/:id', ConfiguracoesController.getById);
router.put('/configuracoes/:id', ConfiguracoesController.update);
router.delete('/configuracoes/:id', ConfiguracoesController.delete);

export default router;