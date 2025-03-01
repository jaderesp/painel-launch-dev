import { Request, Response } from 'express';
import CategoriasService from '../services/CategoriasService';
import formidable, { IncomingForm } from "formidable";
import path from "path";
import fs from "fs-extra";

class CategoriasController {
    // Criar uma nova conta
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.body;
            const conta = await CategoriasService.add(params);
            if (!conta) {
                return res.status(400).json({ message: 'Erro ao criar conta.' });
            }
            return res.status(201).json(conta);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { id_cat } = req.body;
            const params = req.body;
            let where;

            if (id_cat) {
                where = { id_cat };
            }

            if (!params) {
                return res.status(400).json({ message: 'parametros não informados.' });
            }

            const retorno = await CategoriasService.upsert(params, where);
            if (!retorno) {
                return res.status(400).json({ message: 'Erro ao cadastrar.' });
            }
            return res.status(201).json(retorno);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor', error });
        }
    }

    // Obter todas as contas
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const contas = await CategoriasService.getAll();
            return res.status(200).json(contas);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar contas', error });
        }
    }

    // Obter uma conta por ID
    public async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const conta = await CategoriasService.getSomeOne({ id_conta: id });
            if (!conta) {
                return res.status(404).json({ message: 'Conta não encontrada.' });
            }
            return res.status(200).json(conta);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar conta', error });
        }
    }

    //criar função para verificar se categoria existe
    public async ifExist(req: Request, res: Response): Promise<Response> {
        try {
            const where = req.body;
            const categoria = await CategoriasService.getSomeOne(where);
            if (categoria) {
                return res.status(200).json({ exist: true, message: 'Já existe um usuário com esse email ou telefone.' });
            }


            return res.status(200).json({ exist: false });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuário', error });
        }
    }


    // Atualizar uma conta
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const params = req.body;
            const conta = await CategoriasService.update(params, { id_conta: id });
            if (!conta) {
                return res.status(404).json({ message: 'Conta não encontrada ou erro ao atualizar.' });
            }
            return res.status(200).json({ message: 'Conta atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar conta', error });
        }
    }

    // Remover uma conta
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await CategoriasService.remove({ id_conta: id });
            if (!result) {
                return res.status(404).json({ message: 'Conta não encontrada ou erro ao remover.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao remover conta', error });
        }
    }

    // upload de arquivos
    public async upload(req: Request, res: Response) {

        if (!req.file) {
            return res.status(200).json({ message: 'Nenhum arquivo enviado.' });
        }

        let { id, fileDir } = req.body;

        //atualizar diretorio do arquivo no banco referenciando o id
        await CategoriasService.update({ 'imagemDir': fileDir }, { id_cat: id });

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
            await CategoriasService.update({ 'imagemDir': dirFile }, { id_cat: id });

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

export default new CategoriasController();
