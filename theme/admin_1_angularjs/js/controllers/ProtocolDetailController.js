(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', 'getId', 'modalService', 'BaseDataHandler'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, getId, modalService, BaseDataHandler) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.setSelected = setSelected;
        vm.ondelete = ondelete;
        vm.deleteDocument = deleteDocument;
        vm.newDocument = newDocument;
        vm.checkAll = checkAll;

        vm.selectAllAdd = false;
        vm.selectAllShortInfo = false;
        vm.selectAllAddJustName = false;
        vm.selectAllAddAsAttachment = false;
        vm.newItem = false;

        vm.protocols = [];
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
            vm.baseDetections = getId.detail.detections;
            vm.selectedIdx = getId.detail.selectedIdx;

            if (vm.selectedIdx === -1) { // new item
                vm.protocols = angular.copy(vm.untouched);    
                vm.protocol = {
                    id: vm.protocols[vm.protocols.length - 1].id + 1,
                    isLocalInspection: true,
                    localInspectionDate: new Date().toISOString(),
                    protocolType: "",
                    participants: "",
                    tempreture: "",
                    weather: "",
                    particularties: "",
                    reportDate: new Date().toISOString(),
                    projectType: {},
                    constructionState: {},
                    acceptance: {},
                    acceptanceComment: "",
                    note: "",
                    selectedDetection: "",
                    titlePicUrl: "https://picsum.photos/100/100/?random",
                    date: new Date().toISOString(),
                    members: "",
                    selectedDetections: [],
                    documents: [],
                };
            } else {
                vm.protocol = angular.copy(vm.untouched);
            }

            vm.detections = angular.copy(vm.baseDetections); 
            
            console.log('====================================');
            console.log(vm.protocol);
            console.log(vm.detections);
            console.log('====================================');
            vm.protocol.date = new Date(vm.protocol.date);
            vm.protocol.reportDate = new Date(vm.protocol.reportDate);

            getConstructionStates();
            getAcceptances();
            getProjectTypes();
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
            modalService.openMenuModal('views/form_upload.html', 'ProtocolDocumentUploadController', 'animated zoomIn', obj).then(() => {
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
        
        function checkAll(elements, state, field) {
            if (elements === 'detections') {
                if ( !state ) {
                    vm.detections.map( d => d[field] = true );
                } else {
                    vm.detections.map( d => d[field] = false );
                }
            } else if(elements === 'documents') {
                if ( !state ) {
                    vm.protocol.documents.map( d => d[field] = true );
                } else {
                    vm.protocol.documents.map( d => d[field] = false );
                }
            }
        }
            
        

        function ondelete() {
            vm.protocol.splice(vm.selectedDocumentIdx, 1);
            $rootScope.sharedService.alert('File has been deleted', 'success');
        }

        function closeModal() {
            if (angular.equals(angular.toJson(vm.untouched), angular.toJson(vm.protocol))) {
                $scope.$close();
            } else {
                $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                    $scope.$close({
                        data: vm.newItem,
                        type: 'decline'
                    });
                });
            }
        }

        function submitForm() {
            if (angular.equals(angular.toJson(vm.untouched), angular.toJson(vm.protocol))) {
                $scope.$close();
            } else { 
                console.log('====================================');
                console.log('Base Detections', vm.baseDetections);
                console.log('Detections', vm.detections);
                console.log('====================================');
                vm.baseDetections = vm.detections;
                
                let obj = {
                    data: vm.protocol,
                    type: 'success',
                    detections: vm.baseDetections
                };
                $scope.$close(obj);    
            }
        }

        function getConstructionStates() {
            BaseDataHandler.getData('bautenstand').then((res) => {
                vm.constructionStates = res.data;
            });
        }

        function getProjectTypes() {
            BaseDataHandler.getData('artDesVorhabens').then((res) => {
                vm.projectTypes = res.data;
            });
        }

        function getAcceptances() {
            BaseDataHandler.getData('abnahme').then((res) => {
                vm.acceptances = res.data;
            });
        }
}
})();