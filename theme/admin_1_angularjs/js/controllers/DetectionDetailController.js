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
        vm.detailIdx = 0;
        vm.details = [];

        vm.prepareDetectionModel = prepareDetectionModel;
        
        /* Global Data Definitions */
        vm.testFields = globalData.prüffeld;
        vm.evaluations = globalData.beurteilungen;
        vm.statuses = globalData.status;
        vm.basics = globalData.grundlagen;

        vm.detection = {};

        init();

        function init() {
            vm.detection = getId.data;
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

            vm.detailIdx ++;

            vm.detection.detail[vm.detailIdx] = vm.prepareDetectionModel(detailObj.id, detailObj.idx);
            
            console.log('====================================');
            console.log(vm.detection.detail);
            console.log('====================================');
        }

        function prepareDetectionModel(id, idx) {

            let detection = {
                idx: idx + 1,
                id: id + 1,
                date: '',
                hour: 0,
                minute: 0,
                testField: {},
                position: '',
                title: '',
                evaluation: {},
                basics: {},
                status: {},
                description: 'desc',
                costs: {
                    disposalCost: 0,
                    impairment: 0,
                    recoup: 0,
                    isPrint: true
                }
            };

            return detection;
        }

        function previousPage() {
            /* decrease index value */
            if (vm.detailIdx > 0) vm.detailIdx --;
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