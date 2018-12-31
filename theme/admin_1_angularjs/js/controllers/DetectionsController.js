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

        vm.editDetection = editDetection;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.baseData = passDataService.getObj();

        vm.baseData.detectionDatas = [
            {
                number: 1,
                date: '',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://www.picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                detail: {
                    id: 8743,
                    date: '',
                    datetime: '',
                    hour: 14,
                    minute: 25,
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
                        disposalCost: 500,
                        impairment: 600,
                        recoup: 700,
                        isPrint: true
                    }
                }
            },
            {
                number: 2,
                date: '',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://www.picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                detail: {
                    id: 8744,
                    date: '',
                    datetime: '',
                    hour: 14,
                    minute: 25,
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
                        disposalCost: 500,
                        impairment: 600,
                        recoup: 700,
                        isPrint: true
                    }
                }
            },
            {
                number: 3,
                date: '',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://www.picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                detail: {
                    id: 8745,
                    date: '',
                    datetime: '',
                    hour: 14,
                    minute: 25,
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
                        disposalCost: 500,
                        impairment: 600,
                        recoup: 700,
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

        function editDetection(detection, idx) {
            let obj = {
                data: vm.baseData.detectionDatas,
                count: vm.detections.length,
                selectedIdx: idx
            };
            /* Open detection detail modal */
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', obj).then(
                (data) => {
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