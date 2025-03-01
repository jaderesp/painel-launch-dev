import { Router } from 'express';
import CategoriasController from '../controllers/CategoriasController';
import { authenticateToken } from "../middlewares/accessToken";
import upload from '../config/multerConfig';

const router = Router();

router.post('/categorias/verifyExist', authenticateToken, CategoriasController.ifExist);
router.post('/categorias/add', authenticateToken, CategoriasController.create);
router.post('/categorias/setup', authenticateToken, CategoriasController.createOrUpdate);
router.post('/categorias/getById', authenticateToken, CategoriasController.getById);
router.post('/categorias/list', authenticateToken, CategoriasController.getAll);
router.post('/categorias/update', authenticateToken, CategoriasController.update);
router.post('/categorias/remove', authenticateToken, CategoriasController.delete);
router.post('/categorias/upload', authenticateToken, upload.single('file'), CategoriasController.upload);
router.post('/categorias/uploadXhr', authenticateToken, CategoriasController.uploadXhr);

export default router;