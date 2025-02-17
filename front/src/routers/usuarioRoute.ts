import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';

const router = Router();

router.post('/usuario/verifyExist', UsuarioController.ifExistUser); //verificar se usuario existe
router.post('/usuario/create', UsuarioController.createOrUpdate); //create or update
router.post('/usuarios/add', UsuarioController.createUsuario);  //tb criará contato relacional
router.get('/usuarios', UsuarioController.getAllUsuarios);
router.get('/usuarios/:id', UsuarioController.getUsuarioById);
router.put('/usuarios/:id', UsuarioController.updateUsuario);
router.delete('/usuarios/:id', UsuarioController.deleteUsuario);
router.post('/usuarios/login', UsuarioController.login);

export default router;