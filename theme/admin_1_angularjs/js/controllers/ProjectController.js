(function() {
    'use strict';
    
	angular
	.module('MetronicApp')
	.controller('ProjectController', ProjectController);

	ProjectController.$inject = ['$rootScope', '$scope', '$state', 'modalService'];

	/* @ngInject */
	function ProjectController($rootScope, $scope, $state, modalService) {
		var vm = this;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.setSelectedTab = setSelectedTab;
        vm.createNewProject = createNewProject;

        init();

        function init() {
            $scope.tabs = [
                'Auftragsdaten',
                'Projektdaten',
                'Feststellungen',
                'Protokolle',
            ];

            vm.tabs = $scope.tabs;
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }

        function createNewProject() {
            modalService.openMenuModal('views/project.html', 'ProjectController', 'animated zoomIn');
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