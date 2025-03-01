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
                if (value['id']) {
                    formData.append('id', value['id']); // Usa key como nome do índice e value como valor
                }

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

    async uploadXhr(file, inputsData, route, token) {
        return new Promise(async (resolve, reject) => {
            try {

                let xhr = new XMLHttpRequest();
                let formData = new FormData();

                if (!file) {
                    console.error("Nenhum arquivo selecionado!");
                    resolve(false);
                    return;
                }

                formData.append('file', file);

                // Adicionar outros parâmetros ao FormData
                Object.keys(inputsData).forEach(key => {
                    const value = inputsData[key];
                    console.log(`Adicionando ao FormData -> Índice: ${key} | Valor: ${value}`);

                    if (value['dir']) {
                        formData.append('dir', value['dir']);
                    }
                    if (value['subdir']) {
                        formData.append('subdir', value['subdir']);
                    }
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        console.log(`📌 Status da Requisição: ${xhr.status}`);
                    }
                };

                xhr.timeout = 5000;
                xhr.open("POST", route, true);

                // ✅ Adicionar o Token Bearer corretamente no cabeçalho
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);

                /* Tratar retorno */
                xhr.responseType = 'json'; // Melhor usar JSON para resposta

                xhr.onload = async function () {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200) {
                            console.log("📌 Resposta da API:", xhr.response);
                            resolve(xhr.response);
                        } else {
                            console.error("❌ Erro no upload:", xhr.status, xhr.statusText);
                            resolve(false);
                        }
                    }
                };

                xhr.onerror = function () {
                    console.error("❌ Erro de rede durante o upload.");
                    resolve(false);
                };

                xhr.send(formData);
            } catch (error) {
                console.error("❌ Erro inesperado no upload:", error);
                resolve(false);
            }
        });
    }


}