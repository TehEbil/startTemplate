
(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('OrderController', OrderController);

        OrderController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'passDataService'];

	/* @ngInject */
	function OrderController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, passDataService) {
		// console.log("OrderController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.objectTypes = globalData.objektTypen;
        vm.orderTypes = globalData.auftragsart;

        vm.baseData = passDataService.getObj();
        vm.baseData.orderDatas = {
            customer: {
                customerNumber: "BXP-105",
                isCompany: "company",
                salutation: "Mr.",
                title: "Prof. Dr.",
                firstName: "Mahmut",
                lastName: "Akyol",
                companyName: "Compact Management",
                additive: "baubasis",
                address: {
                    route: "Mecidiyekoy st.",
                    country: {
                        name: 'Türkei',
                        code: 'TR'
                    },
                    postal_code: "34000",
                    locality: "Istanbul",
                },
                phone: "+90 212 212 12 12",
                mobile: "+90 553 364 04 74",
                email: "mahmut.akyol@bauexperts.de"
            },
            object: {
                objectNumber: 0,
                objectType: "Einfamilienhaus",
                address: {
                    route: "Mecidiyekoy st.",
                    country: {
                        name: 'Türkei',
                        code: 'TR'
                    },
                    postal_code: "34000",
                    locality: "Istanbul",
                }
            },
            otherInformations: {
                orderNumber: "BXP-ORD-0000-256",
                orderDate: "20.12.2018",
                referenceNumber: "BXP-REF-005",
                orderType: globalData.auftragsart[0]
            }
        };

        passDataService.setObj(vm.baseData);

        init();

        function init() {
            vm.order = passDataService.getObj().orderDatas;
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();