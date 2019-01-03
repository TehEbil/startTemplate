
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

        vm.baseData = {};

        init();

        function init() {
            vm.baseData = passDataService.getObj();
            vm.order = vm.baseData.orderDatas;
            console.log('====================================');
            console.log('order datas', vm.order);
            console.log('====================================');
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();