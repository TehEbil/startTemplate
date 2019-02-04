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
                vm.selectedDetection = angular.copy(vm.detections[vm.detections.length - 1]);
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
                vm.selectedIdx = vm.detections.length - 1;
            } else {
                vm.selectedDetection = angular.copy(vm.detections[vm.selectedIdx]);
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
            console.log('====================================');
            console.log('undouched', vm.untouched);
            console.log('Detections', vm.detections);
            console.log('====================================');
            if (angular.equals(angular.toJson(vm.untouched), angular.toJson(vm.detections))) {
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
            if (angular.equals(angular.toJson(vm.selectedDetection), angular.toJson(vm.detections[vm.selectedIdx]))) {
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

        function getBaseDatas() {

            BaseDataHandler.getData().then((res) => {
                vm.testFields = res.data.prüffeld.data;
                vm.evaluations = res.data.beurteilungen.data;
                vm.statuses = res.data.detectionStatus.data;
                vm.basics = res.data.grundlagen.data;
            });
        }
}
})();