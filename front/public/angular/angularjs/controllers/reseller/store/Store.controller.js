jms_app.controller('StoreController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = $scope.base_url
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.utils = Utils
    $scope.fileSetup = FileSetup
    $scope.isLoggedId = $("#session").val();

    $scope.frmStore = {}

    $scope.storeList = []

    $scope.opcoes = [
        // { title: 'Revendedor', value: 'Reseller' },
    ]

    $scope.list = async () => {

        $scope.storeList = []
        $scope.storeList = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/store/list`, $scope.token)

        $.apply();
    }


    $scope.acao = async (action, item) => {

        //swicth
        switch (action) {
            case 'add':
                $scope.frmStore = {}
                //abrir modal com os dados (form)
                $("#frm_setup").modal('show')
                break;
            case 'edit':
                angular.extend($scope.frmStore, item)
                //abrir modal com os dados (form)
                $("#frm_setup").modal('show')
                break;
            case 'upsert':
                await $scope.utils.post($http, $scope, $scope.frmStore, `${$scope.base_url}/store/setup`, $scope.token)
                await $scope.list()
                $("#frm_setup").modal('hide')
                break;
            default:
                break;
        }

        console.log(item)
    }

    $scope.verifyExist = async (indice_, elamentId) => {

        let value = $(`#${indice_}`).val()
        let filter_ = { [indice_]: value }

        $(`#${elamentId}`).html('')
        const response = await $scope.http.post(filter_, `${$scope.base_url}/store/verifyExist`, $scope.token)

        if (response?.exist) {

            $(`#${elamentId}`).html(`*${indice_} já existe.`)
            $(`#${elamentId}`).addClass('text-danger')

            //apagar mensagem apos 3 segundos
            setTimeout(() => {
                $(`#${elamentId}`).html('')
                $(`#${elamentId}`).removeClass('text-danger')
                $scope.frmStore[indice_] = ''
            }, 3000)

        } else {
            $(`#${elamentId}`).html('')
            $(`#${elamentId}`).removeClass('text-danger')
        }

    }


    //inits 
    $scope.list()

}])