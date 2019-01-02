(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProjectController', ProjectController);

        ProjectController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'passDataService', 'ProjectFilesHandler'];

	/* @ngInject */
	function ProjectController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, passDataService, ProjectFilesHandler) {
		// console.log("ProjectController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.baseData = passDataService.getObj();
        vm.baseData.projectDatas = {
            projectNumber: "BXP-PRN-001",
            projectName: "Project Name Field",
            ownPerformanceBuilder: "",
            documents: [
                
            ],
            intenalNotes: ""
        };  

        passDataService.setObj(vm.baseData);

        init();

        function init() {
            vm.project = passDataService.getObj().projectDatas;

            ProjectFilesHandler.getData('documents').then(
                (res) => {
                    vm.baseData.projectDatas.documents = res.data;
                }
            );

            // ProjectFilesHandler.(vm.partner).then(
            //     (res) => {
            //         $state.go('dashboard');
            //     },
            //     (err) => {
            //         $rootScope.sharedService.alert('Maybe little some errors!', "danger");
            //     }
            // );
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();