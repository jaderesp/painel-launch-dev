jms_app.controller('SistemaController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$filter', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', async function ($scope, $window, $http, $timeout, $interval, $location, $filter, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
    /* 
        - verificação de conexão do api (se servidor ativo ou inativo)
        - verificar status e notificações das sessões
    */
    $scope.base_url = $("#baseUrl").val() + "/";
    $scope.api_url = $("#apiUrl").val();
    $scope.ownerId = $('#ownerID_sis').val();




}]);