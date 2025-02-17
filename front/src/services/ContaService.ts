import { ContaModel } from '../models/index';
import sequelize from '../config/sequelize'; // Configuração do banco de dados
import * as bcrypt from 'bcrypt';
import { Int32 } from 'typeorm';


class ContaService {
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
        if (!params || !where) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const foundItem = await ContaModel.findOne({ where });
            if (!foundItem) {
                const newConta = await ContaModel.create(params);
                return newConta;
            }

            const updated = await ContaModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao criar ou atualizar usuário: ", error);
            await ContaModel.sync();
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
            const newConta = await ContaModel.create(params);
            return newConta;
        } catch (error) {
            console.log("Erro ao criar usuário: ", error);
            await ContaModel.sync();
            return false;
        }
    }

    // Obter todos os usuários
    static async getAll() {
        try {
            const Conta = await ContaModel.findAll({ order: [['updatedAt', 'DESC']] });
            return Conta;
        } catch (error) {
            console.log("Erro ao buscar usuários: ", error);
            return false;
        }
    }

    // Buscar usuários por condição
    static async get(where: any) {
        try {
            const Conta = await ContaModel.findAll({ where });
            return Conta;
        } catch (error) {
            console.log("Erro ao buscar usuário: ", error);
            return false;
        }
    }

    // Obter um usuário por condição
    static async getSomeOne(where: any) {
        try {
            const Conta = await ContaModel.findOne({ where });
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
            const updated = await ContaModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao atualizar usuário: ", error);
            await ContaModel.sync();
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
            const result = await ContaModel.destroy({ where });
            return result;
        } catch (error) {
            console.log("Erro ao remover usuário: ", error);
            return false;
        }
    }


}

export default ContaService