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
            resellers: 0,//clientes por revenda
            totalClients: 0,//clientes espirando hoje
            expiresResellers: 0,
            newClients: 0 //novas instalações(clientes app), porem não ativadas
        }
    }


    $scope.initDashboardData = async () => {

        await new Promise(async (resolve, reject) => {

            let resellers = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/dashboard/totalResellersActive`, $scope.token)
            let totalClients = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/dashboard/totalClients`, $scope.token)
            let expiresResellers = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/dashboard/totalExpiredResellers`, $scope.token)
            let newClients = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/dashboard/totalNewClients`, $scope.token)

            resolve({
                resellers: resellers.qtde,
                totalClients: totalClients.qtde,
                newClients: newClients.qtde,
                expiresResellers: expiresResellers.qtde,
            })

        }).then(async (result) => {

            $scope.dashboard.header = result

        })

    }


    $scope.initDashboardData()

}])