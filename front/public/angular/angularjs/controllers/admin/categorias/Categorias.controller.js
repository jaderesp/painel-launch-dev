angular.module('jms_app')
  .controller('CategoriasController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'FileSetup', 'Dtables', 'Utils', 'Popup', function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, FileSetup, Dtables, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = $scope.base_url
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.http = Utils

    $scope.frm = {}
    $scope.list = []

    $scope.message = 'Controller Categorias pronto para uso!';

    // Exemplo de uso das factories
    if (FileSetup) console.log('FileSetup disponível para uso!');
    if (Dtables) console.log('Dtables disponível para uso!');
    if (Utils) console.log('Utils disponível para uso!');
    if (Popup) console.log('Popup disponível para uso!');

  }]);