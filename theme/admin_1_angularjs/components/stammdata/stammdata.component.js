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
            deleted: []
        };
        
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        init();

        function init() {
            $http.get(`${$rootScope.ip}stammDaten`).then((res) => {
                vm.data = res.data
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

                console.log('====================================');
                console.log('first coming data ', data);
                console.log('====================================');

                var newIdx = vm.data[vm.data.length - 1].id; // we need to learn vm.data.length for detect last added items

                console.log('====================================');
                console.log('newIdx', newIdx);
                console.log('====================================');

                vm.data.splice(0, vm.data.length);

                for(let stat of data)
                    vm.data.push(stat);

                vm.uploadObjects.lastAdded = data.filter((item) => { // find last added items by original list element count
                    return item.id > newIdx;
                })

                vm.uploadObjects.edited = data.filter((item) => { // find edited items 
                    return item.editMode === false;
                })

                vm.uploadObjects.deleted = data.deleted; // assign deleted items

                console.log('====================================');
                console.log('data to be sent', vm.uploadObjects);
                console.log('====================================');

                $http.post(`${$rootScope.ip}editStammdata`, vm.uploadObjects).then((res) => {
                    $http.get(`${$rootScope.ip}stammDaten`).then((res) => {
                        vm.data = res.data
                  });
                });

                console.log("Modal closed, vm.uploads now = ", vm.data)
            });
        }
    }
})();