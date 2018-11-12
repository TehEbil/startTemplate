(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpStatistics', {
            bindings: {
                data: '=',
                label: '=',
                ngModel: '=',
                edit: '&',
                makeDisabled: '=',
                hide: '='
            },
            controller: StatisticsController,
            controllerAs: 'vm',
            templateUrl: '/components/statistics/statistics.template.html'
        });

    StatisticsController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService"];

    /* @ngInject */
    function StatisticsController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService) {
        var vm = this;
        vm.title = 'StatisticsController';

        vm.isMobile = isMobile.any;
        vm.allData = {};
        vm.anfragen = {};

        vm.statistics = {  
            "stornoRate":{  
                "val":46.04,
                "avg":35.03,
                "len":126,
                "pos":85
            },
            "totalSales":{  
                "val":39057.35,
                "avg":10565.46,
                "len":126,
                "pos":6
            },
            "salesPerAnfrage":{  
                "val":147.39,
                "avg":116.15,
                "len":126,
                "pos":39
            },
            "salesPerAuftrag":{  
                "val":361.64,
                "avg":432.59,
                "len":126,
                "pos":80
            },
            "rejected":{  
                "val":9,
                "avg":3.03,
                "len":126,
                "pos":11
            }
        }

        init();

        function init() {
        }
    }
})();