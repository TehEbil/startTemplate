(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$rootScope', '$scope', '$stateParams', 'modalService', 'ProjectHandler', '$interval', '$timeout', 'uiGridConstants'];

    /* @ngInject */
    function ProjectsController($rootScope, $scope, $stateParams, modalService, ProjectHandler, $interval, $timeout, uiGridConstants) {
        var vm = this;
        vm.title = 'ProjectsController';
        vm.type = "Protocol";
        vm.data = undefined
        vm.id = false;
        vm.allData = {};
        vm.untouched = [];
        vm.selected = {};

        vm.newProject = newProject;
        vm.editProject = editProject;
        // vm.deleteData = deleteData;
        // vm.setColor = setColor;

        vm.isMobile = isMobile.any;
        vm.mobileAmount = 50;

        if(vm.isMobile) // for blue loading bar
            $rootScope.$broadcast('loadTable');

        vm.isEmployee = true;

        init();

        vm.columnDefs = [
            { field: 'orderDatas.otherInformations.orderDate', width: 120, displayName: "Erst. Datum", type : 'date',
                    cellFilter : 'date:"dd.MM.yyyy"',
                    filterCellFiltered : 'true',
                    cellTemplate:
                `
                <div tooltip-append-to-body="true"
                  uib-tooltip-html="!COL_FIELD ? '' : 'um ' + (COL_FIELD | date:'HH:mm') + ' Uhr'"
                  tooltip-class="" class="ui-grid-cell-contents">
                    {{grid.getCellValue(row, col) | date:'dd.MM.yyyy'}}
                </div>
                `,
              sort: {
                direction: uiGridConstants.DESC
              },
              filters: [{
                  condition: function(term, value){
                      if (!term) return true;
                      var valueDate = createDate(value);
                      var replaced = term.replace(/\\/g,'');
                      var termDate = createDate(replaced);
                      return valueDate >= termDate;
                  },
                  placeholder: ' from'
                  
              }, {
                  condition: function(term, value){
                      if (!term) return true;
                      var valueDate = createDate(value);
                      var replaced = term.replace(/\\/g,'');
                      var termDate = createDate(replaced);
                      return valueDate <= termDate;
                    },
                  placeholder: ' to'
              }]
            },
            { field: 'id', displayName: "ID", width: 120 },
            { field: 'projectNumber', displayName: "ProjektNummer", width: 120 },
            { field: 'ownPerformanceBuilder', displayName: "Name" },
            { field: 'orderDatas.customer.mobile', displayName: "Telefon", visible: false},
            { field: 'orderDatas.customer.email', displayName: "E-Mail", visible: false, cellTemplate: 
                `<div tooltip-append-to-body="true"
                  uib-tooltip-html="COL_FIELD"
                  class="ui-grid-cell-contents">
                    {{COL_FIELD}}
                </div>`
            },
            { field: 'orderDatas.customer.address.route', displayName: "Straße (Kunde)"},
            { field: 'orderDatas.customer.address.postal_code', displayName: "PLZ (Kunde)", width: 89},
            { field: 'orderDatas.customer.address.locality', displayName: "Stadt (Kunde)"},
        ];

        vm.menuOptions = [
            // NEW IMPLEMENTATION
            {
                text: 'Neu',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    vm.newData()
                }
            },
            {
                text: 'Bearbeiten',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    vm.editData()
                }
            },
            {
                text: 'Löschen',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    vm.deleteData()
                }
            },
            // {
            //     text: 'Farben',
            //     children: [
            //         {
            //             text: 'Rot',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('red')
            //             }
            //         },
            //         {
            //             text: 'Gelb',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('yellow')
            //             }
            //         },
            //         {
            //             text: 'Grün',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('green')
            //             }
            //         },
            //         {
            //             text: 'Blau',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('blue')
            //             }
            //         },
            //         null, // Dividier
            //         {
            //             text: 'Zurücksetzen',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('normal')
            //             }
            //         },
            //     ]
            // },
            null, // Dividier
            {
                text: 'Zurück',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    return;
                }
            },
        ];

        function init() {
            ProjectHandler.getData().then((res) => {
                vm.data = res.data; // getData() should get all Projects instead of only one;
                vm.data[0].id = 1 // fakeId, it has no id;

                console.log("data", vm.data);
            });
        }

        function newProject() {

            /* you will not need project data for new */
            
        }

        function editProject() {
            let obj = {
                data: vm.selected
            };

            modalService.openMenuModal('views/form_projekt.html', 'FormProjektController', 'animated zoomIn', obj).then(
                (data) => {
                    if (typeof data !== 'undefined') {
                        ProjectHandler.postData(data).then((res) => {
                            console.log('====================================');
                            console.log('response: ', res);
                            console.log('====================================');
                        });    
                    }
                }
            );
        }   
        
        $scope.$on("$destroy", function() {
            // console.log("clearing interval")
            // $interval.cancel(interval)
            $rootScope.authService.func = null;

        });

        $rootScope.$on('selectedElement', function (event, data) {
            vm.selected = data.selected;
        });
        
    }
})();
