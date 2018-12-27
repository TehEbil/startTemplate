(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionDetailController', DetectionDetailController);

        DetectionDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'getId'];

	/* @ngInject */
	function DetectionDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, getId) {
		// console.log("DetectionDetailController Loaded");
		var vm = this;

        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.openTextSnippetModal = openTextSnippetModal;
        vm.detailIdx = 0;
        vm.nextPage = nextPage;
        
        /* Global Data Definitions */
        vm.testFields = globalData.prüffeld;
        vm.evaluations = globalData.beurteilungen;
        vm.statuses = globalData.status;
        vm.basics = globalData.grundlagen;


        vm.detection = {};

        init();

        function init() {
            vm.detection = getId.data;
            console.log('====================================');
            console.log(vm.detection.detail[vm.detailIdx]);
            console.log('====================================');
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
                    vm.detection.detail[[vm.detailIdx]].description = `${vm.detection.detail[vm.detailIdx].description} ${data.value}`;    
                }
                
            });
        }

        function nextPage(detail) {
            vm.detailIdx ++;
            detail.idx = vm.detailIdx;
            /* increase index value and push page object in the detail array */
            vm.detection.detail.push(detail); // if same detail haven't

            console.log('====================================');
            console.log(vm.detection.detail);
            console.log('====================================');
        }

        function previousPage() {
            /* decrease index value */
        }

        function closeModal() {
            $scope.$close(vm.detection);
        }

        function submitForm() {
            $scope.$close(vm.detection);
        }
}
})();