(function() {
	'use strict';

	angular
	.module('MetronicApp')
	.controller('FormProjektController', FormProjektController);

	FormProjektController.$inject = ['$rootScope', '$scope', '$state', 'getId', 'passDataService', 'ProjectHandler', 'modalService'];

	/* @ngInject */
	function FormProjektController($rootScope, $scope, $state, getId, passDataService, ProjectHandler, modalService) {
		var vm = this;
		vm.title = 'FormProjektController';
        vm.closeModal = closeModal;
		vm.submitForm = submitForm;
		vm.setSelected = setSelected;

		$scope.state = true; // so modal closes with ESC

        vm.untouched = getId.data;
		vm.baseData = angular.copy(vm.untouched);
		vm.subData = {
			data: {},
			detail: {}
		};

    	$scope.tabs = [
	    	'Auftragsdaten',
	    	'Projektdaten',
	    	'Feststellungen',
	    	'Protokolle'
    	];

		vm.tabs = $scope.tabs;
		
		//#region Project Detail Methods & Variables definitions
		vm.newDocument = newDocument;
		vm.deleteDocument = deleteDocument;
		vm.saveEntry = saveEntry;
		vm.editEntry = editEntry;
		vm.onsave = onsave;
		vm.ondelete = ondelete;

		vm.selectedDocument = {};
		//#endregion

		//#region Detections Methods & Variables definitions
		vm.addDetection = addDetection;
		vm.editDetection = editDetection;
		vm.deleteDetection = deleteDetection;

		vm.selectedDetection = {};
		vm.selectedDetectionIdx = -1;
		//#endregion 

		//#region Protocols Methods & Variables definitions
		vm.addProtocol = addProtocol;
		vm.editProtocol = editProtocol;
		vm.deleteProtocol = deleteProtocol;

		vm.selectedProtocol = {};
		vm.selectedProtocolIdx = -1;
		//#endregion

		init();
		vm.order = vm.baseData.orderDatas;
		vm.protocols = vm.baseData.protocolDatas;
		function init() {
			vm.tmpSelected = false;
			console.log('====================================');
			console.log('firsComming', vm.baseData);
			console.log('====================================');
		}

		//#region Project Detail Methods

		function newDocument() {
            var obj = {
              uploads: vm.baseData.documents,
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

            var idx = vm.baseData.documents.findIndex(o => o.id == id);
            $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                if (vm.ondelete)
                    vm.ondelete(vm.baseData.documents[idx].id);
            });
        }

        function onsave(file) {
            /* File Uploaded Callback */
            console.log("File has been uploaded: ", file);

            // $rootScope.sharedService.alert("File has been saved", "success");
        } 

        function ondelete(id) {
            /* File Deletion Callback */
            vm.baseData.documents.splice(vm.baseData.documents.findIndex(o => o.id == id), 1);
            $rootScope.sharedService.alert("File has been deleted", "success");
        }

        function saveEntry(id = -1) {
            var idx = getIndex(id);

            vm.baseData.documents[idx].editMode = false;
            vm.editStatus = false;

            console.log(typeof vm.onsave === "function");
            if(typeof vm.onsave === "function")
                vm.onsave();
        }

        function editEntry(id = -1) {
            var idx = getIndex(id);

            if(vm.tmpSelected !== false){ // another one is being editted, save it & close edit form
                vm.baseData.documents[vm.tmpSelected].editMode = false;
                vm.editStatus = false;

                if(typeof vm.onsave === "function")
                    vm.onsave(vm.baseData.documents[vm.tmpSelected]);
            }
            vm.tmpSelected = idx;
            // vm.tmpVar = angular.copy(vm.items[idx].value);
            vm.baseData.documents[idx].editMode = true;
            vm.editStatus = true;
		}

		//#endregion

		//#region Detections Methods 
		function addDetection() {
            vm.subData = {
                data: vm.baseData.detectionDatas,
                detail: {
					selectedIdx: -1
				}
            };
            vm.subData.data.push(
                {
                    /* we need to add data models */
                    number: vm.baseData.detectionDatas[vm.subData.data.length - 1].number + 1,
                    date: "",
                    status: "",
                    title: "",
                    coverPicUrl: "",
                    detection: "",
                    detail: {
                        id: vm.baseData.detectionDatas[vm.subData.data.length - 1].detail.id + 1,
                        date: "",
                        datetime: "",
                        testField: {
                        },
                        position: "",
                        title: "",
                        evaluation: {
                        },
                        basics: {
                        },
                        status: {
                        },
                        description: "",
                        costs: {
                            disposalCost: 0,
                            impairment: 0,
                            recoup: 0,
                            isPrint: true
                        }
                    }
                }
            );
            /* Open detection detail modal */
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', vm.subData).then(
                (data) => {
                }
            );
        }

        function editDetection() {
            vm.detailObj = {
                data: vm.baseData.detectionDatas,
                count: vm.baseData.detectionDatas.length,
                selectedIdx: vm.selectedDetectionIdx
            };
            /* Open detection detail modal */
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', vm.detailObj).then(
                (data) => {
                }
            );
        }

        function deleteDetection() {
            vm.baseData.detectionDatas.splice(vm.selectedDetectionIdx, 1);
            vm.selectedDetectionIdx = 0;
            vm.selectedDetection = vm.baseData.detectionDatas[vm.selectedDetectionIdx];
        }
		//#endregion

		//#region Protocol Methods
		function addProtocol() {
            vm.subData = {
				data: vm.baseData.protocolDatas,
				detail: {
					selectedIdx: -1
				}
            };

            vm.subData.data.push(
                {
                    id: vm.baseData.protocolDatas[vm.subData.data.length - 1].id + 1,
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
                }
            );

        }

        function editProtocol() {
            vm.subData = {
                data: vm.selectedProtocol,
                detail: {
					selectedIdx: vm.selectedProtocolIdx,
				}
            }
            /* Open detection detail modal */
            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', vm.subData).then(
                (data) => {
                    
                }
            );
        }

        function deleteProtocol() {
            vm.baseData.protocolDatas.splice(vm.selectedProtocolIdx, 1);
            vm.selectedProtocolIdx = 0;
            vm.selectedProtocol = vm.baseData.protocolDatas[vm.selectedProtocolIdx];
        }
		//#endregion

		function getIndex(id) {
            if(id === -1)
                return $rootScope.sharedService.alert("ID not set", "danger");

            if(vm.baseData.documents && vm.baseData.documents.length <= 0)
                return $rootScope.sharedService.alert("No items", "danger");
             
            var idx = vm.baseData.documents.findIndex(o => o.id === id);
            if(idx < 0)  
                return $rootScope.sharedService.alert("ID not found", "danger");

            return idx;
		}
			
		function setSelected(field, obj, idx) {
            if (field === 'projectDocuments') {
				vm.selectedDocument = obj;
			} else if (field === 'detection') {
				vm.selectedDetection = obj;
				vm.selectedDetectionIdx = idx;
			} else if (field === 'protocol') {
				vm.selectedProtocol = obj;
            	vm.selectedProtocolIdx = idx;
			}
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            console.log('====================================');
            console.log('Base Data', vm.baseData);
            console.log('Untouched', vm.untouched);
            console.log('====================================');
            $scope.$close();
        }


    	$scope.selectedTab = $scope.tabs[0];
    	$scope.setSelectedTab = function(tab) {
			$scope.selectedTab = tab;

    	};

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
    	$rootScope.settings.layout.pageBodySolid = false;
    	$rootScope.settings.layout.pageSidebarClosed = false;
    }

})();