import { UsuarioModel } from '../models/UsuarioModel';
import sequelize from '../config/sequelize'; // Configuração do banco de dados
import * as bcrypt from 'bcrypt';
import { Int32 } from 'typeorm';
import { IUserResponse } from '../interfaces/IUserResponse';
import { AuthService } from "./authService";


class UsuarioService {
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

    // Criar usuário padrão
    static async createDefaultUsuario() {

        const res = await UsuarioModel.sync();
        if (res) {
            console.log("✅ Tabela de usuário criada.");
        }

        const params = {
            owner_id: 1,
            nome: "Administrador",
            telefone: '999999999',
            email: "admin@admin.com",
            password: "admin123",
            type_usuario: "admin",
        }

        if (!params) {
            console.log("Erro, não existem dados de parâmetros para esta tarefa.");
            return false;
        }

        let { email } = params;
        let usuario = await UsuarioModel.findOne({ where: { email } });

        if (usuario) {
            //se existir cadastrar um contato com os dados deste usuario

            await this.ifCreateConactOfUser(usuario, { 'id_usr': usuario.id_usr })

            console.log("Usuário (padrão) com este email já existe.");
            return false;
        }

        params.password = await this.hashPassword(params)

        try {
            const resultadoCreate = await UsuarioModel.create(params as UsuarioModel);

            if (resultadoCreate) {
                let { id_usr } = resultadoCreate
                await this.ifCreateConactOfUser(resultadoCreate, { id_usr })

            }
            console.log("Resultado da criação de usuário padrão: ", resultadoCreate);
            return resultadoCreate;
        } catch (error) {
            console.log("Ocorreu um erro ao criar o usuário padrão: ", error);
            const res = await UsuarioModel.sync();
            if (res) {
                console.log("✅ Tabela de usuário criada.");
            }
            return false;
        }
    }

    //gerar senha hash (passoword)
    static async hashPassword(UsuarioModel: any) {
        if (UsuarioModel.password) {
            const salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(UsuarioModel.password, salt);

            return password
        } else {
            return ''
        }
    }


    //criar contato relacionado ao usuario caso não exista
    static async ifCreateConactOfUser(usuario: any, where_: any): Promise<any> {
        try {
            // Verifica se o contato já existe

            //se existir cadastrar um contato com os dados deste usuario
            const contatoParams = {
                id_conta: 1,
                id_usr: usuario.id_usr,
                type: "USER",
                nome: usuario.nome,
                email: usuario.email,
                profilePic: 'contact/atendente.png',
                telefone: usuario.telefone,
                isMe: false,
                painel: 'n/d',
                senha: 'n/d',
                status: 'offline'
            }

        } catch (error: any) {

            console.log("ocorreu um erro ao tentar criar contato referente ao usuario: ", error.toString());
            return false

        }

    }


    // Método para comparar a senha fornecida com a senha armazenada
    static async checkPassword(password: string, password_: string): Promise<boolean> {
        return bcrypt.compare(password, password_);
    }

    // Login de usuário
    static async login(params: { email: string; password: string }) {
        try {
            const usuario = await UsuarioModel.findOne({ where: { email: params.email } });
            if (!usuario) {
                return { login: false };
            }

            const { id_usr, password } = usuario;
            let resultado = {}
            Object.assign(resultado, usuario.toJSON())

            if (!(await this.checkPassword(params.password, password))) {
                return { login: false };
            }

            //gera token de autenticação
            const token = AuthService.generateToken(id_usr.toString());

            // Supondo que haja uma conta associada ao usuário
            //const account = await AccountService.getAccountByOwnerId(UsuarioModel.id);
            return { login: true, token, session: { ...resultado } };
        } catch (error) {
            console.log("Erro durante o login: ", error);
            return { login: false };
        }
    }

    // Atualizar ou criar usuário
    static async upsert(params: any, where: any) {

        if (!params || !where) {
            console.log("Erro, parâmetros ausentes.");
            return false;
        }

        //gerar hash de senha
        // params = { ...params, id_conta: 1 }
        if (params.password) {
            params.password = await this.hashPassword(params)
        }

        try {
            const foundItem = await UsuarioModel.findOne({ where });
            if (!foundItem) {

                const newUsuario = await UsuarioModel.create(params);

                if (newUsuario) {
                    let { id_usr } = newUsuario
                    await this.ifCreateConactOfUser(newUsuario, { id_usr })

                }

                return newUsuario;
            } else {

                //atualizar os dados do contato referente ao usuario
                let { id_usr } = foundItem
                await this.ifCreateConactOfUser(foundItem, { id_usr })

            }

            const updatedUsuario = await UsuarioModel.update(params, { where });
            return updatedUsuario;
        } catch (error) {
            console.log("Erro ao criar ou atualizar usuário: ", error);
            await UsuarioModel.sync();
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
            const newUsuario = await UsuarioModel.create(params);

            if (newUsuario) {

                let { id_usr } = newUsuario
                await this.ifCreateConactOfUser(newUsuario, { id_usr })

            }

            return newUsuario;
        } catch (error) {
            console.log("Erro ao criar usuário: ", error);
            await UsuarioModel.sync();
            return false;
        }
    }

    // Obter todos os usuários
    static async getAll() {
        try {
            const Usuarios = await UsuarioModel.findAll({ order: [['updatedAt', 'DESC']] });
            return Usuarios;
        } catch (error) {
            console.log("Erro ao buscar usuários: ", error);
            return false;
        }
    }

    // Buscar usuários por condição
    static async get(where: any) {
        try {
            const Usuarios = await UsuarioModel.findAll({ where });
            return Usuarios;
        } catch (error) {
            console.log("Erro ao buscar usuário: ", error);
            return false;
        }
    }

    // Obter um usuário por condição
    static async getSomeOne(where: any) {
        try {
            const usuario = await UsuarioModel.findOne({ where });
            return usuario?.toJSON() || false;
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

        if (params.password) {
            params.password = await this.hashPassword(params)
        }

        try {
            const updatedUsuario = await UsuarioModel.update(params, { where });
            return updatedUsuario;
        } catch (error) {
            console.log("Erro ao atualizar usuário: ", error);
            await UsuarioModel.sync();
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
            const result = await UsuarioModel.destroy({ where });
            return result;
        } catch (error) {
            console.log("Erro ao remover usuário: ", error);
            return false;
        }
    }

    //interfaces
    static async getIUserById(idusuario: number): Promise<IUserResponse | null> {
        try {
            const user = await UsuarioModel.findOne({ where: { "id_usr": idusuario } });

            if (!user) return null;

            // Convertendo os dados do modelo para o formato UserResponse
            const userResponse: IUserResponse = {
                id: user.id_usr, //id 0 (zero) atendente id 1 (um) contato (destinatario)
                name: user.nome,
                thumb: 'avtar/1.jpg',
                status: 'Offline', // Supondo que status seja opcional
                mesg: "", // Placeholder, pode ser ajustado conforme a lógica
                lastSeenDate: new Date(), // Placeholder, pode ser obtido via outros serviços
                onlineStatus: true, // Placeholder, deve ser baseado em lógica de presença
                typing: false, // Placeholder, pode ser ajustado via lógica de eventos
            };

            return userResponse;
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw new Error("Erro ao buscar usuário");
        }
    }


}

export default UsuarioService