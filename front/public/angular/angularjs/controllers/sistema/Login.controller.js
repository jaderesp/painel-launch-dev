jms_app.controller('LoginController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`

    $scope.http = Utils
    $scope.frmLogin = {}
    $scope.Popup = Popup.modal = $ngConfirm

    $scope.login = async () => {

        $scope.http.post($scope.frmLogin, `${$scope.base}/usuarios/login`).then(async (retorno) => {

            console.log("Retorno login:", retorno)

            if (retorno) {
                //redirecionar para dashboard
                //$location.path('/dashboard')
                $window.location.href = '/dashboard'
                return;
            } else {

                Popup.confirm('Atenção!', 'Desculpe, usuário ou senha inválidos, verifique.', 'OK', 'red');

            }

        })

    }

    //verificar sessão se logado
    $scope.verifySession = async () => {

        let logged = await $scope.http.post(`${$scope.base}/verifySession`)
        console.log(logged)

        if (logged) {

            let { loggedIn } = logged

            if (!loggedIn) {
                //redirecionar para tela de login                
                Popup.confirm('Atenção!', 'Desculpe, sessão de login expirada, redirecionando para login.', 'OK', 'red', '/usuarios/login');
                return false
            } else {
                return true
            }

        } else {
            return true
        }

    }

    //verificar se logado a cada  x minutos
    $interval(function () {
        //$scope.verifySession()
    }, 1000 * 60 * 1)

}]);