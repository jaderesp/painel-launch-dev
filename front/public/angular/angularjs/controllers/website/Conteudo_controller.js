jms_app.controller('Conteudo_controller', ['$scope','$window','$http','$timeout','$location', '$ngConfirm', function($scope,$window, $http,$timeout,$location,$ngConfirm){

    $scope.base_url = $("#base_url").val();

    $scope.frm_ident_contato={};

    $scope.regioes = [];

     /* retornar dados de LOGISTICA (ENTREGA) */
     $scope.get_regs = function(){

        $http({
            method: 'GET',
            url: $scope.base_url + 'public/Loja/api/Logistica/get_regioes'
          }).then(function successCallback(data) {
             
                $scope.regioes = [];
                $scope.regioes = data.data;

            }, function errorCallback(response) {
              
                $scope.messageBox('OoOops','Ocorreu um erro; ' + response, 'OK','orange');

            });

    }




    /* ritentificar contato para exibir cardápior para seleção */
    $scope.add_precad_cliente = function(){


       
        if(!$scope.frm_ident_contato.contato_email){

            $scope.messageBox('OoOops','Por favor digite o seu melhor email!', 'OK','orange');
            return;
        }

        if(!$scope.frm_ident_contato.contato_whatsapp){

            $scope.messageBox('OoOops','Por favor digite o número do seu whatsapp!', 'OK','orange');
            return;
        }

        if(!$scope.frm_ident_contato.contato_regiao.id_rge){

            $scope.messageBox('OoOops','Por favor selecione a sua região!', 'OK','orange');
            return;
        }

        var postStr = "?email_prec=" + $scope.frm_ident_contato.contato_email + "&whatsapp=" + $scope.frm_ident_contato.contato_whatsapp + "&cod_regiao=" + $scope.frm_ident_contato.contato_regiao.id_rge

        $scope.messageBox('Sucesso','Dados de contato para registrar pedido...' + $scope.frm_ident_contato.contato_whatsapp , 'OK','green','public/cardapio' + postStr);

        /* função salvar dados do contato no banco de dados e direcionar o contato para selecionar o grupo de cardápios */

    }



           /* set messageBox tipos */
    $scope.messageBox = function(titulo, msg, btnTitle, cor, redir){
    
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
                        action: function(){
                            if(redir){
                                $window.location.href =  $scope.base_url + redir;
                            }
                        }
                    },
                    Fechar: {
                        text: 'Fechar',
                        action: function(scope, button){
                            if(redir){
                                $window.location.href = "../../" + redir;
                            }
                        }
                    }
                }
            });
    
    
    }



  

}]);