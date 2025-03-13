import { Request, Response } from 'express';
import DashboardRegsService from '../services/DashboardService';
import { getUserSession, getWhereUser } from '../controllers/utils/Session';
import formidable, { IncomingForm } from "formidable";
import path from "path";
import fs from "fs-extra";

class DashboardController {


    /**
   * Dashboard para usuário do tipo Reseller
   */

    // Obter todas as datas
    public async getTotalClientsByReseller(req: Request, res: Response): Promise<Response> {
        try {

            //somente registro referente ao usuario autorizado
            let where = await getWhereUser(req, res, false);

            if (!where) {
                return res.status(200).json({
                    message: 'Você não tem permissão para acess', qtde: 0
                })
            }

            let { id_usr } = 'id_usr' in where ? where : { id_usr: 0 }

            let qtde = await DashboardRegsService.getTotalClientsByReseller(id_usr);

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }

    public async getTotalNewClientsByReseller(req: Request, res: Response): Promise<Response> {
        try {

            //somente registro referente ao usuario autorizado
            let where = await getWhereUser(req, res, false);

            if (!where) {
                return res.status(200).json({
                    message: 'Você não tem permissão para acess', qtde: 0
                })
            }

            let { id_usr } = 'id_usr' in where ? where : { id_usr: 0 }

            let qtde = await DashboardRegsService.getTotalNewClientsByReseller(id_usr);

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }

    public async getExpiringClientsByReseller(req: Request, res: Response): Promise<Response> {
        try {

            let { date } = req.body

            //somente registro referente ao usuario autorizado
            let where = await getWhereUser(req, res, false);

            if (!where) {
                return res.status(200).json({
                    message: 'Você não tem permissão para acess', qtde: 0
                })
            }

            let { id_usr } = 'id_usr' in where ? where : { id_usr: 0 }

            let qtde = await DashboardRegsService.getExpiringClientsByReseller(id_usr, date);

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }

    public async getExpiredClientsByReseller(req: Request, res: Response): Promise<Response> {
        try {

            let { date } = req.body

            //somente registro referente ao usuario autorizado
            let where = await getWhereUser(req, res, false);

            if (!where) {
                return res.status(200).json({
                    message: 'Você não tem permissão para acess', qtde: 0
                })
            }

            let { id_usr } = 'id_usr' in where ? where : { id_usr: 0 }

            let qtde = await DashboardRegsService.getExpiredClientsByReseller(id_usr);

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }


    /**
   * Dashboard para usuário do tipo Administrador
   */

    public async getTotalActiveResellers(req: Request, res: Response): Promise<Response> {
        try {

            let qtde = await DashboardRegsService.getTotalActiveResellers();

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }

    public async getTotalNewActiveClients(req: Request, res: Response): Promise<Response> {
        try {

            let qtde = await DashboardRegsService.getTotalActiveResellers();

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }

    public async getTotalActiveClients(req: Request, res: Response): Promise<Response> {

        try {

            let qtde = await DashboardRegsService.getTotalActiveClients();

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }

    public async getExpiredResellersByPeriod(req: Request, res: Response): Promise<Response> {

        try {

            let qtde = await DashboardRegsService.getExpiredResellersByPeriod();

            if (!qtde) {
                qtde = 0
            }

            return res.status(200).json({ qtde });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', qtde: 0, error });
        }
    }


}

export default new DashboardController();
