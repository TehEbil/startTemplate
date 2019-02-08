(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProjectDataDocumentController', ProjectDataDocumentController);

        ProjectDataDocumentController.$inject = ['$scope', '$rootScope', '$timeout', 'Upload', 'getId', 'ProjectHandler'];

	/* @ngInject */
	function ProjectDataDocumentController($scope, $rootScope, $timeout, Upload, getId, ProjectHandler) {

        var vm = this;

        vm.closeModal = closeModal;
        vm.submitUpload = submitUpload;
        // vm.submitModal = submitModal;
        // vm.initObject = initObject;

        vm.documents = [];
        vm.dynamic = -1;
        vm.docName = '';
        vm.upload = upload;
        vm.isDisplay = false;

        vm.resObj = {
            data: undefined,
            detail: {}
        };

        vm.uploadObject = {
            id: 0, 
            name: '',
            isDisplay: false,
            document: {
                filename: '', 
                filepath: '', 
                oldfilename: '', 
                refName: '',
                date: new Date(),
                editMode: false,
            }
        };

		$scope.state = true;

        init();

        function init() {

            if(typeof getId !== 'undefined') { // add new document
                vm.baseDocuments = getId.data;
                vm.documents = angular.copy(vm.baseDocuments);
                vm.isNew = getId.detail.isNew;
            } 
            if(!vm.isNew){ // edit a document
                vm.uploadObject = vm.documents.filter(f => f.id === getId.detail.selectedId)[0];
                vm.docName = vm.uploadObject.name;
                vm.isDisplay = vm.uploadObject.isDisplay;
                vm.files = new Image();
                vm.files.src = '../../../tmpJsonServer/public/uploads/bau-logo.jpg';

                console.log('====================================');
                console.log(vm.uploadObject);
                console.log('====================================');
            } else {
                return;
            }

            
        }

        function submitUpload() {

            if (vm.files) {
                upload(vm.files);
            } else {
                initBaseDocumentInfos();
                vm.uploadObject.documents = undefined;
                vm.documents.push(vm.uploadObject);
            }

            let obj = {
                data: vm.documents,
                detail: {},
                type: 'success'
            };

            $scope.$close(obj);
        }

        // upload on file select or drop
        function upload(files) {
            vm.dynamic = 0;

            Upload.upload({
                url: $rootScope.ip + 'uploadDoc',
                data: {file: files, name: vm.docName}
            }).then(function (res) {
                // res = updated file infos came with response

                vm.uploadObject.document = res.data;
                initBaseDocumentInfos();

                vm.documents.push(vm.uploadObject);

            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.dynamic = progressPercentage;
            });
        }

        function initBaseDocumentInfos() {
            vm.uploadObject.id = helperFuncs.maxId(vm.documents) + 1;
            vm.uploadObject.name = vm.docName;
            vm.uploadObject.isDisplay = vm.isDisplay;
        }

        function closeModal() {
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                $scope.$close({type: 'decline'});
            });
        }
    }
})();
