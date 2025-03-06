jms_app.controller('GamesController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'FileSetup', 'Dtables', 'Utils', 'Popup', function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, FileSetup, Dtables, Utils, Popup) {


  $scope.base_url = $("#baseUrl").val();
  $scope.api_url = $("#apiUrl").val();
  $scope.token = $("#token").val();
  $scope.port = $("#port").val();
  $scope.base = $scope.base_url
  $scope.Popup = Popup.modal = $ngConfirm
  $scope.utils = Utils
  $scope.fileSetup = FileSetup
  $scope.mainRoute = 'games'
  $scope.relRoute = 'categorias'

  $scope.frmGame = {}
  $scope.gamesList = []
  $scope.categoriasList = []

  $scope.filePreview = null
  $scope.selectedItem = {}
  $scope.startStop = false

  $scope.selectFieldUpload = '' //campo do bd para upload
  $scope.selectFileDir = '' //dir/url do arquivo do cadastro selecionado
  $scope.extIsVisible = {} //informa se o arquivo de upload é visualizavel e tipo de arquuivo para identificar player ou tag de visualização

  $scope.list = async (type) => {

    switch (type) {

      case 'list_categories':
        $scope.categoriasList = []
        $scope.categoriasList = await $scope.utils.post({}, `${$scope.base_url}/${$scope.relRoute}/list`, $scope.token)
        break;
      default:
        $scope.gamesList = []
        $scope.gamesList = await $scope.utils.post({}, `${$scope.base_url}/${$scope.mainRoute}/list`, $scope.token)
        break;

    }

  }

  $scope.acao = async (action, item, fieldUpload) => { //fieldUpload = campo do upload = tipo de arquivo do upload: room, video intro, etc

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
        await $scope.utils.post($scope.frmGame, `${$scope.base_url}/${$scope.mainRoute}/setup`, $scope.token)
        await $scope.list()
        $("#frm_setup").modal('hide')
        break;
      case 'delete':

        let confirm = await Popup.confirm('Atenção!', 'Deseja realmente excluir este usuário e todos os dados relacionados ao mesmo?', 'Confirmar', 'red');
        if (confirm) {
          await $scope.utils.post(item, `${$scope.base_url}/${$scope.mainRoute}/remove`, $scope.token)
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
      case 'uploaded': //pre-visualizar arquivo upado (dir)
        //fieldUpload = nome do campo no bd
        $scope.filePreview = ''
        let exist = (item[fieldUpload]) ? true : false
        $scope.selectFileDir = item[fieldUpload]

        $scope.selectFieldUpload = fieldUpload

        if (exist) {
          $scope.filePreview = `${$scope.base_url}${item[fieldUpload]}`
          $scope.extIsVisible = await $scope.extForPreview(item[fieldUpload])
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

    if (!file) {
      return console.log('Selecione um arquivo para visualizar')
    }

    $scope.extIsVisible = await $scope.extForPreview(file.name)

    //pre visualizar arquivo do input file
    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function (e) {
      //pre visualizar arquivo do input file
      $scope.filePreview = e.target.result

    }


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

  //identificar a extenção do arquivo para pre-visualização
  $scope.extForPreview = (fileInfo) => {

    return new Promise(async (resolve, reject) => {

      if (!fileInfo) return

      let exts = [
        { ext: 'mp4', type: 'video' },
        { ext: 'jpg', type: 'image' },
        { ext: 'png', type: 'image' },
        { ext: 'jpeg', type: 'image' },
        { ext: 'gif', type: 'image' },
        { ext: 'bmp', type: 'image' },
        { ext: 'svg', type: 'image' },
        { ext: 'webp', type: 'image' },
        { ext: 'mp3', type: 'audio' },
      ] //arquivos que podem ser visualizados no modal de visualização

      resolve(exts.filter(ext => ext.ext === fileInfo.split('.')[1])[0])

    })
  }

  $scope.verifyExist = async (indice_, elamentId) => {

    let value = $(`#${indice_}`).val()
    let filter_ = { [indice_]: value }

    $(`#${elamentId}`).html('')
    const response = await $scope.utils.post(filter_, `${$scope.base_url}/${$scope.mainRoute}/verifyExist`, $scope.token)

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