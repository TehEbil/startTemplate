(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionsController', DetectionsController);

        DetectionsController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'passDataService'];

	/* @ngInject */
	function DetectionsController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, passDataService) {
		// console.log("DetectionsController Loaded");
		var vm = this;

        vm.dblClick = dblClick;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.baseData = passDataService.getObj();

        vm.baseData.detectionDatas = [
            {
                number: 1,
                date: '18.12.2018',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://www.picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                detail: {
                    id: 8743,
                    date: '18.12.2018',
                    testField: {
                        id: "008",
                        name: "Wasserhaltungsarbeiten",
                        group:"ROHBAU"
                    },
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
                        disposalCost: 'disposal',
                        impairment: 'imp',
                        recoup: 'stopaj',
                        isPrint: true
                    }
                }
            },
            {
                number: 2,
                date: '18.12.2018',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://www.picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                detail: {
                    id: 8744,
                    date: '18.12.2018',
                    testField: {
                        id: "008",
                        name: "Wasserhaltungsarbeiten",
                        group:"ROHBAU"
                    },
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
                        disposalCost: 'disposal',
                        impairment: 'imp',
                        recoup: 'stopaj',
                        isPrint: true
                    }
                }
            },
            {
                number: 3,
                date: '18.12.2018',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://www.picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
                detail: {
                    id: 8745,
                    date: '18.12.2018',
                    testField: {
                        id: "008",
                        name: "Wasserhaltungsarbeiten",
                        group:"ROHBAU"
                    },
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
                        disposalCost: 'disposal',
                        impairment: 'imp',
                        recoup: 'stopaj',
                        isPrint: true
                    }
                }
            }
        ];

        passDataService.setObj(vm.baseData);

        init();

        function init() {
            vm.detections = passDataService.getObj().detectionDatas;
        }

        function dblClick(detection) {

            /* Open detection detail modal */
            console.log('====================================');
            console.log(detection);
            console.log('====================================');
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', {data: detection}).then(
                (data) => {
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                }
            );
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close(vm.detections);
        }
}
})();