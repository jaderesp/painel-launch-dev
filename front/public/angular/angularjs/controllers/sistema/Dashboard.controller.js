jms_app.controller('DashboardController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$filter', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $filter, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`

    $scope.http = Utils
    $scope.frmLogin = {}
    $scope.Popup = Popup.modal = $ngConfirm



}])