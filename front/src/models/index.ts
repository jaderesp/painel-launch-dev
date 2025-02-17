import { Sequelize } from 'sequelize-typescript';
import { UsuarioModel } from "./UsuarioModel"
import ContaModel from "./ContaModel"
import { ConfiguracoesModel } from "./ConfiguracoesModel"

const initializeModels = async (sequelize: Sequelize) => {
    await sequelize.sync(); //criar as tabelas caso nao existam
    sequelize.addModels([UsuarioModel, ContaModel, ConfiguracoesModel]); // Adicionar as models ao Sequelize
};

export { initializeModels, UsuarioModel, ContaModel, ConfiguracoesModel }
export default UsuarioModel
