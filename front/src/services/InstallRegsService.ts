import { InstallRegsModel } from '../models/index';
import sequelize from '../config/sequelize'; // Configuração do banco de dados
import * as bcrypt from 'bcrypt';
import { Int32 } from 'typeorm';


class InstallRegsService {
    // Sincronizar tabelas
    static async sync() {
        try {
            const resultado = await sequelize.sync({ force: true });
            return resultado;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    // Atualizar ou criar usuário
    static async upsert(params: any, where: any) {
        if (!params) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const foundItem = await InstallRegsModel.findOne({ where });
            if (!foundItem) {
                const newConta = await InstallRegsModel.create(params);
                return newConta;
            }

            const updated = await InstallRegsModel.update(params, { where });

            let data = await InstallRegsModel.findOne({ where });

            if (data) {
                //verificar se cliente está expirado
                if (new Date(data.data_expiracao) < new Date()) {
                    data.status = 'EXPIRADO';
                } else {
                    data.status = 'ATIVO';
                }
            }

            let retorno = {
                instalacao: data,
                retorno: updated
            };
            return retorno;

        } catch (error) {
            console.log("Erro ao criar ou atualizar usuário: ", error);
            await InstallRegsModel.sync();
            return false;
        }
    }

    // Criar usuário
    static async add(params: any) {
        if (!params) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const newConta = await InstallRegsModel.create(params);
            return newConta;
        } catch (error) {
            console.log("Erro ao criar usuário: ", error);
            await InstallRegsModel.sync();
            return false;
        }
    }

    // Obter todos os usuários
    static async getAll() {
        try {
            const Conta = await InstallRegsModel.findAll({ order: [['updatedAt', 'DESC']] });
            return Conta;
        } catch (error) {
            console.log("Erro ao buscar usuários: ", error);
            return false;
        }
    }

    // Buscar usuários por condição
    static async get(where: any) {
        try {
            const Conta = await InstallRegsModel.findAll({ where });
            return Conta;
        } catch (error) {
            console.log("Erro ao buscar usuário: ", error);
            return false;
        }
    }

    // Obter um usuário por condição
    static async getSomeOne(where: any) {
        try {
            const Conta = await InstallRegsModel.findOne({ where });
            return Conta?.toJSON() || false;
        } catch (error) {
            console.log("Erro ao buscar usuário: ", error);
            return false;
        }
    }

    // Atualizar usuário
    static async update(params: any, where: any) {
        if (!params || !where) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const updated = await InstallRegsModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao atualizar usuário: ", error);
            await InstallRegsModel.sync();
            return false;
        }
    }

    // Remover usuário
    static async remove(where: any) {
        if (!where) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const result = await InstallRegsModel.destroy({ where });
            return result;
        } catch (error) {
            console.log("Erro ao remover usuário: ", error);
            return false;
        }
    }


}

export default InstallRegsService