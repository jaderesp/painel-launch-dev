// Definindo Rotas
jms_app.config(function ($routeProvider) {
  $routeProvider
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'controllers/client/DashboardController'
    })
    .otherwise({
      redirectTo: '/clientes'
    })
});