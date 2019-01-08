(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', 'getId'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, getId) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.projectTypes = globalData.artDesVorhabens;
        vm.constructionStates = globalData.bautenstand;
        vm.acceptances = globalData.abnahme;
        vm.setSelected = setSelected;
        vm.ondelete = ondelete;

        vm.protocol = {};
        vm.selectedIdx = -1;

        vm.selectedDocument = {};
        vm.selectedDocumentIdx = -1;

        vm.selectedDetection = {};
        vm.selectedDetectionIdx = -1;
        



        $scope.tabs = [
            'NewProtocol',
            'ChoosingDetections',
            'Documents'
    	];

        vm.tabs = $scope.tabs;

        init();

        function init() {
            vm.protocol = getId.data;
            vm.selectedIdx = getId.detail.selectedIdx;
            
            console.log('====================================');
            console.log(vm.protocol);
            console.log('====================================');
        }

        $scope.selectedTab = $scope.tabs[0];
    	$scope.setSelectedTab = function(tab) {
			$scope.selectedTab = tab;

        };
        
        function setSelected(field, idx, obj) {
            console.log('====================================');
            console.log('selected', obj);
            console.log('====================================');
            if (field === 'document') {
                vm.selectedDocument = obj;
                vm.selectedDocumentIdx = idx;   
            } else if (field === 'detection') {
                vm.selectedDetection = obj;
                vm.selectedDetectionIdx = idx;
            }
        }

        function ondelete() {
            vm.protocol.splice(vm.selectedDocumentIdx, 1);
            $rootScope.sharedService.alert('File has been deleted', 'success');
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close(vm.protocol);
        }
}
})();