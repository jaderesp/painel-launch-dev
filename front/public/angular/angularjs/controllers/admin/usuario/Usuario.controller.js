jms_app.controller('UsuarioController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.http = Utils

    $scope.frmUsuario = {}
    $scope.usuariosList = []

    $scope.opcoes = [
        { title: 'Admin', value: 'admin' },
        { title: 'User', value: 'user' },
        { title: 'Revendedor', value: 'Reseller' },
    ]


    $scope.list = async () => {

        $scope.usuariosList = []

        $scope.usuariosList = await $scope.http.post({}, `${$scope.base_url}/usuarios/list`, $scope.token)

    }

    $scope.acao = async (action, item) => {

        //swicth
        switch (action) {
            case 'add':
                $scope.frmUsuario = {}
                //abrir modal com os dados (form)
                $("#frm_setup").modal('show')
                break;
            case 'edit':
                angular.extend($scope.frmUsuario, item)
                //abrir modal com os dados (form)
                $("#frm_setup").modal('show')
                break;
            case 'upsert':
                await $scope.http.post($scope.frmUsuario, `${$scope.base_url}/usuario/setup`, $scope.token)
                await $scope.list()
                $("#frm_setup").modal('hide')
                break;
            case 'delete':
                await $scope.http.post(item, `${$scope.base_url}/usuarios/remove`, $scope.token)
                await $scope.list()
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
        const response = await $scope.http.post(filter_, `${$scope.base_url}/usuario/verifyExist`, $scope.token)

        if (response?.exist) {

            $(`#${elamentId}`).html(`*${indice_} já existe.`)
            $(`#${elamentId}`).addClass('text-danger')

            //apagar mensagem apos 3 segundos
            setTimeout(() => {
                $(`#${elamentId}`).html('')
                $(`#${elamentId}`).removeClass('text-danger')
                $scope.frmUsuario[indice_] = ''
            }, 3000)

        } else {
            $(`#${elamentId}`).html('')
            $(`#${elamentId}`).removeClass('text-danger')
        }

    }


    //inits 
    $scope.list()

}])