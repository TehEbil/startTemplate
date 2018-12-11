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
        vm.uploadObjects = {
            lastAdded: [],
            edited: [],
            deleted: [],
            changeCounter: 0
        };
        
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        init();

        function init() {
            $http.get(`${$rootScope.ip}getStammdata`).then((res) => {
                vm.data = res.data.data.customers.sources
                vm.uploadObjects.changeCounter = res.data.data.changeCounter;
            });
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
                data: vm.data,
                title: "Stammdata"
            }
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openComponentModal('editStammdata', obj).then((data) => {

                if (vm.data.length > 0) {
                    var newIdx = vm.data[vm.data.length - 1].id; // we need to learn vm.data.length for detect last added items
                }

                vm.data.splice(0, vm.data.length);

                for(let stat of data)
                    vm.data.push(stat);

                if (typeof newIdx !== 'undefined') {
                    vm.uploadObjects.newAdded = [];
                    vm.uploadObjects.lastAdded = data.filter(item => item.id > newIdx ) // find last added items by original list element count
                } else {
                    vm.uploadObjects.newAdded = data.filter(item => item !== 'deleted');
                }
                
                vm.uploadObjects.edited = data.filter(item => item.editMode === false)// find edited items 

                vm.uploadObjects.deleted = data.deleted; // assign deleted items

                $http.post(`${$rootScope.ip}editStammdata`, vm.uploadObjects).then((res) => {

                    vm.data = res.data.customers.sources;
                    vm.uploadObjects.changeCounter = res.data.changeCounter;
                    if (res.success === 'ok') {
                        
                    } else {
                        
                    }

                });

                console.log("Modal closed, vm.uploads now = ", vm.data)
            });
        }
    }
})();