jms_app.controller('ConfiguracoesController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.utils = Utils

    $scope.frmConfiguracoes = {}
    $scope.configuracoesList = []

    $scope.opcoes = [
        //{ title: 'Admin', value: 'admin' },       
    ]


    $scope.list = async () => {

        //ativar loader
        $scope.utils.loader('start', 'loader', 'loadertaget', 35)

        $scope.configuracoesList = []

        $scope.utils.post({}, `${$scope.base_url}/configuracoes/list`, $scope.token).then((data) => {
            //ativar loader
            $scope.utils.loader('stop', 'loader', 'loadertaget')
            $scope.configuracoesList = data
        })


    }

    $scope.acao = async (action, item) => {

        //swicth
        switch (action) {

            case 'update':

                let params = []
                let arr = $scope.configuracoesList
                //limpar o objcto
                for (var i = 0; i < arr.length; i++) {
                    let item = {}
                    angular.extend(item, arr[i])
                    angular.extend(item, arr[i])
                    params.push(item)
                }

                let retorno = await $scope.utils.post({ params }, `${$scope.base_url}/configuracoes/update`, $scope.token)

                if (retorno) {
                    await Popup.confirm('Successo!', 'OS dados de configurações foram salvos.', 'OK', 'green');
                } else {
                    await Popup.confirm('Atenção!', 'Desculpe, Ocorreu um erro realizar a operação.', 'Entendido', 'red');
                }

                await $scope.list()



                $("#frm_setup").modal('hide')
                break;
            default:
                break;
        }


    }


    //inits 
    $scope.list()

}])