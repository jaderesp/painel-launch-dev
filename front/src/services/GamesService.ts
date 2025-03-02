import { GamesModel } from '../models/index';
import sequelize from '../config/sequelize'; // Configuração do banco de dados
import * as bcrypt from 'bcrypt';
import { Int32 } from 'typeorm';


class GamesService {
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
            const foundItem = await GamesModel.findOne({ where });
            if (!foundItem) {
                const newConta = await GamesModel.create(params);
                return newConta;
            }

            const updated = await GamesModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao criar ou atualizar usuário: ", error);
            await GamesModel.sync();
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
            const newConta = await GamesModel.create(params);
            return newConta;
        } catch (error) {
            console.log("Erro ao criar usuário: ", error);
            await GamesModel.sync();
            return false;
        }
    }

    // Obter todos os usuários
    static async getAll() {
        try {
            const Conta = await GamesModel.findAll({ order: [['updatedAt', 'DESC']] });
            return Conta;
        } catch (error) {
            console.log("Erro ao buscar usuários: ", error);
            return false;
        }
    }

    // Buscar usuários por condição
    static async get(where: any) {
        try {
            const Conta = await GamesModel.findAll({ where });
            return Conta;
        } catch (error) {
            console.log("Erro ao buscar usuário: ", error);
            return false;
        }
    }

    // Obter um usuário por condição
    static async getSomeOne(where: any) {
        try {
            const Conta = await GamesModel.findOne({ where });
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
            const updated = await GamesModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao atualizar usuário: ", error);
            await GamesModel.sync();
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
            const result = await GamesModel.destroy({ where });
            return result;
        } catch (error) {
            console.log("Erro ao remover usuário: ", error);
            return false;
        }
    }


}

export default GamesService