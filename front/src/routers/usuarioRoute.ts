import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { verificarSessao } from '../middlewares/authMiddleware';

const router = Router();

router.post('/usuario/verifyExist', verificarSessao, UsuarioController.ifExistUser); //verificar se usuario existe
router.post('/usuario/create', verificarSessao, UsuarioController.createOrUpdate); //create or update
router.post('/usuarios/add', verificarSessao, UsuarioController.createUsuario);  //tb criará contato relacional
router.get('/usuarios', verificarSessao, UsuarioController.getAllUsuarios);
router.get('/usuarios/:id', verificarSessao, UsuarioController.getUsuarioById);
router.put('/usuarios/:id', verificarSessao, UsuarioController.updateUsuario);
router.delete('/usuarios/:id', verificarSessao, UsuarioController.deleteUsuario);
router.post('/usuarios/login', UsuarioController.login);

export default router;