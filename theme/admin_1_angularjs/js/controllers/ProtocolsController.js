(function() {
    'use strict';
    
	angular
	.module('MetronicApp')
	.controller('ProtocolsController', ProtocolsController);

	ProtocolsController.$inject = ['$rootScope', '$scope', '$state', 'modalService'];

	/* @ngInject */
	function ProtocolsController($rootScope, $scope, $state, modalService) {
		var vm = this;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.setSelectedTab = setSelectedTab;
        vm.createNewProject = createNewProject;

    	vm.tabs = [
	    	'Adresse',
	    	'Ansprechpartner',
	    	'Anschriften',
	    	'Objekt',
	    	// 'Konditionen',
	    	// 'Vorgaben',
	    	'Statistik',
	    	'Indiv. Felder',
	    	'Dokumente'
    	];

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }

        function createNewProject() {
            modalService.openMenuModal('views/project.html', 'ProjectController', 'animated zoomIn')
        }

    	vm.selectedTab = vm.tabs[0];
        
        
        function setSelectedTab(tab) {
			vm.selectedTab = tab;
    	}
    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
    	$rootScope.settings.layout.pageBodySolid = false;
    	$rootScope.settings.layout.pageSidebarClosed = false;
    }

})();