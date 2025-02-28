const fs = require('fs');
const path = require('path');

// Pegando argumentos do comando (controller, factories e caminho)
const args = process.argv.slice(2);
const controllerName = args[0];
const factories = args.slice(1).filter(arg => !arg.startsWith('--path=')); // Filtra as factories
const subfolderArg = args.find(arg => arg.startsWith('--path='));
const subfolder = subfolderArg ? subfolderArg.replace('--path=', '') : '';

// Verificar se o nome do controller foi fornecido
if (!controllerName) {
  console.error('❌ Erro: Você deve fornecer um nome para o controller.');
  console.log('Exemplo de uso: npm run generate:controller Cliente FileUploadFactory AuthFactory --path=admin/categorias');
  process.exit(1);
}

// Caminho final do controller (suporta múltiplos diretórios)
const controllersBasePath = path.join(__dirname, '../public/angular/angularjs/controllers');
const controllerPath = subfolder ? path.join(controllersBasePath, ...subfolder.split('/')) : controllersBasePath;

// Criar injeção de dependências dinamicamente
const factoryParams = factories.map(factory => `'${factory}'`).join(', ');
const factoryArguments = factories.join(', ');



// Criar o template do controller
const controllerTemplate = `angular.module('jms_app')
  .controller('${controllerName}Controller', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', ${factoryParams}, function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, ${factoryArguments}) {
    
   $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = $scope.base_url
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.http = Utils

    $scope.frm = {}
    $scope.list = []
    
    $scope.message = 'Controller ${controllerName} pronto para uso!';

    // Exemplo de uso das factories
    ${factories.map(factory =>
  `if (${factory}) console.log('${factory} disponível para uso!');`
).join('\n    ')}

  }]);`;

// Criar diretório se não existir
if (!fs.existsSync(controllerPath)) {
  fs.mkdirSync(controllerPath, { recursive: true });
}

// Criar o arquivo do controller
const filePath = path.join(controllerPath, `${controllerName.toLowerCase()}.controller.js`);
fs.writeFileSync(filePath, controllerTemplate);

console.log(`✅ Controller "${controllerName}" criado com sucesso em: ${filePath}`);
console.log(`🔗 Factories adicionadas: ${factories.length > 0 ? factories.join(', ') : 'Nenhuma'}`);
console.log(`📂 Salvo na pasta: ${subfolder || 'controllers (raiz)'}`);

