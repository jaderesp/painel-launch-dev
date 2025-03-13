import { InstallRegsModel, UsuarioModel } from '../models/index';
import sequelize from '../config/sequelize'; // Configuração do banco de dados
import * as bcrypt from 'bcrypt';
import { Int32 } from 'typeorm';
import { Op } from 'sequelize';

class DashboardService {
    /**
     * Dashboard para usuário do tipo Reseller
     */

    // Quantidade total de clientes (installRegs) relacionados ao usuário Reseller
    async getTotalClientsByReseller(id_usr: any) {
        return await InstallRegsModel.count({ where: { id_usr } });
    }

    // Quantidade de clientes expirando hoje ou por data específica
    async getExpiringClientsByReseller(id_usr: any, date?: string) {
        const filterDate = date || new Date().toISOString().split('T')[0];
        return await InstallRegsModel.count({
            where: {
                id_usr,
                data_expiracao: { [Op.eq]: filterDate }
            }
        });
    }

    // Quantidade de clientes expirados
    async getExpiredClientsByReseller(id_usr: any) {
        return await InstallRegsModel.count({
            where: {
                id_usr,
                data_expiracao: { [Op.lt]: new Date() }
            }
        });
    }

    /**
     * Dashboard para usuário do tipo Administrador
     */

    // Quantidade total de usuários do tipo Reseller com status ativo
    async getTotalActiveResellers() {
        return await UsuarioModel.count({
            where: { type_usuario: 'Reseller', status: 'ativo' }
        });
    }

    // Quantidade total de clientes (installRegs) com status ativo
    async getTotalActiveClients() {
        return await InstallRegsModel.count({ where: { status: 'ativo' } });
    }

    // Quantidade de revendas expiradas por período (hoje ou data opcional)
    async getExpiredResellersByPeriod(date?: string) {
        const filterDate = date || new Date().toISOString().split('T')[0];
        return await UsuarioModel.count({
            where: {
                type_usuario: 'Reseller',
                data_expiracao: { [Op.eq]: filterDate }
            }
        });
    }
}

export default new DashboardService();
