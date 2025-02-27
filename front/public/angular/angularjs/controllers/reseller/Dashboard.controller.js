jms_app.controller('DashboardController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$filter', '$ngConfirm', 'Utils', 'Popup', 'Dtables', async function ($scope, $window, $http, $timeout, $interval, $location, $filter, $ngConfirm, Utils, Popup, Dtables) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`

    $scope.http = Utils
    $scope.frmLogin = {}
    $scope.Popup = Popup.modal = $ngConfirm


    let confirm = await Popup.confirm('Atenção!', 'moda esta funcionando.', 'OK', 'green', '/usuarios/login');

    if (confirm === false) {
        $window.location.href = '/usuarios/login'
    }

    $scope.acao = async (item) => {
        console.log(item)
    }

}])