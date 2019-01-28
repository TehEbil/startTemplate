(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProjectDataDocumentController', ProjectDataDocumentController);

        ProjectDataDocumentController.$inject = ['$scope', '$rootScope', '$timeout', 'Upload', 'getId'];

	/* @ngInject */
	function ProjectDataDocumentController($scope, $rootScope, $timeout, Upload, getId) {
		console.log("ProjectDataDocumentController loaded");

        //getId is the parameterObject from the Modal, passed in openMenuModal() as fourth param.

        var vm = this;

        vm.closeModal = closeModal;
        vm.submitUpload = submitUpload;
        vm.submitModal = submitModal;
        vm.documents = [];
        vm.dynamic = -1;
        vm.docName = '';
		$scope.state = true;

        init();

        function init() {
            if(getId) 
            vm.baseDocuments = getId.data;
            vm.documents = angular.copy(vm.baseDocuments);

            console.log('====================================');
            console.log(getId.data);
            console.log('====================================');
        }

        function submitUpload() {

            if (vm.files) {
                upload(vm.files);
            }
            else {
                var upload = {
                    'id': helperFuncs.maxId(vm.documents) + 1, 
                    'name': vm.docName,
                    'isDisplay': false
                };

                vm.documents.push(upload);
            }

            submitModal();
        }

        function submitModal() {
            vm.baseDocuments = vm.documents;
            let obj = {
                data: vm.baseDocuments,
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
            }).then(function (resp) {

                var upload = {
                    'id': helperFuncs.maxId(vm.documents) + 1, 
                    'name': vm.docName,
                    'isDisplay': false,
                    'document': {
                        'filename': resp.data.filename, 
                        'filepath': resp.data.filepath, 
                        'oldfilename': resp.data.oldfilename, 
                        'refName': resp.data.refName,
                        'date': new Date(),
                        'editMode': false,
                    }
                };

                vm.documents.push(upload);

                if(getId.callback)
                    getId.callback(upload);

                $timeout(() => {
                    vm.dynamic = 101;
                }, 250);

            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.dynamic = progressPercentage;
            });
            // vm.files = undefined;
        }

        function closeModal() {
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                $scope.$close({type: 'decline'});
            });
        }
    }
})();
