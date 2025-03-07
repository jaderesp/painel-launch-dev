import { Sequelize } from 'sequelize-typescript';
import { UsuarioModel } from "./UsuarioModel"
import ContaModel from "./ContaModel"
import { ConfiguracoesModel } from "./ConfiguracoesModel"
import { CategoriasModel } from "./CategoriasModel"
import { GamesModel } from "./GamesModel"
import { InstallRegsModel } from "./InstallRegsModel"


const initializeModels = async (sequelize: Sequelize) => {
    await sequelize.sync(); //criar as tabelas caso nao existam
    sequelize.addModels([
        UsuarioModel,
        ContaModel,
        ConfiguracoesModel,
        CategoriasModel,
        GamesModel,
        InstallRegsModel
    ]); // Adicionar as models ao Sequelize
};

export {
    initializeModels,
    UsuarioModel,
    ContaModel,
    ConfiguracoesModel,
    CategoriasModel,
    GamesModel,
    InstallRegsModel
}
export default UsuarioModel
