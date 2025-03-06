import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { authenticateToken } from "../middlewares/accessToken";

const router = Router();

router.post('/usuarios/login', UsuarioController.login);
router.post('/usuario/verifyExist', authenticateToken, UsuarioController.ifExistUser); //verificar se usuario existe
router.post('/usuario/setup', authenticateToken, UsuarioController.createOrUpdate); //create or update
router.post('/usuarios/add', authenticateToken, UsuarioController.createUsuario);  //tb criará contato relacional
router.post('/usuarios/list', authenticateToken, UsuarioController.getAllUsuarios);
router.post('/usuario/getById', authenticateToken, UsuarioController.getUsuarioById);
router.post('/usuario/update', authenticateToken, UsuarioController.update);
router.post('/usuarios/:id', authenticateToken, UsuarioController.deleteUsuario);


export default router;