(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('PartnerFormController', PartnerFormController);

        PartnerFormController.$inject = ['$location', '$rootScope', '$http'];
    function PartnerFormController($location, $rootScope, $http) {
        var vm = this;

        var partnerFormHandler = new PartnerFormHandler($http, 'partnerForm');

        vm.register = register;

        function register() {
            console.log('====================================');
            console.log('partner info', vm.partner);
            console.log('====================================');

            vm.dataLoading = true;

            partnerFormHandler.postData(vm.partner).then(
                (res) => {
                    $rootScope.sharedService.alert('Success', "success");
                    $location.path('/dashboard');
                },
                (err) => {
                    $rootScope.sharedService.alert('Maybe little some errors!', "danger");
                }
            );
        }
    }
})();