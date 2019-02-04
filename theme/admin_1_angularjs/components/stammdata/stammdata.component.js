(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpStammdata', {
            bindings: {
                data: '=',
                save: '=',
                route: '@'
            },
            controller: StammdataController,
            controllerAs: 'vm',
            templateUrl: '/components/stammdata/stammdata.template.html'
        });

    StammdataController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService", "BaseDataHandler"];

    /* @ngInject */
    function StammdataController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService, BaseDataHandler) {

        var vm = this;
        vm.state = true;
        vm.baseData = {
            data: '',
            changedCounter: 0
        };
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        function init() {
            BaseDataHandler.getData().then((res) => {
                vm.baseData.data = res.data[vm.route].data;
                vm.baseData.changedCounter = res.data[vm.route].changedCounter;
            });
        }

        vm.$onInit = () => {
            init();
        };

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
                title: vm.route
            };
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openComponentModal('editStammdata', obj).then((data) => {

                // this is so we don't send a request when we "cancel" modal
                if(typeof data ===  "undefined")
                    return;

                var obj = {
                    data, // same as data: data -> because key and value is the same
                    changedCounter: vm.baseData.changedCounter
                };

                console.log('====================================');
                console.log('changed baseData => ', obj);
                console.log('====================================');

                BaseDataHandler.updateData(vm.route, obj).then(
                    (res) => {
                        // vm.baseData.data = res.data.data;

                        // fixed changedCounter issue and wrapped them together like in init
                        vm.baseData.data = res.data.data;
                    },
                    (err) => {
                        $rootScope.sharedService.alert('data has been changed!', "danger");
                    }
                );
            });
        }
    }
})();