import { CronJob } from "cron";
import dotenv from "dotenv";
import { Op } from "sequelize";
import { InstallRegsModel } from "../models/InstallRegsModel"; // Ajuste conforme necessário
import { convertTimeToCron, convertMinutesToCron } from "../controllers/utils/cronHelper"; // Importa funções utilitárias
import { UsuarioModel } from '../models/UsuarioModel';
// Carrega variáveis do .env
dotenv.config();

// Obtém os valores do .env
const EXECUTION_TIME = process.env.EXECUTION_TIME || "";
const EXECUTION_INTERVAL = process.env.EXECUTION_INTERVAL || "";
const TIMEZONE = process.env.TIMEZONE || "America/Sao_Paulo";

// Define a expressão do cron com base na configuração do .env
let CRON_SCHEDULE: string | null = null;

if (EXECUTION_INTERVAL) {
    CRON_SCHEDULE = convertMinutesToCron(EXECUTION_INTERVAL);
} else if (EXECUTION_TIME) {
    CRON_SCHEDULE = convertTimeToCron(EXECUTION_TIME);
}

if (!CRON_SCHEDULE) {
    console.error("Nenhuma configuração válida encontrada para o job. Verifique o .env.");
    process.exit(1);
}

// Função que verifica e atualiza registros expirados ou ativos
const checkExpirations = async (): Promise<void> => {
    try {
        const now = new Date();

        // Atualiza os registros para "EXPIRADO" se a data de expiração já foi atingida
        const [expiredCount] = await InstallRegsModel.update(
            { status: "EXPIRADO" },
            {
                where: {
                    data_expiracao: { [Op.lt]: now },
                    status: { [Op.not]: "EXPIRADO" },
                },
            }
        );

        // Atualiza os registros para "ATIVO" se a data de expiração ainda não foi atingida
        const [activeCount] = await InstallRegsModel.update(
            { status: "ATIVO" },
            {
                where: {
                    data_expiracao: { [Op.gt]: now },
                    status: { [Op.not]: "ATIVO" },
                },
            }
        );

        console.log(`👉🏻 ${expiredCount} registros atualizados para EXPIRADO.`);

        const [updatedCountUser] = await UsuarioModel.update(
            { status: "EXPIRADO" },
            {
                where: {
                    data_expiracao: { [Op.lt]: now },
                    status: { [Op.not]: "EXPIRADO" },
                    type_usuario: { [Op.like]: "Reseller" },
                },
            }
        );


        const [updatedCountUserActive] = await UsuarioModel.update(
            { status: "ATIVO" },
            {
                where: {
                    data_expiracao: { [Op.gt]: now },
                    status: { [Op.not]: "ATIVO" },
                    type_usuario: { [Op.like]: "Reseller" },
                },
            }
        );

        console.log(`👉🏻[${new Date().toISOString()}] Registros Clientes-Apps atualizados: ${expiredCount} expirados, ${activeCount} ativos. `);
        console.log(`👉🏻[${new Date().toISOString()}] Registros Revendas atualizados: ${updatedCountUser} expirados, ${updatedCountUserActive} ativos. `);
    } catch (error) {
        console.error("Erro ao atualizar registros:", error);
    }
};

// Criar a tarefa agendada com a configuração correta
const job = new CronJob(
    CRON_SCHEDULE, // Expressão do cron baseada no .env
    async () => {
        console.log(`Executando verificação de expiração... (${new Date().toLocaleTimeString()})`);
        await checkExpirations();
    },
    null, // Callback ao finalizar (não necessário)
    true, // Inicia automaticamente
    TIMEZONE // Configuração de fuso horário
);

console.log(`📌 Job de verificação agendado para: ${CRON_SCHEDULE} [${TIMEZONE}]`);

// Exportar a função para testes manuais
export { checkExpirations, job };



