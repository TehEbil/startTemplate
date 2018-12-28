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
        
        /* Global Data Definitions */
        vm.testFields = globalData.prüffeld;
        vm.evaluations = globalData.beurteilungen;
        vm.statuses = globalData.status;
        vm.basics = globalData.grundlagen;

        vm.detections = [];
        vm.selectedDetection = {};
        vm.selectedIdx = 0;
        vm.count = 0;

        init();

        function init() {
            vm.selectedIdx = getId.selectedIdx;
            vm.detections = getId.data;
            vm.selectedDetection = vm.detections[vm.selectedIdx];
            vm.count = getId.count;
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
                    vm.detection.detail[vm.detailIdx].description = `${vm.detection.detail[vm.detailIdx].description} ${data.value}`;    
                }
                
            });
        }

        function nextPage(detailObj) {

            if (vm.selectedIdx < vm.count - 1) {
                vm.selectedIdx ++;
                vm.selectedDetection = vm.detections[vm.selectedIdx];
            }
        }

        function previousPage() {
            /* decrease index value */
            if (vm.selectedIdx > 0) {
                vm.selectedIdx --;
                vm.selectedDetection = vm.detections[vm.selectedIdx];
            }
        }

        function closeModal() {
            $scope.$close(vm.detection);
        }

        function submitForm() {
            console.log('====================================');
            console.log(vm.detection);
            console.log('====================================');
            $scope.$close(vm.detection);
        }
}
})();