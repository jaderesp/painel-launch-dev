jms_app.controller('Dashboard_controller', ['$scope', '$window', '$http', '$timeout', '$interval', '$location', '$filter', '$ngConfirm', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', async function ($scope, $window, $http, $timeout, $interval, $location, $filter, $ngConfirm, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
    /* 
        - verificação de conexão do api (se servidor ativo ou inativo)
        - verificar status e notificações das sessões
    */
    $scope.base_url = $("#baseUrl").val() + "/";
    $scope.api_url = $("#apiUrl").val();
    $scope.ownerId = $('#ownerID_sis').val();


    $scope.contatosQtde = {};
    $scope.updateData = new Date();

    /* grafico cadastro de contato x dia */
    $scope.graficoContacts = {};
    $scope.grfaicoContactDados = {};
    var revenueReportChart = document.querySelector('#graficoTransacoesDiarias');
    var textMutedColor = '#b9b9c3';
    $scope.qtdDias = 0;

    $scope.titulo = 'Último 7 dias.';/* titulo para select periodo dashboard (contatos por data decadastro grafico) */


    $scope.totalHeader = { "totalPixIn": 0, "totalPixOut": 0, "qtdeCreditos": 0, "saldo": 0 }


    //graficos contagem de pix
    var $statisticsProfitChart = document.querySelector('#statistics-profit-chart');
    var statisticsProfitChartOptions;
    var $trackBgColor = '#EBEBEB';



    $scope.getQtdeContacts = async function () {

        return new Promise(async (resolve, reject) => {

            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.base_url + 'dashboard/contatosQtde',
                data: {}
            }).then(async function (data) {
                var result;
                result = data.data.dados;

                $scope.contatosQtde = result.length;

                resolve(result);

            });

        });

    }

    /* retornar dados do graficos de contatos por data */
    $scope.getTransacoesDataGraf = async function (qtdeDias, default_) {

        return new Promise(async (resolve, reject) => {

            $scope.qtdDias = qtdeDias;
            let dados = { 'qtdeDias': qtdeDias };/* formatar tamanho do periodo (datas do grafico) */

            $scope.setLoader('diario', 'start')

            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.base_url + 'dashboard/transacoesGraf',
                data: dados
            }).then(async function (data) {
                var result;
                result = data.data.dados;

                $scope.grfaicoContactDados = result;

                $scope.totalHeader = result.dados

                if (result) {

                    if (Object.keys($scope.totalHeader).length == 0) {
                        $scope.totalHeader = { totalPixIn: 0, totalPixOut: 0, saldo: 0 }
                    }

                    let { totalPixIn, totalPixOut } = $scope.totalHeader

                    $scope.totalHeader.totalPixIn = (totalPixIn) ? totalPixIn : 0
                    $scope.totalHeader.totalPixOut = (totalPixOut) ? totalPixOut : 0
                    $scope.totalHeader.saldo
                    let { saldo } = result.dados
                    saldo = (saldo) ? saldo : parseFloat(saldo).toFixed(2).replaceAll(".", ",")
                    $("#saldo_header").html("R$ " + (saldo ? saldo : 0.0))

                    //formatar os dados para somatoria do saldos header do dashboard
                    $scope.initializeGraficos(result);
                }


                resolve(result);

            });

        });

    }

    $scope.initializeGraficos = async (grafData) => {

        return new Promise(async (resolve, reject) => {

            //----------------------------------------------
            let { dados } = grafData
            if (Object.keys(dados).length == 0) {
                $scope.totalHeader = { totalPixIn: 0, totalPixOut: 0, saldo: 0 }
            }

            let { pix_in, pix_out } = grafData.dados
            let { categorias } = grafData
            categorias = (categorias) ? categorias : [];
            let pixInData = (pix_in) ? pix_in : 0;
            let pixOutData = (pix_out) ? pix_out : 0;
            $scope.graficoContacts = {};
            $scope.grfaicoContactDados = {};

            let revenueReportChartOptions = {
                chart: {
                    height: 250,
                    stacked: false,
                    type: 'bar',
                    toolbar: { show: true }
                },
                title: {
                    text: 'Quantidade Pix',
                },
                plotOptions: {
                    bar: {
                        columnWidth: '20%',
                        endingShape: 'rounded',
                        dataLabels: {
                            position: 'top'
                        }
                    },
                    distributed: true
                },
                colors: [window.colors.solid.primary, window.colors.solid.warning],
                series: [
                    {
                        name: 'Pix In',
                        data: pixInData
                    },
                    {
                        name: 'Pix Out',
                        data: pixOutData //[-145, -80, -60, -180, -100, -60, -85, -75, -100]
                    }
                ],
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#333']
                    },
                    offsetX: 30
                },
                legend: {
                    show: false
                },
                grid: {
                    padding: {
                        top: -20,
                        bottom: -10
                    },
                    yaxis: {
                        lines: { show: true }
                    }
                },
                xaxis: {
                    categories: categorias,
                    labels: {
                        style: {
                            colors: textMutedColor,
                            fontSize: '0.86rem'
                        }
                    },
                    axisTicks: {
                        show: true
                    },
                    axisBorder: {
                        show: true
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: textMutedColor,
                            fontSize: '0.86rem'
                        }
                    }
                },
                noData: {
                    text: 'Loading...'
                }

            };

            $scope.graficoContacts = new ApexCharts(revenueReportChart, revenueReportChartOptions);
            $scope.graficoContacts.render();
            $scope.setLoader('diario', 'stop')
            resolve(true);
            //---------------- Budget Chart ----------------

        });


    }


    //grafico em tempo real contagem de pixIN pixOut
    $scope.initGraficoAdminCount = async (pixIn, pixOut, categorias) => {

        return new Promise(async (resolve, reject) => {



            //------------ Statistics Line Chart ------------
            //-----------------------------------------------
            statisticsProfitChartOptions = {
                chart: {
                    height: 450,
                    type: 'area',
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    }
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                grid: {
                    borderColor: $trackBgColor,
                    strokeDashArray: 10,
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: false
                        }
                    },
                    padding: {
                        top: -30,
                        bottom: -10
                    }
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#333']
                    },
                    offsetX: 30
                },
                stroke: {
                    width: 3
                },
                colors: [window.colors.solid.info, window.colors.solid.warning],
                series: [
                    {
                        name: 'Pix In',
                        data: pixIn
                    },
                    {
                        name: 'Pix Out',
                        data: pixOut //[-145, -80, -60, -180, -100, -60, -85, -75, -100]
                    }
                ],
                markers: {
                    size: 2,
                    colors: window.colors.solid.info,
                    strokeColors: window.colors.solid.info,
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeDashArray: 0,
                    fillOpacity: 1,
                    discrete: [
                        {
                            seriesIndex: 0,
                            dataPointIndex: 5,
                            fillColor: '#ffffff',
                            strokeColor: window.colors.solid.info,
                            size: 5
                        }
                    ],
                    shape: 'circle',
                    radius: 2,
                    hover: {
                        size: 3
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.45,
                        opacityTo: 0.05,
                        stops: [20, 100, 100, 100]
                    },
                },
                xaxis: {
                    categories: categorias,
                    labels: {
                        style: {
                            colors: textMutedColor,
                            fontSize: '0.86rem'
                        }
                    },
                    axisTicks: {
                        show: true
                    },
                    axisBorder: {
                        show: true
                    }
                },
                yaxis: {
                    show: true,
                    labels: {
                        style: {
                            colors: '#8e8da4',
                        },
                        offsetX: 0,

                    },
                    axisBorder: {
                        show: true,
                    },
                    axisTicks: {
                        show: true
                    }
                },

                tooltip: {
                    x: {
                        show: true
                    }
                }
            };
            statisticsProfitChart = new ApexCharts($statisticsProfitChart, statisticsProfitChartOptions);
            statisticsProfitChart.render();

        })

    }

    $scope.setLoader = (type, action) => {

        let graficoComponentShow = $("#graficoTransacoesDiarias")
        let graficoDiarioComponent = $("#loader_grafico_diario")


        if (type == "diario") {

            if (action === 'start') {
                graficoDiarioComponent.show()
                graficoComponentShow.hide()
            } else if (action === 'stop') {
                graficoDiarioComponent.hide()
                graficoComponentShow.show()
            }
        }

    }

    $scope.getExtratos = async function (params) {

        return new Promise(async (resolve, reject) => {

            let dados = params ? params : {}

            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.base_url + 'dashboard/saldoJSONSync',
                data: dados
            }).then(async function (data) {
                var result;
                result = data.data.dados;

                var extratos = result;

                $scope.totalHeader.totalPixIn = 0
                $scope.totalHeader.totalPixOut = 0
                $scope.totalHeader.saldo = 0

                let { saldo } = extratos
                if (saldo) {
                    $scope.totalHeader = extratos
                }


                resolve(extratos);

            });

        });

    }

    $scope.getTransacoesPorHora = async function (params) {

        return new Promise(async (resolve, reject) => {

            let dados = params ? params : {}

            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                url: $scope.base_url + 'dashboard/transacoesHora',
                data: dados
            }).then(async function (data) {
                var result;
                result = data.data.dados;
                resolve(result);

            });

        });

    }

    $scope.setupGraficosTotaisPorHora = async () => {

        let totaisPorHora = await $scope.getTransacoesPorHora()

        for (i = 0; i < totaisPorHora.length; i++) {

            let hora = new Date(totaisPorHora[0].hour).getHours()

        }
        return;
        let cont = 0
        let pixIn = [45, 40, 20, 110, 80, 10, 45, 70, 120, 13]
        let pixOut = [145, 80, 60, 180, 100, 60, 85, 75, 100, 39]
        let categorias = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00']

        let valor1 = Math.floor(Math.random() * 350);
        pixIn[cont] = valor1

        let valor2 = Math.floor(Math.random() * 350);
        pixOut[cont] = valor2

        var d = new Date();
        var horario = d.toLocaleTimeString();
        categorias[cont] = horario


        /* await statisticsProfitChart.updateSeries([
             {
                 name: 'Pix In',
                 data: pixIn
             },
             {
                 name: 'Pix Out',
                 data: pixOut //[-145, -80, -60, -180, -100, -60, -85, -75, -100]
             }
         ]) */

        //update categorias
        await statisticsProfitChart.updateOptions({
            xaxis: {
                categories: categorias,
                labels: {
                    style: {
                        colors: textMutedColor,
                        fontSize: '0.86rem'
                    }
                },
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true
                }
            },
            series: [
                {
                    name: 'Pix In',
                    data: pixIn
                },
                {
                    name: 'Pix Out',
                    data: pixOut //[-145, -80, -60, -180, -100, -60, -85, -75, -100]
                }
            ]
        })

        cont = cont + 1

        if (cont == 10) {
            cont = 0
        }




    }

    $scope.setupGraficosTotaisPorHora()
    // $scope.getPlanoAtivo();
    // $scope.getQtdeContacts();
    //  $scope.getCampanhasEnviadas();    
    $scope.getExtratos()
    await $scope.getTransacoesDataGraf(-10);

    let cont = 0
    let pixIn = [45, 40, 20, 110, 80, 10, 45, 70, 120, 13]
    let pixOut = [145, 80, 60, 180, 100, 60, 85, 75, 100, 39]
    let categorias = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00']

    $scope.initGraficoAdminCount(pixIn, pixOut, categorias)

    let interv = $interval(async () => {

        $interval.cancel(interv)

        let valor1 = Math.floor(Math.random() * 350);
        pixIn[cont] = valor1

        let valor2 = Math.floor(Math.random() * 350);
        pixOut[cont] = valor2

        var d = new Date();
        var horario = d.toLocaleTimeString();
        categorias[cont] = horario


        /* await statisticsProfitChart.updateSeries([
             {
                 name: 'Pix In',
                 data: pixIn
             },
             {
                 name: 'Pix Out',
                 data: pixOut //[-145, -80, -60, -180, -100, -60, -85, -75, -100]
             }
         ]) */

        //update categorias
        await statisticsProfitChart.updateOptions({
            xaxis: {
                categories: categorias,
                labels: {
                    style: {
                        colors: textMutedColor,
                        fontSize: '0.86rem'
                    }
                },
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true
                }
            },
            series: [
                {
                    name: 'Pix In',
                    data: pixIn
                },
                {
                    name: 'Pix Out',
                    data: pixOut //[-145, -80, -60, -180, -100, -60, -85, -75, -100]
                }
            ]
        })

        cont = cont + 1

        if (cont == 10) {
            cont = 0
        }
    }, 3000)



}]);