import { Router } from 'express';
import StoreController from '../controllers/StoreController';
import { authenticateToken } from "../middlewares/accessToken";
import upload from '../config/multerConfig';

const router = Router();

router.post('/store/verifyExist', authenticateToken, StoreController.ifExist);
router.post('/store/add', authenticateToken, StoreController.create);
router.post('/store/setup', authenticateToken, StoreController.createOrUpdate);
router.post('/store/getById', authenticateToken, StoreController.getById);
router.post('/store/list', authenticateToken, StoreController.getAll);
router.post('/store/update', authenticateToken, StoreController.update);
router.post('/store/remove', authenticateToken, StoreController.delete);
router.post('/store/upload', authenticateToken, upload.single('file'), StoreController.upload);
router.post('/store/uploadXhr', authenticateToken, StoreController.uploadXhr);

//rotas de interfaces customizadas (acesso externo)
router.get('/api/store-data', authenticateToken, StoreController.getStoreData);

export default router;