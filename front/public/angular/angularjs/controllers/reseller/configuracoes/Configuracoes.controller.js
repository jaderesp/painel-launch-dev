jms_app.controller('ConfiguracoesController', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'Utils', 'Popup', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, Utils, Popup) {

    $scope.base_url = $("#baseUrl").val();
    $scope.api_url = $("#apiUrl").val();
    $scope.token = $("#token").val();
    $scope.port = $("#port").val();
    $scope.base = `${$scope.base_url}`
    $scope.Popup = Popup.modal = $ngConfirm
    $scope.utils = Utils

    $scope.frmConfiguracoes = {}
    $scope.configuracoesList = []


    $scope.selectinputsView = {
        logo: false,
        back: false,
        banner: false
    }

    $scope.frmDinamico = {
        img_logo: [{ url: '' }],
        img_back: [{ url: '' }],
        img_banner: [{ url: '' }]
    }



    $scope.list = async () => {

        //ativar loader
        $scope.utils.loader('start', 'loader', 'loadertaget', 35)

        $scope.configuracoesList = []

        $scope.utils.post({}, `${$scope.base_url}/configuracoes/list`, $scope.token).then(async (data) => {
            //ativar loader
            $scope.utils.loader('stop', 'loader', 'loadertaget')

            //converter dados de midias de string para JSon
            let arr = data
            //limpar o objcto
            for (var i = 0; i < arr.length; i++) {
                let item = {}

                //filtrar as configurações do tipo MIDIA
                if (arr[i].type == 'MIDIA') {

                    let midiasObj = {}
                    midiasObj = await $scope.parseer(arr[i], true) //string do json

                    if (midiasObj) {
                        arr[i] = { ...midiasObj }
                    }

                }
                // angular.extend(item, arr[i])
                // angular.extend(item, arr[i])
                // params.push(item)
            }

            $scope.configuracoesList = data
        })


    }

    $scope.acao = async (action, item, fieldUpload) => {

        //swicth
        switch (action) {

            case 'update':

                let params = []
                let arr = $scope.configuracoesList
                //limpar o objcto
                for (var i = 0; i < arr.length; i++) {
                    let item = {}

                    //filtrar as configurações do tipo MIDIA
                    if (arr[i].type == 'MIDIA') {

                        let midiasObj = {}
                        midiasObj = await $scope.parseer(arr[i], false)

                        if (midiasObj) {
                            arr[i] = { ...midiasObj }
                        }

                    }
                    // angular.extend(item, arr[i])
                    angular.extend(item, arr[i])
                    params.push(item)
                }

                let retorno = await $scope.utils.post({ params }, `${$scope.base_url}/configuracoes/update`, $scope.token)

                if (retorno) {
                    await Popup.confirm('Successo!', 'OS dados de configurações foram salvos.', 'OK', 'green');
                } else {
                    await Popup.confirm('Atenção!', 'Desculpe, Ocorreu um erro realizar a operação.', 'Entendido', 'red');
                }

                await $scope.list()

                $("#frm_setup").modal('hide')
                break;

            case 'upload':
                let { id_conf } = item
                let file = document.getElementById('file').files[0]
                //ativar loader
                $scope.utils.loader('start', 'loaderUpload', 'loadertagetUp', 15)
                //exibir modal de upload (informar a pasta e id para gerar subpasta no diretorio de destino do arquivo)
                let res = await $scope.fileSetup.upload(file, [{ id: id_conf, dir: 'configuracoes', subdir: `${id_conf}`, fieldtable: `${fieldUpload}` }], `${$scope.base_url}/${$scope.mainRoute}/uploadXhr`, $scope.token)
                $scope.utils.loader('stop', 'loaderUpload', 'loadertagetUp')
                await $scope.list()
                //desatviar loader
                break;
            default:
                break;
        }


    }


    //parseJson x JsonToStrignify Item
    $scope.parseer = async (item, json_ = false) => {

        return new Promise((resolve, reject) => {

            if (item) {
                if ('img_logo' in item) {

                    if ($scope.frmDinamico) {
                        //remover id do antularjs no objecto
                        if (!json_) {//converter para string
                            $scope.frmDinamico['img_logo'] = JSON.parse(angular.toJson($scope.frmDinamico['img_logo']))
                            item['img_logo'] = JSON.stringify($scope.frmDinamico['img_logo'])
                        } else { //converter para json

                            $scope.frmDinamico['img_logo'] = JSON.parse(item['img_logo'])

                        }
                    }

                }
                if ('img_back' in item) {
                    if ($scope.frmDinamico) {
                        //remover id do antularjs no objecto
                        if (!json_) {//converter para string
                            $scope.frmDinamico['img_back'] = JSON.parse(angular.toJson($scope.frmDinamico['img_back']))
                            item['img_back'] = JSON.stringify($scope.frmDinamico['img_back'])
                        } else { //converter para json

                            $scope.frmDinamico['img_back'] = JSON.parse(item['img_back'])

                        }
                    }
                }

                if ('img_banner' in item) {
                    if ($scope.frmDinamico) {
                        //remover id do antularjs no objecto
                        if (!json_) {//converter para string
                            $scope.frmDinamico['img_banner'] = JSON.parse(angular.toJson($scope.frmDinamico['img_banner']))
                            item['img_banner'] = JSON.stringify($scope.frmDinamico['img_banner'])
                        } else { //converter para json

                            $scope.frmDinamico['img_banner'] = JSON.parse(item['img_banner'])

                        }

                    }
                }

                resolve(item)

            } else {
                resolve(false)
            }



        })
    }


    //controle dinamico para adiciona multiplos valores em cada variason (string json)
    $scope.setupMultiInputs = async (index, field, action) => {

        if (!action) {
            return
        }

        if (!field) {
            return
        }

        if (!$scope.frmDinamico[field]) {
            $scope.frmDinamico[field] = []
        }

        if (action === 'add') {

            $scope.frmDinamico[field].push({ url: '' })

        } else if (action === 'remove') {

            if (index !== undefined) {
                //não remover o ultimo input
                if (index > 0) {
                    $scope.frmDinamico[field].splice(index, 1)
                }
            }

        }

        $.apply()

        // let frmDinamico = JSON.parse(angular.toJson($scope.frmDinamico))
        // $scope.frm_credito = { json_tab_preco: frmDinamico }

    }

    $scope.selectMenu = (filed) => {

        //trnar valor refrente ao index true e os demais false
        for (var key in $scope.selectinputsView) {
            $scope.selectinputsView[key] = false
        }
        $scope.selectinputsView[filed] = true
    }


    //inits 
    $scope.selectMenu('back')
    $scope.list()

}])