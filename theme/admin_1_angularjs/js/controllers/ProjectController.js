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
        vm.newDocument = newDocument;
        vm.deleteDocument = deleteDocument;
        vm.setSelected = setSelected;
        vm.onsave = onsave;
        vm.ondelete = ondelete;

        vm.selectedDocument = -1;

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

        function newDocument() {
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
        }

        function deleteDocument (id = -1) {

            if(id == -1)
                return console.error("Fehler bei deleteEntry");

            var idx = vm.baseData.projectDatas.documents.findIndex(o => o.id == id);
            $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                if (vm.ondelete)
                    vm.ondelete(vm.baseData.projectDatas.documents[idx].id);
            });
        }

        function setSelected(id) {
            vm.selectedDocument = id;
        }

        function onsave(file) {
            /* File Uploaded Callback */
            console.log("File has been uploaded: ", file);

            // $rootScope.sharedService.alert("File has been saved", "success");
        } 

        function ondelete(id) {
            /* File Deletion Callback */
            vm.baseData.projectDatas.documents.splice(vm.baseData.projectDatas.documents.findIndex(o => o.id == id), 1);
            $rootScope.sharedService.alert("File has been deleted", "success");
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();