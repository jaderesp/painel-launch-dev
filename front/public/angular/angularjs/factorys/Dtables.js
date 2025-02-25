class Dtables {

    constructor() {

        //this.modal = modal_

    }

    /* add item no banco e retornar format html com id do banco nas funções */
    async gen(numCols = 0, DTColumnDefBuilder) {

        return new Promise(async (resolve, reject) => {

            if (!DTColumnDefBuilder) {
                reject("DTColumnDefBuilder não encontrado")// ou throw new Error("DTColumnDefBuilder não encontrado")
            }

            /* --------------------------------------- angulrjs DATATABLES ------------------------------------- */
            /* formatar datatables */
            let dtInstance = {};
            const dtOptions = {};
            dtOptions = DTOptionsBuilder.newOptions()
                .withOption('initComplete', function () {
                    /* executar qualquer ação após o carregamento completo da tabela */
                    set_tbody();
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


            let dtColumnDefs = []

            for (var i = 1; i <= numCols; i++) {
                /* configurar colunas */
                /* let dtColumnDefs =
                     [
                         DTColumnDefBuilder.newColumnDef(1).withOption('width', '45%'),
                         DTColumnDefBuilder.newColumnDef(2).withOption('width', '20%'),
                         DTColumnDefBuilder.newColumnDef(3).withOption('width', '12%'),
                         DTColumnDefBuilder.newColumnDef(5).withOption('width', '9%'),
                         DTColumnDefBuilder.newColumnDef(6).withOption('width', '15%')
 
                     ];
                */

                dtColumnDefs.push(DTColumnDefBuilder.newColumnDef(i).withOption('width', '20%'));

            }


            /* inicializar datatable */
            const destroy = function () {
                dtInstance.DataTable.ngDestroy();
            }

            /* inicializar instancia da tabela */
            const dtIntanceInicialize = function (instance) {
                dtInstance = {};
                dtInstance = instance;
                // dtInstance.reloadData();
                // dtInstance.DataTable.draw()
            }

            /* exibir linhas da tabela após o carregamento da biblioteca angularjs */
            const set_tbody = function () {
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

            const datatables_ = {
                dtOptions,
                dtColumnDefs,
                dtInstance,
                destroy,
                dtIntanceInicialize,
                set_tbody
            }

            resolve(datatables_);

            /* FIM --------------------------------------- angulrjs DATATABLES ------------------------------------- */


        })


    }

}