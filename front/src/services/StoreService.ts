import { StoreModel } from '../models/index';
import sequelize from '../config/sequelize'; // Configuração do banco de dados
import * as bcrypt from 'bcrypt';
import { Int32 } from 'typeorm';


class StoreService {
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


    // Atualizar ou criar dados
    static async upsert(params: any, where: any) {
        if (!params) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const foundItem = await StoreModel.findOne({ where });
            if (!foundItem) {
                const newdata = await StoreModel.create(params);
                return newdata;
            }

            const updated = await StoreModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao criar ou atualizar dados: ", error);
            await StoreModel.sync();
            return false;
        }
    }

    // Criar dados
    static async add(params: any) {
        if (!params) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const newdata = await StoreModel.create(params);
            return newdata;
        } catch (error) {
            console.log("Erro ao criar dados: ", error);
            await StoreModel.sync();
            return false;
        }
    }

    // Obter todos os dadoss
    static async getAll() {
        try {
            const data = await StoreModel.findAll({ order: [['updatedAt', 'DESC']] });
            return data;
        } catch (error) {
            console.log("Erro ao buscar dadoss: ", error);
            return false;
        }
    }

    // Buscar dadoss por condição
    static async get(where: any) {
        try {
            const data = await StoreModel.findAll({ where });
            return data;
        } catch (error) {
            console.log("Erro ao buscar dados: ", error);
            return false;
        }
    }

    // Obter um dados por condição
    static async getSomeOne(where: any) {
        try {
            const data = await StoreModel.findOne({ where });
            return data?.toJSON() || false;
        } catch (error) {
            console.log("Erro ao buscar dados: ", error);
            return false;
        }
    }

    // Atualizar dados
    static async update(params: any, where: any) {
        if (!params || !where) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const updated = await StoreModel.update(params, { where });
            return updated;
        } catch (error) {
            console.log("Erro ao atualizar dados: ", error);
            await StoreModel.sync();
            return false;
        }
    }

    // Remover dados
    static async remove(where: any) {
        if (!where) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        try {
            const result = await StoreModel.destroy({ where });
            return result;
        } catch (error) {
            console.log("Erro ao remover dados: ", error);
            return false;
        }
    }


}

export default StoreService