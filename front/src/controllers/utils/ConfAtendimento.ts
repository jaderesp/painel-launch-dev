import ConfiguracoesService from "../../services/ConfiguracoesService";

interface Config {
    idConf: number | null;
    id_conta: number;
    horai: string;     // Ex: "09:00"
    horaf: string;     // Ex: "18:00"
    dia_semana: string; // JSON string: ex: '["monday","tuesday","wednesday"]'
    msg_offline: string;
}

export async function getVerifyOfflineMessage(): Promise<string> {

    // Verificar se a configuração está vazia
    let config_ = await ConfiguracoesService.getAll()

    let config: any | null = config_.length > 0 ? config_[0] : null

    if (!config) {
        return ""
    }

    let { dia_semana, horai, horaf, msg_offline } = config
    // Converter dia_semana de string para array
    const diasAtendimento: string[] = JSON.parse(dia_semana);

    // Obter data/hora atual
    const now = new Date();

    // Obter dia da semana atual (0 = domingo, 1=segunda, ...)
    const diasSemanaIngles = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const diaAtual = diasSemanaIngles[now.getDay()];

    // Mapeamento dos dias da semana do inglês para o português
    const traducaoDias: Record<string, string> = {
        sunday: "Domingo",
        monday: "Segunda-feira",
        tuesday: "Terça-feira",
        wednesday: "Quarta-feira",
        thursday: "Quinta-feira",
        friday: "Sexta-feira",
        saturday: "Sábado"
    };

    // Extrair horas e minutos do horai e horaf
    const [startHour, startMinute] = config.horai.split(":").map(Number);
    const [endHour, endMinute] = config.horaf.split(":").map(Number);

    // Criar Date para horário inicial e final no dia atual
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

    // Verificar se o dia atual está no array de diasAtendimento
    const isDiaAtendimento = diasAtendimento.includes(diaAtual);

    // Verificar se o horário atual está dentro do intervalo
    const isHorarioAtendimento = now >= startTime && now <= endTime;

    if (isDiaAtendimento && isHorarioAtendimento) {
        // Estamos dentro do horário e dia de atendimento
        return "";
    } else {
        // Estamos fora do horário ou dia de atendimento.
        // Traduzir os dias armazenados no array diasAtendimento
        const diasFormatados = diasAtendimento
            .map(diaIng => traducaoDias[diaIng] || diaIng)
            .join(", ");

        const horarioFuncionamento = `\r\nNosso horário de funcionamento é nos dias: ${diasFormatados} das ${config.horai} às ${config.horaf}.`;
        return `${config.msg_offline} ${horarioFuncionamento}`;
    }
}


// Exemplo de uso:
/*const config: Config = {
    idConf: null,
    id_conta: 1,
    horai: "09:00",
    horaf: "18:00",
    dia_semana: '["monday","tuesday","wednesday","thursday","friday"]',
    msg_offline: "Estamos fora do horário de atendimento no momento."
};

const mensagem = getOfflineMessage(config);
console.log(mensagem); */
