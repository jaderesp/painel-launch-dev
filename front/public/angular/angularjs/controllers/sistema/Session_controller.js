jms_app.controller('Session_controller', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', async function ($scope, $window, $http, $timeout, $interval, $location, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    $scope.base_url = $("#baseUrl").val() + "/";
    $scope.api_url = $("#apiUrl").val();
    $scope.ownerId = $('#ownerID').val();

    /* object modal */
    $scope.frm_modal = {};

    /* vars */
    $scope.frm_session = {};

    $scope.sessions_list = [];

    /* sessão selecionada */
    $scope.sessionaSelected = {};

    $('.tabela_dados').show();/* mostrar div */

    /* indices names */
    $scope.indexNames = [];
    /* campos  */
    $scope.fields_table = [];
    /* sessao datatable */
    $scope.dtInstance = {};


    /* --------------------------------------- angulrjs DATATABLES ------------------------------------- */
    /* formatar datatables */
    $scope.dtOptions = {};
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('initComplete', function () {
            /* executar qualquer ação após o carregamento completo da tabela */
            $scope.set_tbody();
        })
        .withOption('bLengthChange', true)
        .withOption('responsive', true)
        // .withOption('scrollX', true)
        .withOption('autoWidth', false)
        .withOption("destroy", true)
        .withLanguage({
            "sEmptyTable": "Nenhum à ser Apresentado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisa Rápida",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        });




    /* configurar colunas */
    $scope.dtColumnDefs =
        [
            DTColumnDefBuilder.newColumnDef(1).withOption('width', '45%'),
            DTColumnDefBuilder.newColumnDef(2).withOption('width', '20%'),
            DTColumnDefBuilder.newColumnDef(3).withOption('width', '12%'),
            DTColumnDefBuilder.newColumnDef(5).withOption('width', '9%'),
            DTColumnDefBuilder.newColumnDef(6).withOption('width', '15%')

        ];


    /* inicializar datatable */
    $scope.destroy = function () {
        $scope.dtInstance.DataTable.ngDestroy();
    }

    /* inicializar sessao da tabela */
    $scope.dtIntanceInicialize = function (instance) {

        $timeout(function () {
            $scope.dtIntance = {};
            $scope.dtIntance = instance;
        }, 500);

        // $scope.dtIntance.reloadData();
        // $scope.dtInstance.DataTable.draw()
    }

    /* exibir linhas da tabela após o carregamento da biblioteca angularjs */
    $scope.set_tbody = function () {
        /* função: não permitir a exibição de codigos fontes na tela antes do carregamento da biblioteca do angular
        SOMENTE PARA TABELAS */
        $timeout(function () {

            if (typeof ($("#linhas_dados")) !== "undefined") {
                $("#linhas_dados").fadeIn("slow", function () {
                    $('#linhas_dados').removeAttr('style')
                });


            }


        }, 300);

    }

    /* FIM --------------------------------------- angulrjs DATATABLES ------------------------------------- */


    /* ======================== utilidade =============================== */
    /* set messageBox tipos */
    $scope.messageBox = async function (titulo, msg, btnTitle, cor, redir) {

        /* params: redir --> redirecionar para url informada */
        /* cores: 'purple','red','blue','dark','orange' */

        /* alert */
        $ngConfirm({
            title: titulo,
            content: msg,
            type: cor,
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: btnTitle,
                    btnClass: 'btn-green',
                    action: function () {
                        if (redir) {
                            $window.location.href = $scope.base_url + redir;
                        }
                    }
                },
                Fechar: {
                    text: 'Fechar',
                    action: function (scope, button) {
                        if (redir) {
                            $window.location.href = "../../" + redir;
                        }
                    }
                }
            }
        });


    }


    /* inicio das regras: */

    /* listar dados */
    /* retornar sessoes cadastrados */
    $scope.get_sessions = async function (id) {

        return new Promise(async (resolve, reject) => {

            var opcao = { 'id': id };

            $http({
                method: 'POST',
                url: $scope.base_url + "sessao/getAll",
                data: opcao
            }).then(async function (data) {
                var result;
                result = data.data.dados;

                console.log("dados de sessões", result);
                if (result.length) {

                    $scope.sessions_list = result;

                }

                //atualizar tela com as informação de status de cada sessao
                $scope.verifyAllConns()


                if ($scope.sessions_list[0]) {


                    var cont = 0;
                    /* verificar status de cada sessão */
                    let int_ = $interval(async () => {

                        if (!$scope.sessions_list[cont]) {

                            $interval.cancel(int_);

                        }


                        // await $scope.sessionStatusApi($scope.sessions_list[cont].nomeApi_sess);

                        if (cont == $scope.sessions_list.length - 1) {

                            $interval.cancel(int_);
                        }

                        cont = cont + 1;

                    }, 2000);

                }

                resolve(true);

            }, function errorCallback(response) {
                resolve(false); /* se ocorrer erro */
            });


        });


    }



    /* exibir modal de cadastro */
    $scope.setup_modal = function (item) {

        let cont = 0;


        if (!item) {

            $scope.frm_session = {};
            $scope.ddd = '';

        } else {


            /* preencher select setores do usuario do banco dedos */
            let item_ = {};
            angular.extend(item_, item);


            angular.extend($scope.frm_session, item);

        }

        $("#form_add_sessao").modal('show');

    }


    /* add */
    /* add ou atualizar processo */
    $scope.setup_sessao = function () {

        return new Promise(async (resolve, reject) => {

            var opcao = {};
            var rota = '';

            if ($scope.frm_session.id_sess) {
                rota = 'sessao/update';
            } else {
                rota = 'sessao/add';
            }

            $http({
                method: 'POST',
                url: $scope.base_url + rota,
                data: $scope.frm_session
            }).then(function (data) {
                var result;
                result = data.data.retorno;



                if (result.id_sess || result.length > 0) {
                    $scope.messageBox('OK', 'Operação realizada com sucesso!', 'OK', 'green');
                } else {
                    $scope.messageBox('Atenção!', 'Ocorreu um erro ao efetuar a operação.', '', 'red');
                }

                /* atualizar lista de cadastros */
                $scope.get_sessions();
                $scope.frm_session = {};
                $("#form_add_sessao").modal('hide');
                resolve(true);

            }, function errorCallback(response) {
                resolve(false); /* se ocorrer erro */
            });

        });

    }

    $scope.updateSessionStatus = async (sessionData) => {

        if (!sessionData) {
            return
        }

        if (typeof sessionData !== "object") {
            return
        }

        let { id_sess, status_sess } = sessionData

        let params = { id_sess, status_sess }

        $http({
            method: 'POST',
            url: $scope.base_url + 'sessao/update',
            data: params
        }).then(function (data) {
            var result;
            result = data.data.retorno;
        })

    }

    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  EXCLUSÃO COM CONFIRMAÇÃO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* remover */
    $scope.confirma_exclusao_sess = function (item) {

        /* alert */
        $ngConfirm({
            title: "Confirmar?",
            content: "Deseja realmente excluir a sessão " + item.nome_sess + "?",
            type: "red",
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: "Confirmar",
                    btnClass: 'btn-green',
                    action: function () {
                        $scope.removeRegs(item.id_sess);
                    }
                },
                Fechar: {
                    text: 'Cancelar',
                    action: function (scope, button) {

                    }
                }
            }
        });

    }

    /* remover plano existente */
    $scope.removeRegs = function (id_sess) {
        var opcao = {};
        // angular.extend(opcao,{'opcao':'remover'});
        angular.extend(opcao, { 'id_sess': id_sess });


        $http({
            method: 'POST',
            url: $scope.base_url + "sessao/remove",
            data: opcao
        }).then(function (data) {
            var result;
            retorno = data.data.retorno;


            if (retorno == false || retorno == undefined || retorno == "") {
                $scope.messageBox('Atenção!', 'ocorreu um problema ao realizar a operação.', 'OK', 'red');
            } else {
                $scope.messageBox('Sucesso!', 'O registro foi removido com sucesso.', 'OK', 'blue');
                /* atualizar lista de cadastros */
                $scope.get_sessions();
            }



        });

    }


    /* sessão selecionada para exibir dados na modal */
    $scope.selectSession = async function (session) {

        return new Promise(async (resolve, reject) => {

            if (!$('#load_data').is(':loading')) {

                $("#load_data").loading({
                    theme: 'light', /* or dark */
                    message: '⏳Aguarde...',
                    onStart: function (loading) {
                        loading.overlay.slideDown(400);
                    },
                    onStop: function (loading) {
                        loading.overlay.slideUp(400);
                    }
                });

            }

            $scope.sessionaSelected = session;
            $("#modaltitle").html(session.nome_sess);
            //angular.extend($scope.sessionaSelected,session);
            await $scope.verifyQrcode({ 'session': session.nomeApi_sess, 'status': session.status_sess, 'qrcode': session.qrcode }, session);


            resolve(true);
        });

    }

    $scope.setupQrcodeModal = async (img) => {

        /* inciailizar (loading) */
        $("#qrcodeImg_modal").prop("src", $scope.base_url + "custom/assets/img/conection/loadingqr.gif");

        return new Promise(async (resolve, reject) => {

            /* aplicar loader inicial até que os dados se apresentem */
            $('#qrcodeImg_modal').prop('src', '');
            $("#qrcodeTitle_modal").html('Gerando qrcode para ' + session.nomeApi_sess + '...');
            $("#qrcodeImg_modal").prop("src", img);

            resolve(true);
            return;

        });

    }


    /* =============================== SCOKET IO ==================================== */

    $scope.initSocketIo = async function () {

        return new Promise(async (resolve, reject) => {
            /* socket io */
            $scope.socket = io($scope.api_url, { transports: ['websocket', 'polling', 'flashsocket'], autoConnect: true });

            $scope.socket.on("connect", () => {

                $scope.socket.emit("register", JSON.stringify({ id_: $scope.ownerId }))

            })

            $scope.socket.on("disconnect" + $scope.ownerId, () => {

                console.log("Erro, o servidor da api não está online, favor verifique.");

            });

            $scope.socket.on('qrcode', async function (data_) {
                let dados = angular.fromJson(data_); /* converter string to object */
                let { data, session, session_id } = dados
                angular.extend(data, { session, session_id })

                console.log("Informação recebida (qrcode): ", data);

                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    if ($scope.sessions_list[i].nomeApi_sess == data.session) {

                        $scope.sessions_list[i].status_sess = data.status;
                        await $scope.verifyQrcode(data, $scope.sessions_list[i]);

                        //temporario
                        $scope.createSession($scope.sessions_list[i])

                    }

                }
                //document.getElementById('messagebox').innerHTML = data;
            });

            $scope.socket.on('qrcodeError', async function (data_) {
                let dados = angular.fromJson(data_); /* converter string to object */
                let { data, session, session_id } = dados
                angular.extend(data, { session, session_id })
                console.log("Erro/Timout para autenticação do qrcode (qrcode): ", data);

                /* fechar a modal qrcode */
                if ($scope.sessionaSelected.nomeApi_sess == data.session) {
                    /* fechar modal após conectar */
                    $("#qrcodeImg_modal").prop("src", '');
                    $('#qrcode_modal').modal('hide');

                }

                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    if ($scope.sessions_list[i].nomeApi_sess == data.session) {

                        $scope.sessions_list[i].status_sess = data.status;
                        await $scope.verifyQrcode(data, $scope.sessions_list[i]);

                    }

                }


            });

            $scope.socket.on('notificacao' + $scope.ownerId, async function (data_) {

                let dados = angular.fromJson(data_); /* converter string to object */
                let { data, session, session_id } = dados
                angular.extend(data, { session, session_id })
                console.log("Nova notificação: ", data);

                /*  dados de todas as sessoes (recebido pelo socket) */


                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    $scope.sessions_list[i].status_sess = data.status;
                    if (data.session) {

                        if ($scope.sessions_list[i].nomeApi_sess == data.name) {

                            delete (data.session);
                            angular.extend(data, { 'instancia': data.name });

                            /* atualizar dados no arrayList Sessoes */
                            await $scope.updateArraySession(data)

                            await $scope.verifyQrcode(data, $scope.sessions_list[i]);

                        }

                    }

                }


            });


            $scope.socket.on('message', async function (data_) {
                let dados = angular.fromJson(data_); /* converter string to object */
                let { data, session, session_id } = dados
                angular.extend(data, { session, session_id })
                console.log("Mensagem recebida: ", data);
                //document.getElementById('messagebox').innerHTML = data;
            });


            $scope.socket.on('connState', async data_ => {
                let dados = angular.fromJson(data_); /* converter string to object */
                let { data, session, session_id } = dados
                angular.extend(data, { session, session_id })
                console.log("Status da sessão via socket: ", data);
                /* inicializar as sessões no table */
                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    if ($scope.sessions_list[i].nomeApi_sess == data.session) {
                        //temporario
                        //  $scope.createSession($scope.sessions_list[i])
                        /* atualizar dados no arrayList Sessoes */
                        await $scope.updateArraySession(data);
                        $scope.updateSessionStatus(session)


                    }

                }

            })

            resolve(true);


        });


    }

    /* alterar os dados da variável de sessões: STATUS, QRCODE */
    $scope.updateArraySession = async (data) => {

        return new Promise(async (resolve, reject) => {

            for (var i = 0; i < $scope.sessions_list.length; i++) {

                let instance = data.name ? data.name : data.session;

                if ($scope.sessions_list[i].nomeApi_sess == instance) {

                    $scope.sessions_list[i].status_sess = data.status;
                    $scope.sessions_list[i].qrcode = data.qrcode;

                    await $scope.verifyQrcode(data, $scope.sessions_list[i]);

                    resolve(true);
                    return;

                }

            }

        });

    }


    /* criar sessao via socket */
    $scope.createSession = async function (session_) {

        return new Promise(async (resolve, reject) => {

            /* loader na pagina */

            if (!$('#load_data').is(':loading')) {

                $("#load_data").loading({
                    theme: 'light', /* or dark */
                    message: '⏳Aguarde...',
                    onStart: function (loading) {
                        loading.overlay.slideDown(400);
                    },
                    onStop: function (loading) {
                        loading.overlay.slideUp(400);
                    }
                });

            }

            $scope.sessionaSelected = session_;
            var sessionName = session_.nomeApi_sess;

            /* ========================= INICIALIZAR ==================== */
            /* adicionar o loader no icone de conexao da sessão inicialmente */
            $("#qrcodeTitle" + session_.id_sess).html('Gerando qrcode para ' + session_.nomeApi_sess + '...');
            $("#qrcodeImg" + session_.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/loadingqr.gif");
            $("#qrcodeImg" + session_.id_sess).attr("title", 'Gerando qrcode para ' + session_.nomeApi_sess + '...');

            if (!$scope.ownerId) {

                $scope.messageBox('Atenção!', 'Ocorreu um erro ao se comunicar com servidor, favor contate o suporte.', '', 'orange');
                return;
            }

            /* se o status inicial da sessão for disconected, realizar um logoff inicialmente */
            if (session_.status_sess == 'DISCONECTED') {

                // await $scope.logoffSession(session_.nomeApi_sess);/* logoff  e remover sessão na api */

            }

            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.api_url + '/start',
                data: JSON.stringify({ "session": sessionName, 'company_id': $scope.ownerId })
            }).then(async function (data) {
                var result;
                result = data.data;

                let { qrcode } = result
                if (qrcode) {
                    result.status = (qrcode === 'init') ? 'CONNECTED' : result.status
                }

                console.log("Retorno de criação da sessão: ", result);

                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    if ($scope.sessions_list[i].nomeApi_sess == result.session) {

                        $scope.sessions_list[i].status_sess = result.status;
                        await $scope.verifyQrcode(result, $scope.sessions_list[i]);
                        break;
                    }



                }



                resolve(true);

            });

        });

    }

    $scope.verifyAllConns = async () => {

        for (var i = 0; i < $scope.sessions_list.length; i++) {

            if ($scope.sessions_list[i].nomeApi_sess) {

                let session_ = $scope.sessions_list[i]

                $scope.createSession(session_)

            }

        }

    }

    /* verificação de status de cada sessão (setar no front) */
    /* tratativas para qrcode status */
    $scope.verifyQrcode = async function (retorno, sessao) {


        return new Promise(async (resolve, reject) => {

            if (retorno.session == sessao.nomeApi_sess) {

                /* informar status na coluna da tabela (front) */

                //atualizar status no banco de dados
                $scope.updateSessionStatus(sessao)

                if (retorno.status) {

                    let status = retorno.status;

                    if (status == true || status == 'CONNECTED' || retorno.qrcode == "init" || retorno.qrcodecode == "init") {
                        status = 'CONNECTED';
                    } else {
                        status = 'PENDENTE';
                    }

                    $('#col_status_' + sessao.id_sess).html(status);
                }


                /* ========================= INICIALIZAR ==================== */
                /* adicionar o loader no icone de conexao da sessão inicialmente */
                $("#qrcodeTitle" + sessao.id_sess).html('Gerando qrcode para ' + sessao.nomeApi_sess + '...');
                $("#qrcodeImg" + sessao.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/loadingqr.gif");
                $("#qrcodeImg" + sessao.id_sess).attr("title", 'Gerando qrcode para ' + sessao.nomeApi_sess + '...');


                /* atualizar o qrcode */
                if (retorno.qrcode && retorno.qrcode !== 'init') {
                    var qrc = retorno.qrcode; /* adicionar timer para refresh da imagem */


                    if ($("#qrcodeImg" + sessao.id_sess).length) {

                        $("#qrcodeTitle" + sessao.id_sess).html('Leia o qrcode para ' + sessao + '.');
                        $("#qrcodeImg" + sessao.id_sess).attr("src", qrc);
                        $("#qrcodeImg" + sessao.id_sess).attr("title", 'Leia o qrcode para ' + sessao + '.');
                        $('#col_status_' + sessao.id_sess).html('ler Qrcode');


                        if ($scope.sessionaSelected.nomeApi_sess == retorno.session) {

                            if (qrc) {
                                /* abrir modal e exibir qrcode */
                                // $("#qrcodeImg_modal").prop("src", '');
                                $("#qrcodeImg_modal").attr("src", '');
                                $("#qrcodeImg_modal").attr("src", qrc.toString());
                                $("#qrcodeImg_modal").attr("title", 'Leia o qrcode para ' + sessao.nomeApi_sess + '.');

                                $('#qrcode_modal').modal('show');
                            }

                            if ($('#load_data').is(':loading')) {
                                /* finalizar loading */
                                $("#load_data").loading('stop');

                            }

                        }
                    }


                    resolve(false); /* ainda nao conectado */
                    return;
                } else if (retorno.status == "DISCONECTED" || retorno.status == "Inexistente" && retorno.status == true && !retorno.qrcode || retorno.qrcode == "none") {

                    /* o tempo limite para sincronizar qrcode, expirou... */
                    $("#qrcodeImg" + sessao.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/disconnected.png");
                    $("#qrcodeTitle" + sessao.id_sess).html('O tempo limite para leitura do qrcode expirou, por favor <b>DESCONECTAR-SE</b> e  solicitar uma nova conexão.');
                    $("#qrcodeImg" + sessao.id_sess).attr("title", 'O tempo de conexão para ' + sessao.nomeApi_sess + ' expirou ou sessão foi cancelada, conectar novamente.');

                    $('#col_status_' + sessao.id_sess).html('Desconectado');

                    if ($('#load_data').is(':loading')) {
                        /* finalizar loading */
                        $("#load_data").loading('stop');

                    }

                    resolve(false);
                    return;

                } else if (retorno.qrcode == 'none' && retorno.status == 'UNPAIRED' || retorno.status == 'PAIRING' || retorno.status == 'OPENING') {
                    /* aguardar geração do qrcode */
                    if ($("#qrcodeImg" + sessao.id_sess).length) {

                        $("#qrcodeTitle" + sessao.id_sess).html('Gerando qrcode para ' + sessao.nomeApi_sess + '...');
                        $("#qrcodeImg" + sessao.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/loadingqr.gif");
                        $("#qrcodeImg" + sessao.id_sess).attr("title", 'Gerando qrcode para ' + sessao.nomeApi_sess + '...');

                        $('#col_status_' + sessao.id_sess).html('Processando...');
                    }


                    resolve(false);
                    return;
                } else {
                    /* se não retornar qrcode, exibir imagem de desconexão */
                    if ($("#qrcodeImg" + sessao.id_sess).length) {
                        $("#qrcodeTitle" + sessao.id_sess).html('Instância ' + sessao.nomeApi_sess + ' desconectada.');
                        $("#qrcodeImg" + sessao.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/disconnected.png");
                        $("#qrcodeImg" + sessao.id_sess).attr("title", 'Instância ' + sessao.nomeApi_sess + ' desconectada.');

                        $('#col_status_' + sessao.id_sess).html('Desconectado');
                    }


                }


                /* tratar conexão  */
                if (retorno.status == 'qrReadSuccess' || retorno.status == 'inChat' || retorno.status == 'CONNECTED' || retorno.qrcode == 'syncronized' || retorno.status == true && retorno.qrcode !== "none" && retorno.qrcode) {

                    if ($("#qrcodeImg" + sessao.id_sess).length) {

                        $("#qrcodeTitle" + sessao.id_sess).html('Instância ' + sessao.nomeApi_sess + ' conectada. 👍');
                        $("#qrcodeImg" + sessao.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/success.png");
                        $("#qrcodeImg" + sessao.id_sess).attr("title", 'Instância ' + sessao.nomeApi_sess + ' conectada. 👍');

                        if (retorno.qrcode == 'syncronized' || retorno.status == 'CONNECTED') {

                            $('#col_status_' + sessao.id_sess).html('Conectado');

                        } else {

                            $('#col_status_' + sessao.id_sess).html('Conectando...');

                        }

                        if ($scope.sessionaSelected.nomeApi_sess == retorno.session) {
                            /* fechar modal após conectar */
                            $("#qrcodeImg_modal").prop("src", '');
                            $('#qrcode_modal').modal('hide');

                        }
                    }

                    if ($('#load_data').is(':loading')) {
                        /* finalizar loading */
                        $("#load_data").loading('stop');

                    }

                    resolve(true);
                    return;
                }

                if (retorno.status == 'qrcodeReadError' || retorno.status == "qrReadError" || retorno.status == 'autocloseCalled' || retorno.status == 'browserClose' || retorno.status == true && retorno.qrcode == 'none' || !retorno.qrcode) {

                    if ($("#qrcodeImg" + sessao.id_sess).length) {

                        $("#qrcodeTitle" + sessao.id_sess).html(' A Instância ' + sessao.nomeApi_sess + ' desconectada excedeu limite para gerar qrcodes.');
                        $("#qrcodeImg" + sessao.id_sess).attr("src", $scope.base_url + "custom/assets/img/conection/disconnected.png");
                        $("#qrcodeImg" + sessao.id_sess).attr("title", 'Instância ' + sessao.nomeApi_sess + ' desconectada excedeu limite para gerar qrcodes.');
                        $('#col_status_' + sessao.id_sess).html('Desconectado');

                        /* se a leitura der errado fechar modal */
                        $("#qrcodeImg_modal").prop("src", '');
                        $('#qrcode_modal').modal('hide');
                    }


                    /* finalizar loading */
                    if ($('#load_data').is(':loading')) {
                        /* finalizar loading */
                        $("#load_data").loading('stop');

                    }
                    resolve(false);
                    return;
                }

                resolve(true);
                return;

            }/* verifica~]ao de nome da sessao verificada */



        });



    }


    /* logoff sessao na api */
    $scope.logoffSession = async function (sessionName) {
        return new Promise(async (resolve, reject) => {

            if ($('#load_data').is(':loading')) {
                /* finalizar loading */
                $("#load_data").loading('stop');

            }

            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.api_url + '/logoff',
                data: JSON.stringify({ "session": sessionName })
            }).then(async function (data) {
                var result;
                result = data.data;

                console.log("Logoff da sessão efetuado: ", result);

                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    if ($scope.sessions_list[i].nomeApi_sess == result.session) {

                        $scope.sessions_list[i].status_sess = result.status;
                        await $scope.verifyQrcode(result, $scope.sessions_list[i]);

                    }

                }

                resolve(true);

            });

        });

    }


    /* status da sessão na api */
    /* logoff sessao na api */
    $scope.sessionStatusApi = async function (sessionName) {
        return new Promise(async (resolve, reject) => {


            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.api_url + '/status',
                data: JSON.stringify({ "instancia": sessionName })
            }).then(async function (data) {
                var result;
                result = data.data;

                console.log("Consultando status da sessão na APi: ", result);

                for (var i = 0; i < $scope.sessions_list.length; i++) {

                    if ($scope.sessions_list[i].nomeApi_sess == result.session) {

                        $scope.sessions_list[i].status_sess = result.status;
                        await $scope.verifyQrcode(result, $scope.sessions_list[i]);

                    }

                }

                resolve(true);

            });

        });

    }


    //$scope.initSocketIo();    
    $scope.initSocketIo()//inicializar o socket


}]);