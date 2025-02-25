class Popup {

    constructor(modal_) {

        this.base_url = $("#baseUrl").val() + "/";
        this.api_url = $("#apiUrl").val();
        this.modal = modal_

    }

    /* add item no banco e retornar format html com id do banco nas funções */
    async confirm(titulo, msg, btnTitle, cor) {

        return new Promise(async (resolve, reject) => {

            /* alert */
            this.modal({
                title: titulo,
                content: msg,
                type: cor,
                typeAnimated: true,
                buttons: {
                    tryAgain: {
                        text: btnTitle,
                        btnClass: 'btn-green',
                        action: function () {
                            resolve(true)
                        }
                    },
                    Fechar: {
                        text: 'Fechar',
                        action: function (scope, button) {
                            resolve(false)
                        }
                    }
                }
            });


        })


    }

}