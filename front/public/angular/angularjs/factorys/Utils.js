



class Utils {

    constructor() {

        this.base_url = $("#baseUrl").val() + "/";
        this.api_url = $("#apiUrl").val();

    }

    async post($http, $scope, params, rota, token = null, loader = false) {
        return new Promise(async (resolve, reject) => {
            let header = {};

            if (!rota) {
                console.log("\r\n Informar a rota para chamada: ");
                resolve(false);
                return;
            }

            if (token) {
                header = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
            }

            if (params) {
                loader ? this.loader('start', 'loader', 'data-loader') : null;
                console.log("\r\n Parametros para o post: ", params);

                try {



                    const response = await $http.post(rota, params, header);
                    const retorno = response.data;

                    console.log(`\r\n Requisição POST realizada.`, retorno);
                    this.loader('stop', 'loader', 'data-loader');


                    resolve(retorno);


                } catch (errors) {
                    console.log("Ocorreu um erro ao tentar atualizar a intent: ", errors);
                    loader ? this.loader('stop', 'loader', 'data-loader') : null;
                    resolve(false);
                    return;
                }

            } else {
                console.log("\r\n Por favor informe parâmetros para requisição POST.");
                resolve(false);
            }
        });
    }

    /* add item no banco e retornar format html com id do banco nas funções */
    async postAx(params, rota, token = null, loder = false) {

        /* 
            possivel problema, pode ocorrer atraso na exibição dos dados no component, 
            pois o motor do angularjs demora pra detectar as mudanças no doom
        */

        return new Promise(async (resolve, reject) => {

            let header = null

            if (!rota) {
                console.log("\r\n Informar a rota para chamada: ");
                resolve(false)
                return;
            }

            if (token) {
                header = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }

            if (params) {


                loder ? this.loader('start', 'loader', 'data-loader') : null;
                console.log("\r\n Parametros para o post: ", params);

                try {


                    const response = await axios.post(`${rota}`, params, header);

                    const retorno = response.data;

                    console.log(`\r\n requisção post realizada.`, retorno);
                    this.loader('stop', 'loader', 'data-loader')
                    resolve(retorno);
                    return;

                } catch (errors) {
                    console.log("Ocorreu um erro ao tentar atualizar a intent: ", errors);
                    loder ? this.loader('stop', 'loader', 'data-loader') : null;
                    resolve(false);
                    return;
                }

            } else {

                console.log("\r\n Por favor informe parametros para requisição post.");
                resolve(false);

            }

        });
    }

    async loader(action, targetElId, dataElId, size = 30) {

        if (!targetElId) return;

        let component = `<div class="text-center" style="
            max-width: ${size}px;
            /* float: left; */
            text-align: center;
            margin: auto;
        "><img class="img-fluid fa-spin" src="../assets/images/customizer/2.png" alt="loading"></div>`;

        if (action === 'start') {
            angular.element(`#${targetElId}`).html(component);
            if (dataElId) {
                angular.element(`#${dataElId}`).hide();
            }
        } else if (action === 'stop') {
            angular.element(`#${targetElId}`).html('');
            if (dataElId) {
                angular.element(`#${dataElId}`).show();
            }
        }
    }



}