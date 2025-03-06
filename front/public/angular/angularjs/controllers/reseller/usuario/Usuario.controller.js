jms_app.controller('UsuarioController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.http = Utils
    $scope.isLoggedId = $("#session").val();

    $scope.frmUsuario = {}

    $scope.opcoes = [
        { title: 'Revendedor', value: 'Reseller' },
    ]

    $scope.getSomeOne = async () => {

        let id = $scope.isLoggedId

        $scope.frmUsuario = []
        $scope.frmUsuario = await $scope.http.post({ id }, `${$scope.base_url}/usuario/getById`, $scope.token)
        $scope.frmUsuario.password = ''

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
                delete item.password
                angular.extend($scope.frmUsuario, item)
                //abrir modal com os dados (form)
                $("#frm_setup").modal('show')
                break;
            case 'update':
                await $scope.http.post($scope.frmUsuario, `${$scope.base_url}/usuario/update`, $scope.token)
                await $scope.getSomeOne()
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
    $scope.getSomeOne()

}])