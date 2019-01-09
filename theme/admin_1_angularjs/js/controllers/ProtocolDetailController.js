(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', 'getId', 'modalService'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, getId, modalService) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.projectTypes = globalData.artDesVorhabens;
        vm.constructionStates = globalData.bautenstand;
        vm.acceptances = globalData.abnahme;
        vm.setSelected = setSelected;
        vm.ondelete = ondelete;
        vm.deleteDocument = deleteDocument;
        vm.newDocument = newDocument;

        vm.protocol = {};
        vm.selectedIdx = -1;

        vm.selectedDocument = {};
        vm.selectedDocumentIdx = -1;

        vm.selectedDetection = {};
        vm.selectedDetectionIdx = -1;
        



        $scope.tabs = [
            'NewProtocol',
            'ChoosingDetections',
            'Documents'
    	];

        vm.tabs = $scope.tabs;

        init();

        function init() {
            vm.untouched = getId.data;
            vm.protocol = angular.copy(vm.untouched);
            vm.selectedIdx = getId.detail.selectedIdx;
            
            console.log('====================================');
            console.log(vm.protocol);
            console.log('====================================');
        }

        $scope.selectedTab = $scope.tabs[0];
    	$scope.setSelectedTab = function(tab) {
			$scope.selectedTab = tab;

        };
        
        function setSelected(field, idx, obj) {
            console.log('====================================');
            console.log('selected', obj);
            console.log('====================================');
            if (field === 'document') {
                vm.selectedDocument = obj;
                vm.selectedDocumentIdx = idx;   
            } else if (field === 'detection') {
                vm.selectedDetection = obj;
                vm.selectedDetectionIdx = idx;
            }
        }

        function deleteDocument (id = -1) {

            if(id == -1)
                return console.error("Fehler bei deleteEntry");

            var idx = getIndex(id);
            $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                if (vm.ondelete)
                    vm.ondelete(vm.protocol.documents[idx].id);
            });
        }

        function newDocument() {
            var obj = {
              uploads: vm.protocol.documents,
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

        function getIndex(id) {
            if(id === -1)
                return $rootScope.sharedService.alert("ID not set", "danger");

            if(vm.protocol.documents && vm.protocol.documents.length <= 0)
                return $rootScope.sharedService.alert("No items", "danger");
             
            var idx = vm.protocol.documents.findIndex(o => o.id === id);
            if(idx < 0)  
                return $rootScope.sharedService.alert("ID not found", "danger");

            return idx;
		}

        function ondelete() {
            vm.protocol.splice(vm.selectedDocumentIdx, 1);
            $rootScope.sharedService.alert('File has been deleted', 'success');
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            console.log('====================================');
            console.log('sended protocol', vm.protocol);
            console.log('====================================');
            let obj = {
                data: vm.protocol,
                type: 'success'
            }
            $scope.$close(obj);
        }
}
})();