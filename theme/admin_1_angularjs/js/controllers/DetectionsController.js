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
        vm.baseData = {};

        init();

        function init() {
            vm.baseData = passDataService.getObj();
        }

        function editDetection(detection, idx) {
            let obj = {
                data: vm.baseData.detectionDatas,
                count: vm.baseData.detectionDatas.length,
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
            $scope.$close();
        }
}
})();