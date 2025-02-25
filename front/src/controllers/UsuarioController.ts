import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';

class UsuarioController {
    // Criar um novo usuário
    public async createUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const usuario = await UsuarioService.add(params);
            if (!usuario) {
                return res.status(400).json({ message: 'Erro ao criar usuário.' });
            }
            return res.status(201).json(usuario);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { id_usr, email, telefone } = req.body;
            const params = req.body;
            let where;;

            if (id_usr) {
                where = { id_usr };  //editar usuario existente
            } else {
                where = { email, telefone, id_usr }
            }

            if (!email) {
                return res.status(400).json({ message: 'Email deve ser fornecido.' });
            }

            if (!telefone) {
                return res.status(400).json({ message: 'Telefone deve ser fornecido.' });
            }

            if (!params) {
                return res.status(400).json({ message: 'ID do usuário não fornecido.' });
            }

            const usuario = await UsuarioService.upsert(params, where);
            if (!usuario) {
                return res.status(400).json({ message: 'Erro ao criar usuário.' });
            }
            return res.status(201).json(usuario);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    //criar função para verificar se usuario existe
    public async ifExistUser(req: Request, res: Response): Promise<Response> {
        try {
            const where = req.body;
            const usuario = await UsuarioService.getSomeOne(where);
            if (usuario) {
                return res.status(404).json({ exist: true, message: 'Já existe um usuário com esse email ou telefone.' });
            }


            return res.status(200).json({ exist: false });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    }

    // Obter todos os usuários
    public async getAllUsuarios(req: Request, res: Response): Promise<Response> {
        try {
            const usuarios = await UsuarioService.getAll();
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuários', error });
        }
    }

    // Obter um usuário por ID
    public async getUsuarioById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const usuario = await UsuarioService.getSomeOne({ id_usr: id });
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json(usuario);

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    }

    // Atualizar um usuário
    public async updateUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const params = req.body;
            const usuario = await UsuarioService.update(params, { id_usr: id });
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado ou erro ao atualizar.' });
            }
            return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar usuário', error });
        }
    }

    // Remover um usuário
    public async deleteUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await UsuarioService.remove({ id_usr: id });
            if (!result) {
                return res.status(404).json({ message: 'Usuário não encontrado ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover usuário', error });
        }
    }

    // Login de usuário
    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const loginResult = await UsuarioService.login({ email, password });
            if (!loginResult.login) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Gravar sessão
            if (req.session) {
                (req.session as any).user = loginResult || undefined;
            }

            let { session } = loginResult;

            return res.status(200).json({ session });
        } catch (error) {
            return res.status(500).json({ message: 'Erro durante o login', error });
        }
    }


}

export default new UsuarioController();
