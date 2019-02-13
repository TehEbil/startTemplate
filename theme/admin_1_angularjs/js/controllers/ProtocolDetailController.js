(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', 'getId', 'modalService', 'BaseDataHandler', 'ProjectHandler'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, getId, modalService, BaseDataHandler, ProjectHandler) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.setSelected = setSelected;
        vm.ondelete = ondelete;
        // vm.deleteDocument = deleteDocument;
        // vm.newDocument = newDocument;
        vm.checkAll = checkAll;
        vm.openBaseDataModel = openBaseDataModel;
        vm.getBaseDataValueById = getBaseDataValueById;

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
            vm.projectId = getId.detail.projectId;

            ProjectHandler.getData(`${vm.projectId}/documents`).then((res) => {
                if (vm.selectedIdx === -1) { // new item
                    vm.protocols = angular.copy(vm.untouched);    
                    
                    vm.protocol = {
                        id: helperFuncs.maxId(vm.protocols) + 1,
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
                        documents: res.data,
                    };
                } else {
                    console.log('====================================');
                    console.log(res.data);
                    console.log('====================================');
                    vm.protocol = angular.copy(vm.untouched);
                    vm.protocol.documents = res.data;
                }        
                
                vm.detections = angular.copy(vm.baseDetections); 
                vm.protocol.date = new Date(vm.protocol.date);
                vm.protocol.reportDate = new Date(vm.protocol.reportDate);
            });

            getBaseDatas(['bautenstand', 'detectionStatus', 'abnahme', 'beurteilungen', 'prüffeld']);
        }

        $scope.selectedTab = $scope.tabs[0];
    	$scope.setSelectedTab = function(tab) {
			$scope.selectedTab = tab;

        };
        
        function setSelected(field, idx, obj) {
            if (field === 'document') {
                vm.selectedDocument = obj;
                vm.selectedDocumentIdx = idx;   
            } else if (field === 'detection') {
                vm.selectedDetection = obj;
                vm.selectedDetectionIdx = idx;
            }
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

        function getBaseDataValueById(id, type) {
            let value = '';
            if(type === 'bautenstand') {
                value = vm.constructionStates.filter(f => f.id === id);
            } else if (type === 'beurteilung' && typeof vm.evaluations !== 'undefined') {
                value = vm.evaluations.filter(f => f.id === id);
            } else if (type === 'prüffeld' && typeof vm.testFields !== 'undefined') {
                value = vm.testFields.filter(f => f.id === id);
            } else if (type === 'detectionStatus' && typeof vm.statuses !== 'undefined') {
                value = vm.statuses.filter(f => f.id === id);
            }
            if (typeof value[0] !== 'undefined') {
                return value[0].value;    
            }
        }

        function getBaseDatas(baseDatas) {
            BaseDataHandler.getData().then((res) => {
                for (const baseData of baseDatas) { 
                    if (baseData === 'bautenstand') {
                        vm.constructionStates = res.data[baseData].data;
                    } else if (baseData === 'detectionStatus') {
                        vm.projectTypes = res.data[baseData].data;
                    } else if (baseData === 'abnahme') {
                        vm.acceptances = res.data[baseData].data;
                    } else if (baseData === 'prüffeld') {
                        vm.testFields = res.data.prüffeld.data;
                    } else if (baseData === 'beurteilungen') {
                        vm.evaluations = res.data.beurteilungen.data;
                    } else if (baseData === 'detectionStatus') {
                        vm.statuses = res.data.detectionStatus.data;    
                    }
                }
            });    
        }

        function openBaseDataModel(route, data) {
            var obj = {
                data: data,
                title: route
            };
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openComponentModal('editStammdata', obj).then((data) => {

                // this is so we don't send a request when we "cancel" modal
                if(typeof data ===  "undefined")
                    return;

                var obj = {
                    data, // same as data: data -> because key and value is the same
                    changedCounter: vm.baseData.changedCounter
                };

                console.log('====================================');
                console.log('changed baseData => ', obj);
                console.log('====================================');

                BaseDataHandler.updateData(vm.route, obj).then(
                    (res) => {
                        getBaseDatas();
                    },
                    (err) => {
                        $rootScope.sharedService.alert('data has been changed!', "danger");
                    }
                );

                console.log("Modal closed, vm.uploads now = ", vm.baseData);
            });
        }
}
})();