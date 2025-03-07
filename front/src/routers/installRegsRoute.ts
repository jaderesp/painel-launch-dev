import { Router } from 'express';
import InstallRegsController from '../controllers/InstallRegsController';
import { authenticateToken } from "../middlewares/accessToken";

const router = Router();

router.post('/install/verifyExist', authenticateToken, InstallRegsController.ifExist);
router.post('/install/add', authenticateToken, InstallRegsController.create);
router.post('/install/setup', authenticateToken, InstallRegsController.createOrUpdate);
router.post('/install/getById', authenticateToken, InstallRegsController.getById);
router.post('/install/list', authenticateToken, InstallRegsController.getAll);
router.post('/install/update', authenticateToken, InstallRegsController.update);
router.post('/install/remove', authenticateToken, InstallRegsController.delete);

export default router;