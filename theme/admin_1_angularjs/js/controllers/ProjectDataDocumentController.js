(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProjectDataDocumentController', ProjectDataDocumentController);

        ProjectDataDocumentController.$inject = ['$scope', '$rootScope', '$timeout', 'Upload', 'getId'];

	/* @ngInject */
	function ProjectDataDocumentController($scope, $rootScope, $timeout, Upload, getId) {

        var vm = this;

        vm.closeModal = closeModal;
        vm.submitUpload = submitUpload;
        vm.submitModal = submitModal;
        vm.initObject = initObject;

        vm.documents = [];
        vm.dynamic = -1;
        vm.docName = '';
        vm.upload = upload;
        vm.isDisplay = false;

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

            if(typeof getId !== 'undefined' && getId.detail.isNew) { // add new document
                vm.baseDocuments = getId.data;
                vm.documents = angular.copy(vm.baseDocuments);
                console.log('====================================');
                console.log(getId);
                console.log('====================================');

            } else if(typeof getId !== 'undefined' && !getId.detail.isNew){ // edit a document
                console.log('====================================');
                console.log(getId);
                console.log('====================================');
            } else {
                return;
            }

            vm.isNew = getId.detail.isNew;
        }

        function submitUpload() {

            if (vm.isNew) {
                if (vm.files) {
                    vm.upload(vm.files);
                } else {
                    vm.uploadObject.id = helperFuncs.maxId(vm.documents) + 1;
                    vm.uploadObject.bane = vm.docName;
                    vm.uploadObject.isDisplay = vm.isDisplay;
                }    
            } else {

            }

            
            // else {
            //     var upload = {
            //         'id': helperFuncs.maxId(vm.documents) + 1, 
            //         'name': vm.docName,
            //         'isDisplay': false
            //     };

            //     vm.documents.push(upload);
            // }

            submitModal();
        }

        function submitModal() {

            let obj = {
                data: vm.baseDocuments,
                type: 'success'
            };

            if (vm.isNew) {
                // add new element
                vm.baseDocuments = vm.documents;
                obj = {
                    data: vm.baseDocuments,
                    type: 'success'
                };
            } else {
                // edit a document
             }

            
            $scope.$close(obj);
        }

        // upload on file select or drop
        function upload(files) {
            vm.dynamic = 0;

            Upload.upload({
                url: $rootScope.ip + 'uploadDoc',
                data: {file: files, name: vm.docName}
            }).then(function (res) {
            
                initObject(res);

                vm.documents.push(vm.uploadObject);

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
        }

        function initObject(res) {
            vm.uploadObject.id = helperFuncs.maxId(vm.documents) + 1;
            vm.uploadObject.name = vm.docName;
            vm.uploadObject.isDisplay = vm.isDisplay;
            vm.uploadObject.document.filename = res.data.filename;
            vm.uploadObject.document.filepath = res.data.filepath;
            vm.uploadObject.document.oldfilename = res.data.oldfilename;
            vm.uploadObject.document.refName = res.data.refName;
            vm.uploadObject.document.date = new Date();
            vm.uploadObject.document.editMode = false;
        }

        function closeModal() {
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                $scope.$close({type: 'decline'});
            });
        }
    }
})();
