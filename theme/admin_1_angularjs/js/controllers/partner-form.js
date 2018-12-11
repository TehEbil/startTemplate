(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('PartnerFormController', PartnerFormController);

        PartnerFormController.$inject = ['PersonelFormService', '$location', '$rootScope'];
    function PartnerFormController(PersonelFormService, $location, $rootScope) {
        var vm = this;

        vm.register = register;

        function register() {
            console.log('====================================');
            console.log('user info', vm.user);
            console.log('====================================');
            // vm.dataLoading = true;
            // PersonelFormService.Create(vm.user)
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