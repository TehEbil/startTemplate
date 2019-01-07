(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'getId'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, getId) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.projectTypes = globalData.artDesVorhabens;
        vm.constructionStates = globalData.bautenstand;
        vm.acceptances = globalData.abnahme;

        vm.protocols = [];
        vm.selectedProtocol = {};
        vm.selectedIdx = 0;
        vm.count = 0;

        $scope.tabs = [
            'NewProtocol',
            'ChoosingDetections',
            'Documents'
    	];

        vm.tabs = $scope.tabs;

        init();

        function init() {
            vm.protocols = getId.data;
            vm.selectedIdx = getId.selectedIdx;
            vm.count = getId.count;

            if (vm.selectedIdx === -1) {
                vm.selectedProtocol = vm.protocols[vm.count - 1];
                vm.selectedIdx = vm.count - 1;
            } else {
                vm.selectedProtocol = vm.protocols[vm.selectedIdx];
            }
            console.log('====================================');
            console.log(vm.selectedProtocol);
            console.log('====================================');
        }

        $scope.selectedTab = $scope.tabs[0];
    	$scope.setSelectedTab = function(tab) {
			$scope.selectedTab = tab;

    	};

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close(vm.protocol);
        }
}
})();