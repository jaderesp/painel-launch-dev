export const convertTimeToCron = (time: string): string | null => {
    const timeParts = time.split(":");

    if (timeParts.length !== 3) {
        console.error("Formato de hora inválido. Use HH:MM:SS no arquivo .env");
        return null;
    }

    const [hours, minutes] = timeParts.map((part) => parseInt(part, 10));

    if (
        isNaN(hours) || isNaN(minutes) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59
    ) {
        console.error("Hora ou minuto inválido. Certifique-se de que está entre 00:00:00 e 23:59:59.");
        return null;
    }

    return `${minutes} ${hours} * * *`;
};

export const convertMinutesToCron = (minutes: string): string | null => {
    const interval = parseInt(minutes, 10);

    if (isNaN(interval) || interval <= 0) {
        console.error("Intervalo de minutos inválido. Certifique-se de que seja um número maior que zero.");
        return null;
    }

    return `*/${interval} * * * *`; // Formato para rodar a cada X minutos
};
