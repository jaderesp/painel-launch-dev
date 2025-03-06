import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';

const router = Router();

router.post('/usuarios', UsuarioController.createUsuario);
router.get('/usuarios', UsuarioController.getAllUsuarios);
router.get('/usuarios/:id', UsuarioController.getUsuarioById);
router.put('/usuarios/:id', UsuarioController.update);
router.delete('/usuarios/:id', UsuarioController.deleteUsuario);

export default router;