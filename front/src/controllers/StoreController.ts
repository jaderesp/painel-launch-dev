import { Request, Response } from 'express';
import StoreService from '../services/StoreService';
import { getUserSession, getWhereUser } from '../controllers/utils/Session';
import formidable, { IncomingForm } from "formidable";
import path from "path";
import fs from "fs-extra";

class StoreController {
    // Criar uma nova dados
    public async create(req: Request, res: Response): Promise<Response> {

        try {

            let params = req.body;

            let userWhere = await getWhereUser(req, res, false);

            params = { ...params, ...userWhere }//add id_usr relacional ao registro

            const dados = await StoreService.add(params);
            if (!dados) {
                return res.status(400).json({ message: 'Erro ao criar dados.' });
            }
            return res.status(201).json(dados);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { id_store } = req.body;
            let params = req.body;
            let where;

            if (id_store) {
                where = { id_store };
            } else {
                where = { id_store: 0 };
            }

            if (!params) {
                return res.status(400).json({ message: 'parametros não informados.' });
            }

            let userWhere = await getWhereUser(req, res, false);

            where = { ...where, ...userWhere };
            params = { ...params, ...userWhere }//add id_usr relacional ao registro

            const retorno = await StoreService.upsert(params, where);
            if (!retorno) {
                return res.status(400).json({ message: 'Erro ao cadastrar.' });
            }
            return res.status(201).json(retorno);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    // Obter todas as dadoss
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            //somente registro referente ao usuario autorizado
            let where = await getWhereUser(req, res, false);

            const dadoss = await StoreService.get(where);
            return res.status(200).json(dadoss);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dadoss', error });
        }
    }

    // Obter uma dados por ID
    public async getById(req: Request, res: Response): Promise<Response> {
        try {
            //somente registro referente ao usuario autorizado
            let userWhere = await getWhereUser(req, res, false);

            let where = req.params;
            where = { ...where, ...userWhere };

            if (!where) {
                return res.status(200).json({ message: 'Parametros para pesquisa não foram informados.' });
            }

            const dados = await StoreService.getSomeOne(where);

            if (!dados) {
                return res.status(404).json({ message: 'Dados não encontrada.' });
            }
            return res.status(200).json(dados);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados', error });
        }
    }

    //criar função para verificar se categoria existe
    public async ifExist(req: Request, res: Response): Promise<Response> {
        try {

            let userWhere = await getWhereUser(req, res, false);
            let where = req.body;
            where = { ...where, ...userWhere };

            const categoria = await StoreService.getSomeOne(where);
            if (categoria) {
                return res.status(200).json({ exist: true, message: 'Já existe um registro com estes dados.' });
            }


            return res.status(200).json({ exist: false });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar registro', error });
        }
    }


    // Atualizar uma dados
    public async update(req: Request, res: Response): Promise<Response> {
        try {

            let userWhere = await getWhereUser(req, res, false);
            const { id } = req.params;
            const params = req.body;
            let where = { id_data: id, ...userWhere };

            const dados = await StoreService.update(params, where);
            if (!dados) {
                return res.status(404).json({ message: 'Dado não encontrado ou erro ao atualizar.' });
            }
            return res.status(200).json({ message: 'Dados atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar dados', error });
        }
    }

    // Remover uma dados
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const where = req.params;

            if (!where) {
                return res.status(200).json({ message: 'Informe os parametros para executar a operação de exclusão.' });
            }

            const result = await StoreService.remove(where);
            if (!result) {
                return res.status(404).json({ message: 'Dados não encontrada ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover dados', error });
        }
    }

    // upload de arquivos
    public async upload(req: Request, res: Response) {

        if (!req.file) {
            return res.status(200).json({ message: 'Nenhum arquivo enviado.' });
        }

        let { id, fileDir } = req.body;

        //atualizar diretorio do arquivo no banco referenciando o id
        await StoreService.update({ 'imagemDir': fileDir }, { id_store: id });

        res.json({ message: 'Upload realizado com sucesso!', file: req.file });
    }

    public async uploadXhr(req: Request, res: Response) {


        let fileMaxSize = 3000 * 1024;  /* 3ooMB de limite no arquivo */
        const form = new IncomingForm({
            // uploadDir: path.join(__dirname, "../../uploads"), // Diretório temporário
            keepExtensions: true,
            multiples: false, // Define se permite múltiplos arquivos
            maxFileSize: fileMaxSize, // Define o tamanho máximo do arquivo
        });

        form.parse(req, async (err, fields, files) => {

            if (err) {
                console.error("Erro ao processar upload:", err);
                return res.status(500).json({ message: "Erro ao processar o upload." });
            }

            // Capturar os campos enviados no FormData
            const id = fields.id ? String(fields.id) : null;
            const dir = fields.dir ? String(fields.dir) : "uploads";
            const subdir = fields.subdir ? String(fields.subdir) : "";

            if (!id) {
                return res.status(400).json({ message: "ID do cadastro é obrigatório." });
            }

            // Criar diretório baseado no ID do registro/cadastro
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
            await StoreService.update({ 'imagemDir': dirFile }, { id_store: id });

            res.json({
                message: "Upload realizado com sucesso!",
                filePath: `/uploads/${dir}/${subdir}/${file.newFilename}`,
                id,
                dir,
                subdir
            });


        });
    }

    //rota de interfaces customizadas
    public async getStoreData(req: Request, res: Response) {

        try {
            //verificar autorização e parametrizar o usuario que esta solicitando operação
            let where = await getWhereUser(req, res, false)

            if (!where) {
                return res.status(200).json({ message: 'Informe os parametros para executar a operação.' });
            }

            const storeData = await StoreService.get(where);

            if (!storeData) {
                return res.status(404).json({ message: 'Dados não foram encontradas.' });
            }

            let data = []
            //percorrer os dados de formatar o objeto de retorno customizado com os dados
            for (var i = 0; i < storeData.length; i++) {

                if (storeData[i]) {
                    data.push({
                        "ateam": storeData[i].titulo,
                        "aicon": storeData[i].url_img,
                        "bteam": storeData[i].url_apk
                    })
                }

            }

            res.json({ code: 0, msg: 'success', data });

        } catch (error) {
            res.status(500).json({ code: 1, msg: 'Erro ao buscar os dados', error });
        }
    }

}

export default new StoreController();
