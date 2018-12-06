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
 
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        init();

        function init() {
            $http.get(`${$rootScope.ip}stammDaten`).then((res) => {
                vm.data = res.data
                console.log(vm.data);
                console.log(res);
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

                vm.lastAdded = []; // we need an empty Object for last added items 

                var count = vm.data.length; // we need to learn vm.data.length for detect last added items

                vm.data.splice(0, vm.data.length);

                for(let stat of data)
                    vm.data.push(stat);

                vm.lastAdded = data.filter((item) => { // find last added items by original list element count
                    return item.id > count;
                })

                $http.post(`${$rootScope.ip}editStammdata`, vm.lastAdded).then((res) => {
                    console.log(res)
                });

                console.log("Modal closed, vm.uploads now = ", vm.data)
            });
        }
    }
})();