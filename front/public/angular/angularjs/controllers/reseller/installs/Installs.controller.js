jms_app.controller('InstallsController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'FileSetup', 'Dtables', 'Utils', 'Popup', function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, FileSetup, Dtables, Utils, Popup) {


  $scope.base_url = $("#baseUrl").val();
  $scope.api_url = $("#apiUrl").val();
  $scope.token = $("#token").val();
  $scope.port = $("#port").val();
  $scope.base = $scope.base_url
  $scope.Popup = Popup.modal = $ngConfirm
  $scope.utils = Utils
  $scope.fileSetup = FileSetup
  $scope.mainRoute = 'install'
  $scope.relRoute = 'categorias'

  $scope.frmInstall = {}
  $scope.installsList = []
  $scope.categoriasList = []
  $scope.opcoes = [
    { 'value': 'ATIVO', 'titulo': 'Ativo' },
    { 'value': 'INATIVO', 'titulo': 'Inativo' },
    { 'value': 'EXPIRADO', 'titulo': 'Expirado' },
  ]

  $scope.filePreview = null
  $scope.selectedItem = {}
  $scope.startStop = false

  $scope.list = async (type) => {

    switch (type) {

      case 'list_categories':
        $scope.$applyAsync(async () => {
          $scope.categoriasList = []
          $scope.categoriasList = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/${$scope.relRoute}/list`, $scope.token)
        })
        break;
      default:
        $scope.$applyAsync(async () => {
          $scope.installsList = []
          $scope.installsList = await $scope.utils.post($http, $scope, {}, `${$scope.base_url}/${$scope.mainRoute}/list`, $scope.token, true)
        })
        break;

    }

  }

  $scope.acao = async (action, item, fieldUpload) => { //fieldUpload = campo do upload = tipo de arquivo do upload: room, video intro, etc

    angular.extend($scope.selectedItem, item)

    //swicth
    switch (action) {
      case 'add':
        $scope.frmInstall = {}
        //abrir modal com os dados (form)
        $("#frm_setup").modal('show')
        break;
      case 'edit':
        delete item.password
        item.data_expiracao = item.data_expiracao ? moment(item.data_expiracao).format('YYYY-MM-DDThh:mm') : ''
        item.data_instalacao = item.data_instalacao ? moment(item.data_instalacao).format('YYYY-MM-DDThh:mm') : ''
        angular.extend($scope.frmInstall, item)
        //abrir modal com os dados (form)
        $("#frm_setup").modal('show')
        break;
      case 'upsert':
        await $scope.utils.post($http, $scope, $scope.frmInstall, `${$scope.base_url}/${$scope.mainRoute}/setup`, $scope.token)
        await $scope.list()
        $("#frm_setup").modal('hide')
        break;
      case 'delete':

        let confirm = await Popup.confirm('Atenção!', 'Deseja realmente excluir este usuário e todos os dados relacionados ao mesmo?', 'Confirmar', 'red');
        if (confirm) {
          await $scope.utils.post($http, $scope, item, `${$scope.base_url}/${$scope.mainRoute}/remove`, $scope.token)
          await $scope.list()
        }

        break;
      case 'upload':
        let { id_game } = $scope.selectedItem
        let file = document.getElementById('file').files[0]
        //ativar loader
        $scope.utils.loader('start', 'loaderUpload', 'loadertagetUp', 15)
        //exibir modal de upload (informar a pasta e id para gerar subpasta no diretorio de destino do arquivo)
        let res = await $scope.fileSetup.upload(file, [{ id: id_game, dir: 'games', subdir: `${id_game}`, fieldtable: `${$scope.selectFieldUpload}` }], `${$scope.base_url}/${$scope.mainRoute}/uploadXhr`, $scope.token)
        $scope.utils.loader('stop', 'loaderUpload', 'loadertagetUp')
        await $scope.list()
        //desatviar loader
        break;
      default:
        break;
    }

    console.log(item)
  }

  $scope.setupEmuRoom = async () => {


    if (!$scope.startStop) {
      executeEMU(`${$scope.base_url}${$scope.selectFileDir}`)
      $scope.startStop = true
    } else {
      stopEmulator()
      $scope.startStop = false
    }

  }


  $scope.verifyExist = async (indice_, elamentId) => {

    let value = $(`#${indice_}`).val()
    let filter_ = { [indice_]: value }

    $(`#${elamentId}`).html('')
    const response = await $scope.utils.post($http, $scope, filter_, `${$scope.base_url}/${$scope.mainRoute}/verifyExist`, $scope.token)

    if (response?.exist) {

      $(`#${elamentId}`).html(`*${indice_} já existe.`)
      $(`#${elamentId}`).addClass('text-danger')

      //apagar mensagem apos 3 segundos
      setTimeout(() => {
        $(`#${elamentId}`).html('')
        $(`#${elamentId}`).removeClass('text-danger')
        $scope.frmInstall[indice_] = ''
      }, 3000)

    } else {
      $(`#${elamentId}`).html('')
      $(`#${elamentId}`).removeClass('text-danger')
    }

  }

  //inits 
  $scope.list()
  //$scope.list('list_categories')

}]);