import { Router } from 'express';
import GamesController from '../controllers/GamesController';
import { authenticateToken } from "../middlewares/accessToken";
import upload from '../config/multerConfig';

const router = Router();

router.post('/games/verifyExist', authenticateToken, GamesController.ifExist);
router.post('/games/add', authenticateToken, GamesController.create);
router.post('/games/setup', authenticateToken, GamesController.createOrUpdate);
router.post('/games/getById', authenticateToken, GamesController.getById);
router.post('/games/list', authenticateToken, GamesController.getAll);
router.post('/games/update', authenticateToken, GamesController.update);
router.post('/games/remove', authenticateToken, GamesController.delete);
router.post('/games/upload', authenticateToken, upload.single('file'), GamesController.upload);
router.post('/games/uploadXhr', authenticateToken, GamesController.uploadXhr);

//rotas de acesso externo (livre de autenticação)
router.get('/games/all', GamesController.getAllCustom);

export default router;