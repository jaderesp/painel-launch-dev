import { Request, Response } from 'express';
import ConfiguracoesService from '../services/ConfiguracoesService';

class ConfiguracoesController {
    // Criar uma nova config
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const config = await ConfiguracoesService.add(params);
            if (!config) {
                return res.status(400).json({ message: 'Erro ao criar config.' });
            }
            return res.status(201).json(config);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { idConf } = req.body;
            const params = req.body;
            let where;

            if (idConf) {
                where = { idConf };
            }

            if (!params) {
                return res.status(400).json({ message: 'parametros não informados.' });
            }

            const retorno = await ConfiguracoesService.upsert(params, where);
            if (!retorno) {
                return res.status(400).json({ message: 'Erro ao cadastrar.' });
            }
            return res.status(201).json(retorno);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }


    // Obter todas as configs
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const configs = await ConfiguracoesService.getAll();
            return res.status(200).json(configs);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar configs', error });
        }
    }

    // Buscar um contato por ID
    static async getOne(req: Request, res: Response) {
        const { idConf } = req.params;

        try {
            const contato = await ConfiguracoesService.getSomeOne({ idConf });
            if (!contato) {
                return res.status(404).json({ message: 'Contato não encontrado.' });
            }
            return res.status(200).json(contato);
        } catch (error) {
            console.error('Erro no ContatoController (getOne):', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }


    // Obter uma config por ID
    public async getById(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.params;
            const config = await ConfiguracoesService.getSomeOne(params);
            if (!config) {
                return res.status(404).json({ message: 'config não encontrada.' });
            }
            return res.status(200).json(config);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar config', error });
        }
    }

    // Atualizar uma config
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { idConf } = req.params;
            const params = req.body;
            const config = await ConfiguracoesService.update(params, { idConf });
            if (!config) {
                return res.status(404).json({ message: 'config não encontrada ou erro ao atualizar.' });
            }
            return res.status(200).json({ message: 'config atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar', error });
        }
    }

    // Remover uma config
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { idConf } = req.params;
            const result = await ConfiguracoesService.remove({ idConf });
            if (!result) {
                return res.status(404).json({ message: 'Registro não encontrada ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover registro', error });
        }
    }
}

export default new ConfiguracoesController();
