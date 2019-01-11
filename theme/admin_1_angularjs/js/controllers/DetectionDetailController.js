(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionDetailController', DetectionDetailController);

        DetectionDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'getId', 'passDataService'];

	/* @ngInject */
	function DetectionDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, getId, passDataService) {
		// console.log("DetectionDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.openTextSnippetModal = openTextSnippetModal;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;
        vm.stringToDate = stringToDate;
        
        /* Global Data Definitions */
        vm.testFields = globalData.prüffeld;
        vm.evaluations = globalData.beurteilungen;
        vm.statuses = globalData.status;
        vm.basics = globalData.grundlagen;

        vm.detections = [];
        vm.selectedDetection = {};
        vm.selectedIdx = 0;
        vm.date = null;
        vm.datetime = null;

        init();

        function init() {
            vm.selectedIdx = getId.detail.selectedIdx;
            vm.detections = getId.data;
            console.log('====================================');
            console.log('selected Idx', vm.selectedIdx);
            console.log('selected Idx', vm.selectedIdx);
            console.log('====================================');
            if (vm.selectedIdx === -1) {
                vm.selectedDetection = angular.copy(vm.detections[vm.detections.length - 1]);
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
                vm.selectedIdx = vm.detections.length - 1;
            } else {
                vm.selectedDetection = angular.copy(vm.detections[vm.selectedIdx]);
                vm.stringToDate(vm.selectedDetection.detail.date, vm.selectedDetection.detail.datetime);
            }
            
            
            
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
                    console.log('====================================');
                    console.log(vm.selectedDetection);
                    console.log('====================================');
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
            vm.selectedDetection.detail.date = new Date(date);
            vm.selectedDetection.detail.datetime = new Date(datetime);
        }

        function closeModal() {
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function (){
                $scope.$close();
            });
        }

        function submitForm() {
            vm.detections[vm.selectedIdx] = vm.selectedDetection;
            let obj = {
                data: vm.detections,
                type: 'success'
            };
            $scope.$close(obj);
        }
}
})();