import { Request, Response } from 'express';
import InstallRegsService from '../services/InstallRegsService';
import { getUserSession } from '../controllers/utils/Session';
import formidable, { IncomingForm } from "formidable";
import path from "path";
import fs from "fs-extra";

class InstallRegsController {
    // Criar uma nova data
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const data = await InstallRegsService.add(params);
            if (!data) {
                return res.status(400).json({ message: 'Erro ao criar data.' });
            }
            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { id_inst, mac } = req.body;
            const params = req.body;
            let where;

            if (id_inst) {
                where = { id_inst };
            } else if (mac) {
                where = { mac };
            } else {
                where = { id_inst: 0 };
            }

            if (!params) {
                return res.status(400).json({ message: 'parametros não informados.' });
            }

            const retorno = await InstallRegsService.upsert(params, where);
            if (!retorno) {
                return res.status(400).json({ message: 'Erro ao cadastrar.' });
            }
            return res.status(201).json({ message: "Registro de instalação foi salvo.", retorno });
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    // Obter todas as datas
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const datas = await InstallRegsService.getAll();
            return res.status(200).json(datas);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar datas', error });
        }
    }

    public async get(req: Request, res: Response): Promise<Response> {
        try {
            const where = req.params;

            if (!where) {
                return res.status(200).json({ message: 'Parametros para pesquisa não foram informados.' });
            }

            let data = await InstallRegsService.getSomeOne(where);
            if (!data) {
                return res.status(404).json({ message: 'Nenhum registro encontrada.' });
            }

            //verificar se cliente está expirado
            if (new Date(data.data_expiracao) < new Date()) {
                data.status = 'EXPIRADO';
            } else {
                data.status = 'ATIVO';
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar data', error });
        }
    }

    // Obter uma data por ID
    public async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const data = await InstallRegsService.getSomeOne({ id_data: id });
            if (!data) {
                return res.status(404).json({ message: 'Conta não encontrada.' });
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar data', error });
        }
    }

    //criar função para verificar se categoria existe
    public async ifExist(req: Request, res: Response): Promise<Response> {
        try {
            const where = req.body;
            const categoria = await InstallRegsService.getSomeOne(where);
            if (categoria) {
                return res.status(200).json({ exist: true, message: 'Já existe um usuário com esse email ou telefone.' });
            }


            return res.status(200).json({ exist: false });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    }


    // Atualizar uma data
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const params = req.body;
            const data = await InstallRegsService.update(params, { id_data: id });
            if (!data) {
                return res.status(404).json({ message: 'Conta não encontrada ou erro ao atualizar.' });
            }
            return res.status(200).json({ message: 'Conta atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar data', error });
        }
    }

    // Remover uma data
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await InstallRegsService.remove({ id_data: id });
            if (!result) {
                return res.status(404).json({ message: 'Conta não encontrada ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover data', error });
        }
    }

    // upload de arquivos
    public async upload(req: Request, res: Response) {

        if (!req.file) {
            return res.status(200).json({ message: 'Nenhum arquivo enviado.' });
        }

        let { id, fileDir } = req.body;

        //atualizar diretorio do arquivo no banco referenciando o id
        await InstallRegsService.update({ 'imagemDir': fileDir }, { id_inst: id });

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
            await InstallRegsService.update({ 'imagemDir': dirFile }, { id_inst: id });

            res.json({
                message: "Upload realizado com sucesso!",
                filePath: `/uploads/${dir}/${subdir}/${file.newFilename}`,
                id,
                dir,
                subdir
            });


        });
    }

}

export default new InstallRegsController();
