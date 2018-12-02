(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpStammdata', {
            bindings: {
                data: '='
            },
            controller: StammdataController,
            controllerAs: 'vm',
            templateUrl: '/components/stammdata/stammdata.template.html'
        });

    StammdataController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService"];

    /* @ngInject */
    function StammdataController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService) {

        var vm = this;
        $scope.state = true;
 
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        init();

        function init() {
            console.log("hi");
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
                vm.data.splice(0, vm.data.length);

                for(let stat of data)
                    vm.data.push(stat);
                
                console.log("Modal closed, vm.uploads now = ", vm.uploads)
            });
        }
    }
})();