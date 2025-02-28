import multer from 'multer';
import path from 'path';

// Configuração do armazenamento do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Diretório onde os arquivos serão salvos
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