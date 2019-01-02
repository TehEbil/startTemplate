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

        vm.newDocument = function () {
            var obj = {
              uploads: vm.baseData.projectDatas.documents,
              callback: vm.onsave
            };
            if(vm.uploadtype)
              obj['uploadtype'] = vm.uploadtype;

            obj.single = true;

            // console.log(obj);
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then(() => {
                if(vm.disablesub && vm.uploadsLen < vm.uploads.length)
                    vm.disablesub = false;
            });
        };

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();