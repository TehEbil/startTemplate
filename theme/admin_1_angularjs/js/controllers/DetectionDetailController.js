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
        vm.testFields = globalData.prüffeld;

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
        };

        init();

        function init() {
            vm.detection = getId.data;
            console.log('====================================');
            console.log(vm.detection);
            console.log('====================================');
        }

        function closeModal() {
            $scope.$close(vm.detection);
        }

        function submitForm() {
            $scope.$close(vm.detection);
        }
}
})();