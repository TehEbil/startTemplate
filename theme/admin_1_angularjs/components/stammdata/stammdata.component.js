(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpStammdata', {
            bindings: {
                data: '=',
                save: '='
            },
            controller: StammdataController,
            controllerAs: 'vm',
            templateUrl: '/components/stammdata/stammdata.template.html'
        });

    StammdataController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService"];

    /* @ngInject */
    function StammdataController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService) {

        var vm = this;
        vm.state = true;
        vm.baseData = {
            data: [],
            changeCounter: 0
        };
        
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        var stammDataHandler = new StammDatenHandler($http);

        init();

        function init() {
            stammDataHandler.getAll().then(
                (res) => {
                    vm.baseData.data = res.data.customers.sources.data;
                    vm.baseData.changeCounter = res.data.customers.sources.changeCounter;
                }
            );
        }

        function onsave(item) {
            console.log("saved");
        }

        function ondelete(item) {
            console.log("saved");
        }

        function editData() {
            var obj = {
                uploads: vm.uploads,
                callback: onsave,
                data: vm.baseData.data,
                title: "Stammdata"
            }
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openComponentModal('editStammdata', obj).then((data) => {

                vm.baseData.data.splice(0, vm.baseData.data.length);

                for(let stat of data)
                    vm.baseData.data.push(stat);

                stammDataHandler.postData(vm.baseData).then(
                    (res) => {
                        vm.baseData.data = res.data.data;
                    }, 
                    (err) => {
                        alert('datas has been changed!')
                    } 
                );

                console.log("Modal closed, vm.uploads now = ", vm.baseData)
            });
        }
    }
})();