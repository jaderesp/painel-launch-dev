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
        //{ title: 'User', value: 'user' },
        { title: 'Revendedor', value: 'Reseller' },
    ]

    $scope.opcoesStatus = [
        { title: 'Ativo', value: 'ATIVO' },
        //{ title: 'User', value: 'user' },
        { title: 'Expirado', value: 'EXPIRADO' },
        { title: 'Inativo', value: 'INATIVO' }
    ]


    $scope.list = async () => {

        $scope.$applyAsync(async () => {

            $scope.usuariosList = []

            $scope.usuariosList = await $scope.http.post($http, $scope, {}, `${$scope.base_url}/usuarios/list`, $scope.token)

        })
        $.apply()
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
                //tratar data
                if (item.data_expiracao) {
                    item.data_expiracao = item.data_expiracao ? moment(item.data_expiracao).format('YYYY-MM-DDThh:mm') : ''
                    item.data_instalacao = item.data_instalacao ? moment(item.data_instalacao).format('YYYY-MM-DDThh:mm') : ''
                }
                angular.extend($scope.frmUsuario, item)
                //abrir modal com os dados (form)
                $("#frm_setup").modal('show')
                break;
            case 'upsert':
                await $scope.http.post($http, $scope, $scope.frmUsuario, `${$scope.base_url}/usuario/setup`, $scope.token)
                await $scope.list()
                $("#frm_setup").modal('hide')
                break;
            case 'update':
                let retorno = await $scope.http.post($http, $scope, $scope.frmUsuario, `${$scope.base_url}/usuario/update`, $scope.token)

                if (retorno) {
                    await Popup.confirm('Successo!', 'OS dados foram salvos.', 'OK', 'green');
                } else {
                    await Popup.confirm('Atenção!', 'Desculpe, Ocorreu um erro realizar a operação.', 'Entendido', 'red');
                }

                await $scope.getSomeOne()
                $("#frm_setup").modal('hide')
                break;
            case 'delete':
                let confirm = await Popup.confirm('Atenção!', 'Deseja realmente excluir este usuário e todos os dados relacionados ao mesmo?', 'Confirmar', 'red');
                if (confirm) {
                    await $scope.http.post($http, $scope, item, `${$scope.base_url}/usuarios/remove`, $scope.token)
                    await $scope.list()
                }

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
        const response = await $scope.http.post($http, $scope, filter_, `${$scope.base_url}/usuario/verifyExist`, $scope.token)

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