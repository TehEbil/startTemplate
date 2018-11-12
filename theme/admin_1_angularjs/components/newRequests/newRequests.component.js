(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpNewRequests', {
            bindings: {
                data: '=',
                label: '=',
                ngModel: '=',
                edit: '&',
                makeDisabled: '=',
                hide: '='
            },
            controller: NewRequestsController,
            controllerAs: 'vm',
            templateUrl: '/components/newRequests/newRequests.template.html'
        });

    NewRequestsController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService"];

    /* @ngInject */
    function NewRequestsController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService) {
        var vm = this;
        vm.title = 'NewRequestsController';

        init();

        function init() {
            $http.get($rootScope.ip + 'dashboard').then( ({data}) => {
                vm.todayAuftraege = data.todayAuftraege;
                vm.todayAuftraegeMonth = data.todayAuftraegeMonth;
            });
        }
    }
})();