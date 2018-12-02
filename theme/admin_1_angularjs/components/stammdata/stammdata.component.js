(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpStammdata', {
            bindings: {
                data: '=',
                label: '=',
                edit: '&'
            },
            controller: StatisticsController,
            controllerAs: 'vm',
            templateUrl: '/components/stammdata/stammdata.template.html'
        });

    StammdataController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService", "getId"];

    /* @ngInject */
    function StammdataController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService, getId) {

        var vm = this;
        $scope.state = true;
 
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        init();

        function init() {

        }

        function onsave(item) {
            console.log("saved");
        }

        function ondelete(item) {
            console.log("saved");
        }

        function editData() {
            var obj = {
                data: vm.data,
                callback: onsave
            }
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then((data) => {
                /* vm.uploads has to be saved to the data (e.g. customer) it belongs to */
                console.log("Modal closed, vm.uploads now = ", vm.uploads)
            });
        }
    }
})();