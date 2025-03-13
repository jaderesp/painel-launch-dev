jms_app.controller('DashboardController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$filter', '$ngConfirm', 'Utils', 'Popup', 'Dtables', async function ($scope, $window, $http, $timeout, $interval, $location, $filter, $ngConfirm, Utils, Popup, Dtables) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = $scope.base_url
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.utils = Utils
    // $scope.fileSetup = FileSetup
    $scope.isLoggedId = $("#session").val();

    $scope.dashboard = {
        "header": {
            clients: 0,//clientes por revenda
            expiresNow: 0,//clientes espirando hoje
            expires: 0,
            newClients: 0 //novas instalações(clientes app), porem não ativadas
        }
    }


    $scope.initDashboardData = async () => {

        await new Promise(async (resolve, reject) => {

            let clients = await $scope.utils.post({}, `${$scope.base_url}/dashboard/totalClientsbyReseller`, $scope.token)
            let expiresNow = await $scope.utils.post({}, `${$scope.base_url}/dashboard/clientsExpiresByReseller`, $scope.token)
            let expires = await $scope.utils.post({}, `${$scope.base_url}/dashboard/totalExpiredClients`, $scope.token)

            resolve({
                clients: clients.qtde,
                expiresNow: expiresNow.qtde,
                expires: expires.qtde,
            })

        }).then(async (result) => {

            $scope.dashboard.header = result

        })

    }


    $scope.initDashboardData()

}])