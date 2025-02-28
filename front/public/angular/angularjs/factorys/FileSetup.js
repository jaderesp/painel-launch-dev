class FileSetup {

    constructor() {

    }

    /* add item no banco e retornar format html com id do banco nas funções */
    async upload(file, route, token) {

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