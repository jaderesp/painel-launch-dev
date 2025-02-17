jms_app.controller('LoginController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'Utils', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, Utils) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`

    $scope.http = Utils
    $scope.frmLogin = {}

    $scope.login = async () => {

        $scope.http.post($scope.frmLogin, `${$scope.base}/usuarios/login`).then(async (retorno) => {

            console.log("Retorno login:", retorno)

            if (retorno) {
                //redirecionar para dashboard
                $location.path('/dashboard')
                return;
            }

        })

    }

}]);