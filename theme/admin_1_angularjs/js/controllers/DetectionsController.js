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
        vm.addDetection = addDetection;
        vm.setSelectedIdx = setSelectedIdx;
        vm.deleteDetection = deleteDetection;

        vm.selectedDetectionIdx = -1;

        vm.baseData = {};
        vm.detailObj = {};

        init();

        function init() {
            vm.baseData = passDataService.getObj();
        }

        function editDetection(detection, idx) {
            vm.detailObj = {
                data: vm.baseData.detectionDatas,
                count: vm.baseData.detectionDatas.length,
                selectedIdx: idx
            };
            /* Open detection detail modal */
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', vm.detailObj).then(
                (data) => {
                }
            );
        }

        function addDetection() {
            vm.detailObj = {
                data: vm.baseData.detectionDatas,
                count: vm.baseData.detectionDatas.length,
                selectedIdx: -1
            };
            console.log('====================================');
            console.log('add new detection');
            console.log('====================================');
            vm.detailObj.data.push(
                {
                    number: vm.baseData.detectionDatas[vm.detailObj.count - 1].number + 1,
                    date: "",
                    status: "",
                    title: "",
                    coverPicUrl: "",
                    detection: "",
                    detail: {
                        id: vm.baseData.detectionDatas[vm.detailObj.count - 1].detail.id + 1,
                        date: "",
                        datetime: "",
                        testField: {
                        },
                        position: "",
                        title: "",
                        evaluation: {
                        },
                        basics: {
                        },
                        status: {
                        },
                        description: "",
                        costs: {
                            disposalCost: 0,
                            impairment: 0,
                            recoup: 0,
                            isPrint: true
                        }
                    }
                }
            );
            vm.detailObj.count = vm.baseData.detectionDatas.length;
            /* Open detection detail modal */
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', vm.detailObj).then(
                (data) => {
                }
            );
        }

        function setSelectedIdx(idx) {
            vm.selectedDetectionIdx = idx; 
        }

        function deleteDetection(idx) {
            vm.baseData.detectionDatas.splice(idx, 1);
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();