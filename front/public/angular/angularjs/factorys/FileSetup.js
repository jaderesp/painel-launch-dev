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

            if (!route) {
                console.log("\r\n Informar a rota para chamada: ");
                resolve(false)
                return;
            }

            if (token) {
                header = undefined
                header = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            }

            const formData = new FormData();
            formData.append('file', file);

            // Adicionar os dados extras ao FormData com os nomes corretos das chaves e valores
            Object.keys(inputsData).forEach(key => {
                const value = inputsData[key]; // Obtém o valor correspondente à chave
                console.log(`Adicionando ao FormData -> Índice: ${key} | Valor: ${value}`);
                if (value['dir']) {
                    formData.append('dir', value['dir']); // Usa key como nome do índice e value como valor
                }

                if (value['subdir']) {
                    formData.append('subdir', value['subdir']); // Usa key como nome do índice e value como valor
                }
            });

            axios.post(route, formData, header, {
                onUploadProgress: progressEvent => {
                    console.log('upload progress: ' + Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%')
                }
            })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {

                    console.log(error.response ? error.response.data : error.message)
                });
        });
    }
}