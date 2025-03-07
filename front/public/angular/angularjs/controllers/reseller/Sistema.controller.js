jms_app.controller('SistemaController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', 'Dtables', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup, Dtables) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`

    $scope.http = Utils
    $scope.frmLogin = {}
    $scope.Popup = Popup.modal = $ngConfirm

    //inicialize databales instance
    //const dtInit = await Dtables.gen(5, DTColumnBuilder, DTColumnDefBuilder)
    //angular.extend($scope, ...dtInit)

    $scope.dados = []

    //verificar sessão se logado
    $scope.setupSession = async (logoff = false) => {

        let route = logoff ? 'logoff' : 'verifySession'

        let logged = await $scope.http.post({}, `${$scope.base}/${route}`, $scope.token)
        console.log(logged)

        if (logged) {

            let { loggedIn } = logged

            if (!loggedIn) {

                let message = logoff ? 'Sessão encerrada com sucesso.' : 'Desculpe, sessão de login expirada, redirecionando para login.'

                //redirecionar para tela de login                
                Popup.confirm('Atenção!', `${message}`, 'OK', 'red', '/usuarios/login');

                $timeout(function () {

                    $window.location.href = '/'

                }, 5000)


                return false
            } else {
                return true
            }

        } else {
            return true
        }

    }

    //verificar se logado a cada  x minutos
    let time_ = 10000
    let exec = 0
    $interval(function () {

        $scope.setupSession()

        if (exec == 0) {
            time_ = 1000 * 60 * 1
            exec = 1
        }

    }, time_)



}]);