jms_app.controller('GamesController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'FileSetup', 'Dtables', 'Utils', 'Popup', function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, FileSetup, Dtables, Utils, Popup) {


  $scope.base_url = $("#baseUrl").val();
  $scope.api_url = $("#apiUrl").val();
  $scope.token = $("#token").val();
  $scope.port = $("#port").val();
  $scope.base = $scope.base_url
  $scope.Popup = Popup.modal = $ngConfirm
  $scope.http = Utils
  $scope.fileSetup = FileSetup
  $scope.mainRoute = 'games'
  $scope.relRoute = 'categorias'

  $scope.frmGame = {}
  $scope.gamesList = []
  $scope.categoriasList = []

  $scope.filePreview = null
  $scope.selectedItem = {}

  $scope.list = async (type) => {



    switch (type) {

      case 'list_categories':
        $scope.categoriasList = []
        $scope.categoriasList = await $scope.http.post({}, `${$scope.base_url}/${$scope.relRoute}/list`, $scope.token)
        break;
      default:
        $scope.gamesList = []
        $scope.gamesList = await $scope.http.post({}, `${$scope.base_url}/${$scope.mainRoute}/list`, $scope.token)
        break;

    }

  }

  $scope.acao = async (action, item) => {

    angular.extend($scope.selectedItem, item)

    //swicth
    switch (action) {
      case 'add':
        $scope.frmGame = {}
        //abrir modal com os dados (form)
        $("#frm_setup").modal('show')
        break;
      case 'edit':
        delete item.password
        angular.extend($scope.frmGame, item)
        //abrir modal com os dados (form)
        $("#frm_setup").modal('show')
        break;
      case 'upsert':
        await $scope.http.post($scope.frmGame, `${$scope.base_url}/${$scope.mainRoute}/setup`, $scope.token)
        await $scope.list()
        $("#frm_setup").modal('hide')
        break;
      case 'delete':
        let confirm = await Popup.confirm('Atenção!', 'Deseja realmente excluir este usuário e todos os dados relacionados ao mesmo?', 'Confirmar', 'red');
        if (confirm) {
          await $scope.http.post(item, `${$scope.base_url}/${$scope.mainRoute}/remove`, $scope.token)
          await $scope.list()
        }

        break;
      case 'upload':
        let { id_cat } = $scope.selectedItem
        let file = document.getElementById('file').files[0]
        //ativar loader

        //exibir modal de upload (informar a pasta e id para gerar subpasta no diretorio de destino do arquivo)
        let res = await $scope.fileSetup.upload(file, [{ id: id_cat, dir: 'categorias', subdir: `${id_cat}` }], `${$scope.base_url}/${$scope.mainRoute}/uploadXhr`, $scope.token)
        await $scope.list()
        //desatviar loader
        break;
      case 'uploaded':

        let exist = (item.imagemDir) ? true : false
        if (exist) {
          $scope.filePreview = `${$scope.base_url}${item.imagemDir}`
        }
        //exibir modal de upload
        $("#uploadModal").modal('show')
        break;
      default:
        break;
    }

    console.log(item)
  }

  $scope.uploadView = async () => {

    let file = document.getElementById('file').files[0]
    //pre visualizar arquivo do input file
    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function (e) {
      //pre visualizar arquivo do input file
      $scope.filePreview = e.target.result

    }


  }

  $scope.verifyExist = async (indice_, elamentId) => {

    let value = $(`#${indice_}`).val()
    let filter_ = { [indice_]: value }

    $(`#${elamentId}`).html('')
    const response = await $scope.http.post(filter_, `${$scope.base_url}/${$scope.mainRoute}/verifyExist`, $scope.token)

    if (response?.exist) {

      $(`#${elamentId}`).html(`*${indice_} já existe.`)
      $(`#${elamentId}`).addClass('text-danger')

      //apagar mensagem apos 3 segundos
      setTimeout(() => {
        $(`#${elamentId}`).html('')
        $(`#${elamentId}`).removeClass('text-danger')
        $scope.frmGame[indice_] = ''
      }, 3000)

    } else {
      $(`#${elamentId}`).html('')
      $(`#${elamentId}`).removeClass('text-danger')
    }

  }


  //inits 
  $scope.list()
  $scope.list('list_categories')

}]);