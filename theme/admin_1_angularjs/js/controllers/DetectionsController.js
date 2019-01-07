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
        vm.setSelected = setSelected;
        vm.deleteDetection = deleteDetection;

        vm.selectedDetection = {};
        vm.selectedDetectionIdx = -1;

        vm.baseData = {};
        vm.detailObj = {};

        init();

        function init() {
            vm.baseData = passDataService.getObj();
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

        function setSelected(detection) {
            vm.selectedDetection = detection;
            vm.selectedDetectionIdx = vm.baseData.detectionDatas.findIndex( data => data.number === detection.number );
        }

        function editDetection() {
            vm.detailObj = {
                data: vm.baseData.detectionDatas,
                count: vm.baseData.detectionDatas.length,
                selectedIdx: vm.selectedDetectionIdx
            };
            /* Open detection detail modal */
            modalService.openMenuModal('views/detection_detail.html', 'DetectionDetailController', 'animated zoomIn', vm.detailObj).then(
                (data) => {
                }
            );
        }

        function deleteDetection() {
            vm.baseData.detectionDatas.splice(vm.selectedDetectionIdx, 1);
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();