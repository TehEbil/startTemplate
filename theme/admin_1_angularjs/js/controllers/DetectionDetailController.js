(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionDetailController', DetectionDetailController);

        DetectionDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'getId', 'BaseDataHandler'];

	/* @ngInject */
	function DetectionDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, getId, BaseDataHandler) {
		// console.log("DetectionDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.openTextSnippetModal = openTextSnippetModal;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;
        vm.stringToDate = stringToDate;
        vm.openBaseDataModel = openBaseDataModel;
        vm.deleteUpload = deleteUpload;
        vm.addDetection = addDetection; 

        vm.detections = [];
        vm.selectedDetection = {};
        vm.selectedIdx = 0;
        vm.date = null;
        vm.datetime = null;
        vm.newItem = false;

        init();

        function init() {
            vm.selectedIdx = getId.detail.selectedIdx;
            vm.detections = getId.data;
            vm.untouched = angular.copy(vm.detections);
            if (vm.selectedIdx === -1) {
                vm.newItem = true;
                vm.selectedDetection = vm.detections[vm.detections.length - 1];
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
                vm.selectedIdx = vm.detections.length - 1;
            } else {
                vm.selectedDetection = vm.detections[vm.selectedIdx];
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
            }
            getBaseDatas();
        }
        
        function openTextSnippetModal() {
            let obj = {
                title: 'Text Snippets',
                data: [
                    {
                        id: '1',
                        value: 'text snippet 1'
                    },
                    {
                        id: '2',
                        value: 'text snippet 2'
                    },
                    {
                        id: '3',
                        value: 'text snippet 3'
                    },
                    {
                        id: '4',
                        value: 'text snippet 4'
                    },
                    {
                        id: '5',
                        value: 'text snippet 5'
                    }
                ]
            };

            modalService.openMenuModal('views/text_snippets.html', 'TextSnippetsController', 'animated zoomIn', obj).then( (data) => {
                
                if (typeof data !== 'undefined') {
                    vm.selectedDetection.detail.description = `${vm.selectedDetection.detail.description} ${data.value}`;    
                }
                
            });
        }

        function nextPage() {
            if (vm.selectedIdx < vm.detections.length - 1) {
                vm.selectedIdx ++;
                vm.selectedDetection = vm.detections[vm.selectedIdx];
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);   
            }
        }

        function previousPage() {
            /* decrease index value */
            if (vm.selectedIdx > 0) {
                vm.selectedIdx --;
                vm.selectedDetection = vm.detections[vm.selectedIdx];
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
            }
        }

        function stringToDate(date, datetime) {

            (date !== '') ? vm.selectedDetection.detail.date = new Date(date) : vm.selectedDetection.detail.date = new Date();
            (datetime !== '') ? vm.selectedDetection.detail.datetime = new Date(datetime) : vm.selectedDetection.detail.datetime = new Date();
            
        }

        function closeModal() {
            
            if (angular.toJson(vm.untouched) === angular.toJson(vm.detections)) {
                $scope.$close();
            } else {
                $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                    vm.untouched.splice(-1, 1);
                    $scope.$close({
                        data: vm.newItem,
                        type: 'decline',
                        detail: vm.untouched
                    });
                });
            }
            
        }

        function submitForm() {
            if (angular.toJson(vm.untouched) === angular.toJson(vm.detections)) {
                $scope.$close();
            } else {
                vm.detections[vm.selectedIdx] = vm.selectedDetection;
                let obj = {
                    data: vm.detections,
                    type: 'success'
                };
                $scope.$close(obj);
            }
        }

        function addDetection() {
            console.log('====================================');
            console.log('Next Detection');
            console.log('====================================');
            vm.detections.push(
                {
                    /* we need to add data models */
                    id: vm.detections.length > 0 ? helperFuncs.maxId(vm.detections) + 1 : 1,
                    number: generateNumber(vm.detections),
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
                        class: 1,
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

            vm.newItem = true;
            vm.selectedDetection = vm.detections[vm.detections.length - 1];
            vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
            vm.selectedIdx = vm.detections.length - 1;
        }   

        function deleteUpload(id) {
            /* File Deletion Callback */
            console.log('====================================');
            console.log('delete documents', id);
            console.log('====================================');
            vm.selectedDetection.documents.splice(vm.selectedDetection.documents.findIndex(o => o.id == id), 1);
            $rootScope.sharedService.alert("File has been deleted", "success");
        } 

        function getBaseDatas() {

            BaseDataHandler.getData().then((res) => {
                vm.prueffeld = res.data.prueffeld;
                vm.evaluations = res.data.beurteilungen;
                vm.statuses = res.data.statuses;
                vm.basics = res.data.grundlagen;
                vm.classes = res.data.classes;

                console.log('beur....', vm.evaluations);
                
            });
        }
        function generateNumber(detections) {
            let date = new Date();
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${detections.length > 0 ? helperFuncs.maxId(detections) + 1 : 1}`;
        }

        function openBaseDataModel(route, data) {
            let obj = {
                data: data,
                title: route,
                options: setOptions(route)
            };

            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openComponentModal('editStammdata', obj).then((data) => {

                // this is so we don't send a request when we "cancel" modal
                if(typeof data ===  "undefined")
                    return;

                let obj = {
                    data, // same as data: data -> because key and value is the same
                    changedCounter: vm[route].changedCounter
                };

                BaseDataHandler.updateData(route, obj).then(
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

        function setOptions(route) {

            let options = {};

            if (route === 'statuses') {
                options = {
                    type: 'list',
                    optName: 'color',
                    listElements: [
                        'red',
                        'yellow',
                        'green'
                    ]
                };
            } else if (route === 'prueffeld') {
                options = {
                    type: 'string',
                    optName: 'iso'
                };
            }
            console.log('====================================');
            console.log('options = ', options);
            console.log('====================================');
            return options;
        }
}
})();