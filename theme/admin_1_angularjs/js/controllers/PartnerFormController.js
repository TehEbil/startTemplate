(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('PartnerFormController', PartnerFormController);

        PartnerFormController.$inject = ['PartnerFormService', '$location', '$rootScope'];
    function PartnerFormController(PartnerFormService, $location, $rootScope) {
        var vm = this;

        vm.register = register;

        function register() {
            console.log('====================================');
            console.log('partner info', vm.partner);
            console.log('====================================');
            // vm.dataLoading = true;
            // PersonelFormService.Create(vm.partner)
            //     .then(function (response) {
            //         if (response.success) {
            //             FlashService.Success('Registration successful', true);
            //             $location.path('/dashboard');
            //         } else {
            //             FlashService.Error(response.message);
            //             vm.dataLoading = false;
            //         }
            //     });
        }
    }

})();