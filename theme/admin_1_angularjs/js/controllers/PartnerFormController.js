(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('PartnerFormController', PartnerFormController);

        PartnerFormController.$inject = ['$location', '$rootScope', '$http', '$state', 'PartnerFormHandler'];
    function PartnerFormController($location, $rootScope, $http, $state, PartnerFormHandler) {
        var vm = this;

        vm.register = register;

        function register() {

            vm.dataLoading = true;

            PartnerFormHandler.postData(vm.partner).then(
                (res) => {
                    $state.go('dashboard');
                },
                (err) => {
                    $rootScope.sharedService.alert('Maybe little some errors!', "danger");
                }
            );
        }
    }
})();