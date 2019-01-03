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

        $scope.tabs = [
            'NewProtocol',
            'ChoosingDetections',
            'Documents'
    	];

        vm.tabs = $scope.tabs;

        init();

        function init() {
            vm.protocol = getId.data;
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