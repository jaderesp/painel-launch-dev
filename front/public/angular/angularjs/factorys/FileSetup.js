class FileSetup {

    constructor() {

    }

    /* add item no banco e retornar format html com id do banco nas funções */
    async upload(file, inputsData, route, token) {

        return new Promise((resolve, reject) => {

            if (!file) {
                console.log('Nenhum arquivo selecionado.');
                resolve(false)
            }

            let header = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            if (!rota) {
                console.log("\r\n Informar a rota para chamada: ");
                resolve(false)
                return;
            }

            if (token) {
                header = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            }

            const formData = new FormData();
            formData.append('file', file);

            //adicionar indicer ao FormData dinamicamente
            for (const chave in inputsData) {

                if (inputsData.hasOwnProperty(chave)) {
                    console.log(`Índice: ${chave} | Valor: ${inputsData[chave]}`);
                    formData.append(`${chave}`, inputsData[chave]);
                }

            }

            axios.post(route, formData, header)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {

                    console.log(error.response ? error.response.data : error.message)
                });
        });
    }
}