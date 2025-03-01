import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

// Middleware para processar FormData antes do Multer
export const processFormData = multer().none(); // Nenhum arquivo é processado aqui, apenas os campos do `FormData`

// Configuração do armazenamento do Multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        let { dir, subdir } = req.body;
        //validar se o diretório existe
        if (!dir) {
            return cb(new Error('Diretorio principal do arquivo não fornecido!'), '');
        }
        //subpasta
        if (!subdir) {
            return cb(new Error('Subdiretorio não fornecido!'), '');
        }

        const uploadPath = path.join(__dirname, `../../public/uploads/${dir}/${subdir}`);

        // Criar diretório dinamicamente se não existir
        await fs.ensureDir(uploadPath);

        cb(null, uploadPath);

        //passar diretorio para o controller
        req.body.fileDir = uploadPath;
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// Configuração do upload com limite de tamanho
const upload = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
});

export default upload;