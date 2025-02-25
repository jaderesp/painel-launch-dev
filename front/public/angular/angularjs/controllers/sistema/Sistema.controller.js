jms_app.controller('SistemaController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', 'Dtables', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup, Dtables) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`

    $scope.http = Utils
    $scope.frmLogin = {}
    $scope.Popup = Popup.modal = $ngConfirm

    //inicialize databales instance
    //const dtInit = await Dtables.gen(5, DTColumnBuilder, DTColumnDefBuilder)
    //angular.extend($scope, ...dtInit)

    $scope.dados = [
        { id: 1, nome: 'João', email: 'joao@example.com' },
        { id: 2, nome: 'Maria', email: 'maria@example.com' },
        { id: 3, nome: 'Pedro', email: 'pedro@example.com' }
    ];

    $scope.dados = []

    //verificar sessão se logado
    $scope.verifySession = async () => {

        let logged = await $scope.http.post(`${$scope.base}/verifySession`)
        console.log(logged)

        if (logged) {

            let { loggedIn } = logged

            if (!loggedIn) {
                //redirecionar para tela de login                
                let redir = await Popup.confirm('Atenção!', 'Desculpe, sessão de login expirada, redirecionando para login.', 'OK', 'red', '/usuarios/login');

                if (redir === false) {
                    $window.location.href = '/admin/usuarios/login'
                }

                return false
            } else {
                return true
            }

        } else {
            return true
        }

    }

    //verificar se logado a cada  x minutos
    let time_ = 1000
    let exec = 0
    $interval(function () {

        $scope.verifySession()

        if (exec == 0) {
            time_ = 1000 * 60 * 1
            exec = 1
        }

    }, time_)



}]);