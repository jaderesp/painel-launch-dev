import { Request, Response } from 'express';
import ContaService from '../services/ContaService';

class ContaController {
    // Criar uma nova conta
    public async createConta(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const conta = await ContaService.add(params);
            if (!conta) {
                return res.status(400).json({ message: 'Erro ao criar conta.' });
            }
            return res.status(201).json(conta);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    // Obter todas as contas
    public async getAllContas(req: Request, res: Response): Promise<Response> {
        try {
            const contas = await ContaService.getAll();
            return res.status(200).json(contas);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar contas', error });
        }
    }

    // Obter uma conta por ID
    public async getContaById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const conta = await ContaService.getSomeOne({ id_conta: id });
            if (!conta) {
                return res.status(404).json({ message: 'Conta não encontrada.' });
            }
            return res.status(200).json(conta);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar conta', error });
        }
    }

    // Atualizar uma conta
    public async updateConta(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const params = req.body;
            const conta = await ContaService.update(params, { id_conta: id });
            if (!conta) {
                return res.status(404).json({ message: 'Conta não encontrada ou erro ao atualizar.' });
            }
            return res.status(200).json({ message: 'Conta atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar conta', error });
        }
    }

    // Remover uma conta
    public async deleteConta(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await ContaService.remove({ id_conta: id });
            if (!result) {
                return res.status(404).json({ message: 'Conta não encontrada ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover conta', error });
        }
    }
}

export default new ContaController();
