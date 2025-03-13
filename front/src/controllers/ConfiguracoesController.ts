import { Request, Response } from 'express';
import ConfiguracoesService from '../services/ConfiguracoesService';
import UsuarioService from '../services/UsuarioService';
import formidable, { IncomingForm } from "formidable";
import path from "path";
import fs from "fs-extra";
import { getUserSession, getWhereUser } from '../controllers/utils/Session';

class ConfiguracoesController {
    // Criar uma nova config
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const config = await ConfiguracoesService.add(params);
            if (!config) {
                return res.status(400).json({ message: 'Erro ao criar config.' });
            }
            return res.status(201).json(config);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { id_conf } = req.body;
            const params = req.body;
            let where;

            if (id_conf) {
                where = { id_conf };
            } else {
                where = { id_conf: null };
            }

            //adicionar id do usuario a quem pertence as configurações

            //==== INICIO da identificação para requisição de dados ====
            let userWhere = await getWhereUser(req, res, false);

            where = { id_conf, ...userWhere };

            if (!params) {
                return res.status(200).json({ message: 'parametros não informados.' });
            }

            const retorno = await ConfiguracoesService.upsert(params, where);
            if (!retorno) {
                return res.status(400).json({ message: 'Erro ao cadastrar.' });
            }
            return res.status(201).json(retorno);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }


    // Obter todas as configs
    public async getAll(req: Request, res: Response): Promise<Response> {

        let userWhere = await getWhereUser(req, res, false);
        let params = req.body
        const { id_conf } = params;

        try {

            //retornar somente dados refrente ao usuario logado
            let where = { ...userWhere };

            if (id_conf) {
                where = { id_conf, ...where }
            }

            const configs = await ConfiguracoesService.get(where);
            return res.status(200).json(configs);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar configs', error });
        }
    }

    // Buscar um contato por ID
    static async getOne(req: Request, res: Response) {

        let userWhere = await getWhereUser(req, res, false);

        let params = req.body
        const { id_conf } = params;

        try {

            let where = { id_conf, ...userWhere };

            const contato = await ConfiguracoesService.getSomeOne(where);

            if (!contato) {
                return res.status(404).json({ message: 'Contato não encontrado.' });
            }
            return res.status(200).json(contato);
        } catch (error) {
            console.error('Erro no ContatoController (getOne):', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }


    // Obter uma config por ID
    public async getById(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const config = await ConfiguracoesService.getSomeOne(params);
            if (!config) {
                return res.status(404).json({ message: 'config não encontrada.' });
            }
            return res.status(200).json(config);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar config', error });
        }
    }

    // Atualizar uma config
    public async update(req: Request, res: Response): Promise<Response> {

        try {

            const { params } = req.body;

            if (!params || params.length == 0) {
                return res.status(400).json({ message: 'parametros não informados.' });
            }

            for (var i = 0; params.length > i; i++) {

                let { id_conf } = params[i];
                const config = await ConfiguracoesService.update(params[i], { id_conf });
                if (!config) {
                    return res.status(404).json({ message: 'config não encontrada ou erro ao atualizar.' });
                }

            }

            return res.status(200).json({ message: 'config atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar', error });
        }
    }

    // Remover uma config
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id_conf } = req.body;
            const result = await ConfiguracoesService.remove({ id_conf });
            if (!result) {
                return res.status(404).json({ message: 'Registro não encontrada ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover registro', error });
        }
    }

    public async uploadXhr(req: Request, res: Response) {


        let fileMaxSize = (300) * 1000 * 1024;  /* 300MB de limite no arquivo */
        const form = new IncomingForm({
            // uploadDir: path.join(__dirname, "../../uploads"), // Diretório temporário
            keepExtensions: true,
            multiples: false, // Define se permite múltiplos arquivos
            maxFileSize: fileMaxSize, // Define o tamanho máximo do arquivo
        });

        form.parse(req, async (err, fields, files) => {

            if (err) {
                console.error("Erro ao processar upload:", err);
                return res.status(500).json({ message: `Erro ao processar o upload. Erro: ${err}` });
            }

            // Capturar os campos enviados no FormData
            const id = fields.id ? String(fields.id) : null;
            const dir = fields.dir ? String(fields.dir) : "uploads";
            const subdir = fields.subdir ? String(fields.subdir) : "";
            const fieldOfTable = fields.fieldtable ? String(fields.fieldtable) : "";

            if (!id) {
                return res.status(400).json({ message: "ID do cadastro é obrigatório." });
            }

            if (!fieldOfTable) {
                return res.status(400).json({ message: "Cammpos para atualização do diretório no banco está ausente." });
            }

            // Criar diretório baseado no ID do usuário/cadastro
            const uploadPath = path.join(__dirname, "../../public/uploads", dir, subdir);
            await fs.ensureDir(uploadPath);

            // Processar o arquivo enviado
            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            if (!file) {
                return res.status(400).json({ message: "Nenhum arquivo enviado." });
            }

            //retornar valor file[0].newFilename
            const newFilePath = path.join(uploadPath, file.newFilename);
            await fs.move(file.filepath, newFilePath); // Move o arquivo do temp para o diretório correto

            let dirFile = `/uploads/${dir}/${subdir}/${file.newFilename}`
            //atualizar diretorio do arquivo no banco referenciando o id
            await ConfiguracoesService.update({ [fieldOfTable]: dirFile }, { id_game: id });

            res.json({
                message: "Upload realizado com sucesso!",
                filePath: `/uploads/${dir}/${subdir}/${file.newFilename}`,
                id,
                dir,
                subdir
            });


        });
    }

    //rotas de interfaces customizadas
    public customConfigData = async (req: Request, res: Response) => {

        //verificar autorização e parametrizar o usuario que esta solicitando operação
        let where = await getWhereUser(req, res, false)

        try {

            const configuracoes = await ConfiguracoesService.get(where);

            if (!configuracoes) {
                return res.status(200).json({ message: "Os dados de configurações não foram encontradas." })
            }


            //converter os dados de img_logo, img_back e imb_banner de string para json
            configuracoes.forEach((config) => {
                if (config.img_logo) {
                    config.img_logo = JSON.parse(config.img_logo);

                    let concat = ''
                    for (var i = 0; i < config.img_logo.length; i++) {
                        //acessar o indice url se ele existir (config.img_logo[i].url)
                        let obj = JSON.parse(JSON.stringify(config.img_logo[i]))
                        let str_ = obj.url
                        concat += JSON.stringify(str_).replace(/"/g, '')

                        if (i < (config.img_logo.length - 1)) {
                            concat += ","
                        }
                    }

                    config.img_logo = concat;
                }
                if (config.img_back) {
                    config.img_back = JSON.parse(config.img_back);

                    //concatenar urls em string separadas por virgula
                    let concat = ''
                    for (var i = 0; i < config.img_back.length; i++) {
                        //acessar o indice url se ele existir (config.img_logo[i].url)
                        let obj = JSON.parse(JSON.stringify(config.img_back[i]))
                        let str_ = obj.url
                        concat += JSON.stringify(str_).replace(/"/g, '')

                        if (i < (config.img_back.length - 1)) {
                            concat += ","
                        }
                    }

                    config.img_back = concat;

                    config.img_back = JSON.stringify(config.img_back).replace(/"/g, '');
                }
                if (config.img_banner) {
                    config.img_banner = JSON.parse(config.img_banner);

                    //concatenar urls em string separadas por virgula
                    let concat = ''
                    for (var i = 0; i < config.img_banner.length; i++) {
                        //acessar o indice url se ele existir (config.img_logo[i].url)
                        let obj = JSON.parse(JSON.stringify(config.img_banner[i]))
                        let str_ = obj.url
                        concat += JSON.stringify(str_).replace(/"/g, '')

                        if (i < (config.img_banner.length - 1)) {
                            concat += ","
                        }
                    }

                    config.img_banner = concat;

                    config.img_banner = JSON.stringify(config.img_banner).replace(/"/g, '');
                }
            });


            let data = {}
            //percorrer os dados de img_logo, img_back e imb_banner converter dados para string e concaterná-las separando por vírgula.
            for (var i = 0; i < configuracoes.length; i++) {

                switch (configuracoes[i].type) {
                    case 'APP':
                        let app = {
                            "name": configuracoes[i].titulo,
                            "img_app": configuracoes[i].img_app,
                            "pacote_app": configuracoes[i].pacote,
                            "version_app": configuracoes[i].versao,
                            "descricao_app": configuracoes[i].descricao,
                            "url_app": configuracoes[i].url_apk
                        }

                        data = { ...data, ...app }
                        break;
                    case 'UPDATE':

                        let upd = {
                            "versionupdate": configuracoes[i].versao,
                            "descricaoupdate": configuracoes[i].descricao,
                            "urlupdate": configuracoes[i].url_apk,
                        }

                        data = { ...data, ...upd }

                        break
                    case 'MIDIA':

                        let midia = {
                            "logo": configuracoes[i].img_logo,
                            "back": configuracoes[i].img_back,
                            "video": configuracoes[i].img_banner
                        }

                        data = { ...data, ...midia }

                        break;
                    default:
                        break;


                }
            }

            res.json({ code: 0, msg: 'success', data });

        } catch (error) {
            res.status(500).json({ code: 1, msg: 'Erro ao buscar os dados', error });
        }
    }


}

export default new ConfiguracoesController();
