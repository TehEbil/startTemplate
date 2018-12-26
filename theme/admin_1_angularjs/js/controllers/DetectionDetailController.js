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
        
        /* Global Data Definitions */
        vm.testFields = globalData.prüffeld;
        vm.evaluations = globalData.beurteilungen;
        vm.statuses = globalData.status;
        vm.basics = globalData.grundlagen;


        vm.detection = {
            number: 1,
            date: '18.12.2018',
            status: 'status',
            title: 'foo',
            coverPicUrl: 'https://picsum.photos/200/300',
            detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            detail: {
                id: 8743,
                date: '18.12.2018',
                testField: 'test field',
                position: 'position',
                title: 'title',
                evaluation: {
                    id: "03",
                    name: "Abweichung von den allg. anerkannten Regeln der Technik(a.a.R.d.T.)",
                    shortcut: "AT"
                },
                basics: {
                    id: "03",
                    name: "Baubeschreibung"
                },
                status: {
                    id: "03",
                    name: "Mengelbeseitigung schriftlich vom BT / GU / NU bestätig und durch den Sachverständigen kontrolliert"
                },
                description: 'desc',
                costs: {
                    disposalCost: 500,
                    impairment: 600,
                    recoup: 700,
                    isPrint: true
                }
            }
        };

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
                    vm.detection.detail.description = `${vm.detection.detail.description} ${data.value}`;    
                }
                
            });
        }

        function closeModal() {
            $scope.$close(vm.detection);
        }

        function submitForm() {
            $scope.$close(vm.detection);
        }
}
})();