import { Sequelize } from 'sequelize-typescript';
import { UsuarioModel } from "./UsuarioModel"
import ContaModel from "./ContaModel"
import { ConfiguracoesModel } from "./ConfiguracoesModel"
import { CategoriasModel } from "./CategoriasModel"

const initializeModels = async (sequelize: Sequelize) => {
    await sequelize.sync(); //criar as tabelas caso nao existam
    sequelize.addModels([
        UsuarioModel,
        ContaModel,
        ConfiguracoesModel,
        CategoriasModel
    ]); // Adicionar as models ao Sequelize
};

export {
    initializeModels,
    UsuarioModel,
    ContaModel,
    ConfiguracoesModel,
    CategoriasModel
}
export default UsuarioModel
