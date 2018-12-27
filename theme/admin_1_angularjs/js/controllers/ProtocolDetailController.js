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

        vm.protocol = {
            id: 0,
            isLocalInspection: true,
            localInspectionDate: "",
            participants: "",
            temperature: "",
            weather: "",
            particularties: "",
            reportDate: "",
            projectType: {
                id: "02",
                name: "Änderung ( Umbau / Nutzungsänderung )"
            },
            constructionState: {
                id: "04",
                name: "Rohinstallation der Heizungsanlagen"
            },
            acceptance: {
                id: "2",
                name: "Abnahme kann mit Vorbehalten erteilt werden, siehe nachstehende Begründung"
            },
            acceptanceComment: "",
            note: "",
            selectedDetection: "",
            titlePicUrl: ""
        };

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