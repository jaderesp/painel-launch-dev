import { Router } from 'express';
import DashboardController from '../controllers/DashboardController';
import { authenticateToken } from "../middlewares/accessToken";

const router = Router();

//resellers routes
router.post('/dashboard/totalClientsbyReseller', authenticateToken, DashboardController.getTotalClientsByReseller);
router.post('/dashboard/clientsExpiresByReseller', authenticateToken, DashboardController.getExpiringClientsByReseller);
router.post('/dashboard/totalExpiredClients', authenticateToken, DashboardController.getExpiredClientsByReseller);

//admin routes
router.post('/dashboard/totalResellersActive', authenticateToken, DashboardController.getTotalActiveResellers);
router.post('/dashboard/totalClients', authenticateToken, DashboardController.getTotalActiveClients);
router.post('/dashboard/totalExpiredResellers', authenticateToken, DashboardController.getExpiredResellersByPeriod);

export default router;