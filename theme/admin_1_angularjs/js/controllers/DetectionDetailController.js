(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionDetailController', DetectionDetailController);

        DetectionDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService'];

	/* @ngInject */
	function DetectionDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService) {
		// console.log("DetectionDetailController Loaded");
		var vm = this;

        vm.dblClick = dblClickDetection;

        vm.detections = [
            {
                number: 1,
                date: '18.12.2018',
                status: 'status',
                title: 'foo',
                coverPicUrl: 'https://picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                detail: {
                    id: 8743,
                    date: '18.12.2018',
                    testFiedl: 'test field',
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
                coverPicUrl: 'https://picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                detail: {
                    id: 8744,
                    date: '18.12.2018',
                    testFiedl: 'test field',
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
                coverPicUrl: 'https://picsum.photos/200/300',
                detection: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
                detail: {
                    id: 8745,
                    date: '18.12.2018',
                    testFiedl: 'test field',
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

        function dblClickDetection(detection) {

            /* Open detection detail modal */
            // modalService.openMenuModal('views/project.html', 'ProjectController', 'animated zoomIn')
            console.log('====================================');
            console.log(detection);
            console.log('====================================');
        }
}
})();