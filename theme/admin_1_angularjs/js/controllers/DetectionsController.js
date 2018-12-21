(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionsController', DetectionsController);

        DetectionsController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService'];

	/* @ngInject */
	function DetectionsController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService) {
		// console.log("DetectionsController Loaded");
		var vm = this;

        vm.dblClick = dblClick;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.detections = [
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
                    evaluation: 'evaluation',
                    basics: 'basics',
                    status: 'status',
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
                    evaluation: 'evaluation',
                    basics: 'basics',
                    status: 'status',
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
                    evaluation: 'evaluation',
                    basics: 'basics',
                    status: 'status',
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
            $scope.$close();
        }
}
})();