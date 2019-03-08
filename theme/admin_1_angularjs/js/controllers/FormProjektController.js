(function() {
	'use strict';

	angular
	.module('MetronicApp')
	.controller('FormProjektController', FormProjektController);

	FormProjektController.$inject = ['$rootScope', '$scope', 'ProjectHandler', 'getId', 'modalService', 'BaseDataHandler'];

	/* @ngInject */
	function FormProjektController($rootScope, $scope, ProjectHandler, getId, modalService, BaseDataHandler) {
		var vm = this;
		vm.title = 'FormProjektController';
        vm.closeModal = closeModal;
		vm.submitForm = submitForm;
        vm.setSelected = setSelected;
        vm.getBaseDataValueById = getBaseDataValueById;

        $scope.state = true; // so modal closes with ESC
        
    	$scope.tabs = [
	    	'Auftragsdaten',
            'Projektdaten',
            'Objektbeschreibung',
	    	'Feststellungen',
	    	'Protokolle'
    	];

        vm.tabs = $scope.tabs;
		
		//#region Project Detail Methods & Variables definitions
        vm.newDocument = newDocument;
        // vm.editDocument = editDocument;
        vm.attachDocument = attachDocument;
		vm.deleteDocument = deleteDocument;
		vm.saveEntry = saveEntry;
		vm.editEntry = editEntry;
		vm.onsave = onsave;
        vm.ondelete = ondelete;
        vm.checkAll = checkAll;

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
		
		function init() {
            if (getId.id >= 0) {
                ProjectHandler.getData("byId/" + getId.id).then(({data}) => {
                    // let data = res.data;
                    if(data.changedCounter !== getId.changedCounter) {
                        $rootScope.sharedService.alert("Data has been refreshed.", "warning");
                        getId.updateElement(getId.id, data); // so parent also has refreshed data
                    }
                    initForm(data);

                }, (err) => {
                    if(err.status === 404)
                        getId.updateElement(getId.id, null);
                    $rootScope.sharedService.alert("An error has occured, please contact an administrator.", "danger");
                });
            } else {
                initForm(emptyProject(getId.detail.listItems));
            }

            getBaseDatas(['statuses', 'bautenstand', 'prueffeld', 'beurteilung', 'classes']);
		}

        function initForm(data) {
            vm.untouched = data;
            vm.baseData = angular.copy(vm.untouched);
            vm.subData = {
                data: {},
                detail: {}
            };
            vm.isDisplayAll = false;    
            vm.order = vm.baseData.orderDatas;
            vm.protocols = vm.baseData.protocolDatas;
            vm.order.otherInformations.orderDate = new Date(vm.order.otherInformations.orderDate);
            vm.tmpSelected = false;
            getBaseDatas(['auftragsart', 'objektTypen']);
        }


        function emptyProject(objectList) {
            return {
                "id": helperFuncs.maxId(objectList) + 1,
                "projectNumber": "",
                "projectName": "",
                "ownPerformanceBuilder": "",
                "documents": [],
                "intenalNotes": "",
                "orderDatas": {
                  "customer": {
                    "customerNumber": "",
                    "privatFirma": "privat",
                    "selectedGen": "",
                    "selectedTit": "",
                    "firstName": "",
                    "lastName": "",
                    "companyName": "",
                    "additive": "",
                    "address": {
                      "route": "",
                      "country": {},
                      "postal_code": "",
                      "locality": ""
                    },
                    "phone": "",
                    "mobile": "",
                    "email": ""
                  },
                  "object": {
                    "objectNumber": 0,
                    "objectType": "",
                    "address": {
                      "route": "",
                      "country": {},
                      "postal_code": "",
                      "locality": ""
                    }
                  },
                  "otherInformations": {
                    "orderNumber": "",
                    "orderDate": new Date(),
                    "referenceNumber": "",
                    "orderType": getId.orderTypeId
                  }
                },
                "detectionDatas": [], 
                "protocolDatas": []
            }
        }

		function newDocument() {
            var obj = {
              data: vm.baseData.documents,
              detail: {
                isNew: true
              }
            };

            modalService.openMenuModal('views/project_data_documents.html', 'ProjectDataDocumentController', 'animated zoomIn', obj).then((res) => {
                if (res.type === 'success') {
                    console.log('====================================');
                    console.log(res.data);
                    console.log('====================================');
                    vm.baseData.documents = res.data;
                }
            });
        }

        // function editDocument(id) {
        //     let obj = {
        //         data: vm.baseData.documents,
        //         detail: {
        //             isNew: false,
        //             projectId: getId.id,
        //             selectedId: id
        //         }
        //     }; 

        //     modalService.openMenuModal('views/project_data_documents.html', 'ProjectDataDocumentController', 'animated zoomIn', obj).then((res) => {
        //         if (res.type === 'success') {
        //             console.log('====================================');
        //             console.log(res);
        //             console.log('====================================');
        //         }
        //     });
        // }

        function attachDocument() {
            var obj = {
                uploads: vm.selectedDocument.document,
                callback: vm.onsave
              };
            if(vm.uploadtype)
            obj['uploadtype'] = vm.uploadtype;

            obj.single = true;

            // console.log(obj);
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then(() => {

            });
        }

        function deleteDocument (id = -1) {

            if(id == -1)
                return console.error("Fehler bei deleteEntry");

            var idx = getIndex(id);
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
                    id: vm.baseData.detectionDatas.length > 0 ? helperFuncs.maxId(vm.baseData.detectionDatas) + 1 : 1,
                    number: generateNumber(vm.baseData.detectionDatas),
                    date: "",
                    status: "",
                    title: "",
                    coverPicUrl: "",
                    detection: "",
                    detail: {
                        date: "",
                        datetime: "",
                        testField: {
                        },
                        position: "",
                        title: "",
                        evaluation: [],
                        basics: [],
                        status: {
                        },
                        description: "",
                        class: 1,
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
                (res) => {
                    if (typeof res !== 'undefined' && res.type === 'success') {
                        vm.baseData.detectionDatas = res.data;
                    } else if (typeof res != 'undefined' && res.data && res.type === 'decline') {
                        vm.baseData.detectionDatas.splice(-1, 1);
                    } else if (typeof res !== 'undefined' && !res.data && res.type === 'decline') {
                        vm.baseData.detectionDatas = res.detail;
                    }
                }
            );
        }

        function editDetection() {
            if (vm.selectedDetectionIdx !== -1) {
                vm.subData = {
                    data: vm.baseData.detectionDatas,
                    detail: {
                        selectedIdx: vm.selectedDetectionIdx
                    }
                };
                /* Open detection detail modal */
                modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', vm.subData).then(
                    (res) => {
                        if (typeof res !== 'undefined' && res.type === 'success') {
                            vm.baseData.detectionDatas = res.data;
                        } else if (typeof res != 'undefined' && res.data && res.type === 'decline') {
                            vm.baseData.detectionDatas.splice(-1, 1);
                        } else if (typeof res !== 'undefined' && !res.data && res.type === 'decline') {
                            vm.baseData.detectionDatas = res.detail;
                        }
                    }
                );
            }
        }

        function deleteDetection() {
            $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                vm.baseData.detectionDatas.splice(vm.selectedDetectionIdx, 1);
                vm.selectedDetectionIdx = 0;
                vm.selectedDetection = vm.baseData.detectionDatas[vm.selectedDetectionIdx];
            });
        }

        function generateNumber(detections) {
            let date = new Date();
            return `${date.getFullYear()}${ ( "0" + ( date.getMonth() + 1 ) ).slice( -2 ) }${ ( "0" + ( date.getDate() ) ).slice( -2 ) }${detections.length > 0 ? helperFuncs.maxId(detections) + 1 : 1}`;
        }
		//#endregion

		//#region Protocol Methods
		function addProtocol() {
            vm.subData = {
				data: vm.baseData.protocolDatas,
                documents: vm.baseData.documents,
				detail: {
                    selectedIdx: -1,
                    detections: vm.baseData.detectionDatas,
                    projectId: vm.baseData.id
				}
            };

            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', vm.subData).then(
                (res) => {
                    if (typeof res !== 'undefined' && res.type === 'success') {
                        vm.baseData.protocolDatas.push(res.data);
                        vm.baseData.detectionDatas = res.detections;
                    }
                }
            );

        }

        function editProtocol() {
            if (vm.selectedProtocolIdx !== -1) {
                vm.subData = {
                    data: vm.selectedProtocol,
                    documents: vm.baseData.documents,
                    detail: {
                        selectedIdx: vm.selectedProtocolIdx,
                        detections: vm.baseData.detectionDatas,
                        projectId: vm.baseData.id
                    }
                }
                /* Open detection detail modal */
                modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', vm.subData).then(
                    (res) => {
                        if (typeof res !== 'undefined' && res.type === 'success') {
                            vm.baseData.protocolDatas[vm.selectedProtocolIdx] = res.data;
                            vm.baseData.detectionDatas = res.detections;
                        }
                    }
                );
            }
        }

        function deleteProtocol() {
            if (vm.selectedProtocolIdx !== -1) {
                $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                    vm.baseData.protocolDatas.splice(vm.selectedProtocolIdx, 1);
                    vm.selectedProtocolIdx = 0;
                    vm.selectedProtocol = vm.baseData.protocolDatas[vm.selectedProtocolIdx];
                });    
            }
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
            if (angular.equals(angular.toJson(vm.untouched), angular.toJson(vm.baseData))) {
                $scope.$close();
            } else {
                $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                    $scope.$close();
                });
            }
        }

        function checkAll(state, field) {
            if ( !state ) {
                vm.baseData.documents.map( d => d.isDisplay = true);
            } else {
                vm.baseData.documents.map( d => d.isDisplay = false);
            }
        }

        function submitForm() {
            if (angular.equals(angular.toJson(vm.untouched), angular.toJson(vm.baseData))) {
                $scope.$close();
            } else {
                $scope.$close(vm.baseData);
            }
        }

        function getBaseDataValueById(id, type) {
            let value = '';
            
            if(type === 'bautenstand') {
                value = vm.constructionStates.filter(f => f.id === id);
            } else if (type === 'beurteilung') {
                value = vm.evaluations.filter(f => f.id === id);
            } else if (type === 'prueffeld') {
                value = vm.prueffeld.filter(f => f.id === id);
            } else if (type === 'statuses' && typeof vm.statuses !== 'undefined') {    
                value = vm.statuses.filter(f => f.id === id);
            } else if (type === 'classes' && typeof vm.classes !== 'undefined') {
                value = vm.classes.filter(f => f.id === id);
            }

            if (typeof value[0] !== 'undefined') {
                return value[0].value;    
            }
        }

        function getBaseDatas(baseDatas) {
            BaseDataHandler.getData().then((res) => {
                for (const baseData of baseDatas) {
                    if (baseData === 'auftragsart') {
                        vm.orderTypes = res.data.auftragsart.data;                        
                    } else if (baseData === 'statuses') {
                        vm.statuses = res.data.statuses.data;    
                    } else if (baseData === 'objektTypen') {
                        vm.objectTypes = res.data.objektTypen.data;
                    } else if (baseData === 'bautenstand') {
                        vm.constructionStates = res.data.bautenstand.data;
                    } else if (baseData === 'prueffeld') {
                        vm.prueffeld = res.data.prueffeld.data;
                    } else if (baseData === 'beurteilung') {
                        vm.evaluations = res.data.beurteilungen.data;
                    } else if (baseData === 'classes') {
                        vm.classes = res.data.classes.data;
                    }
                }
            });    
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
