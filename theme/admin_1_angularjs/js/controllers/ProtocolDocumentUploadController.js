(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDocumentUploadController', ProtocolDocumentUploadController);

        ProtocolDocumentUploadController.$inject = ['$rootScope', '$scope', 'Upload', '$timeout', 'getId'];

	/* @ngInject */
	function ProtocolDocumentUploadController($rootScope, $scope, Upload, $timeout, getId) {
		console.log("ProtocolDocumentUploadController loaded");

        //getId is the parameterObject from the Modal, passed in openMenuModal() as fourth param.

        var vm = this;
		vm.submitted = false;
        vm.closeModal = closeModal;
        vm.submitUpload = submitUpload;
        vm.dynamic = -1;
        vm.uploads = [];
		$scope.state = true;

        if(getId) 
            vm.uploads = getId.uploads;

        function submitUpload() {
            if (vm.files) {
                upload(vm.files);
            }
            else {
                $rootScope.sharedService.alert("File too big or invalid.");
            }
        }

        // upload on file select or drop
        function upload(files) {
            vm.dynamic = 0;

            Upload.upload({
                url: $rootScope.ip + 'uploadDoc',
                data: {file: files, name: vm.docName}
            }).then(function (resp) {

                var upload = {
                    'id': resp.data.id, 
                    'filename': resp.data.filename, 
                    'filepath': resp.data.filepath, 
                    'oldfilename': resp.data.oldfilename, 
                    'refName': resp.data.refName,
                    'date': new Date(),
                    'editMode': false,
                    'isAddJustName': false,
                    'isAddAttachment': false
                };

                vm.uploads.push(upload);

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

        function closeModal(close = false) {
            $scope.$close("HelloTestReturnValue");
            /*
            $scope.sharedService.showConfirmDialog()
                .then(() => {
                    $scope.$close();
            });
            */
        }
    }
})();
