



class Utils {

    constructor() {

        this.base_url = $("#baseUrl").val() + "/";
        this.api_url = $("#apiUrl").val();

    }

    /* add item no banco e retornar format html com id do banco nas funções */
    async post(params, rota) {

        return new Promise(async (resolve, reject) => {

            if (!rota) {
                console.log("\r\n Informar a rota para chamada: ");
                resolve(false)
                return;
            }

            if (params) {


                console.log("\r\n Parametros para o post: ", params);

                try {

                    const response = await axios.post(`${rota}`, params);
                    const retorno = response.data.retorno;

                    console.log(`\r\n requisção post realizada.`, retorno);
                    resolve(retorno);
                    return;

                } catch (errors) {
                    console.log("Ocorreu um erro ao tentar atualizar a intent: ", errors);

                    resolve(false);
                    return;
                }

            } else {

                console.log("\r\n Por favor informe parametros para requisição post.");
                resolve(false);

            }

        });
    }


}