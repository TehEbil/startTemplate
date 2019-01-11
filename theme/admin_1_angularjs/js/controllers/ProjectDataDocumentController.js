(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProjectDataDocumentController', ProjectDataDocumentController);

        ProjectDataDocumentController.$inject = ['$scope', 'getId'];

	/* @ngInject */
	function ProjectDataDocumentController($scope, getId) {
		console.log("ProjectDataDocumentController loaded");

        //getId is the parameterObject from the Modal, passed in openMenuModal() as fourth param.

        var vm = this;

        vm.closeModal = closeModal;
        vm.submitUpload = submitUpload;
        vm.submitModal = submitModal;
        vm.documents = [];
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
            vm.documents.push({
                id: helperFuncs.maxId(vm.documents) + 1,
                name: vm.docName
            });

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

        function closeModal() {
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                $scope.$close({type: 'decline'});
            });
        }
    }
})();
