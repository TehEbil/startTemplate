(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolsController', ProtocolsController);

        ProtocolsController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'passDataService'];

	/* @ngInject */
	function ProtocolsController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, passDataService) {
		// console.log("ProtocolsController Loaded");
		var vm = this;

        vm.editProtocol = editProtocol;
        vm.deleteProtocol = deleteProtocol;
        vm.addProtocol = addProtocol;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.setSelected = setSelected;
        

        vm.selectedProtocol = {};
        vm.selectedProtocolIdx = -1;

        vm.baseData = {};
        vm.detailObj = {};

        init();

        function init() {
            vm.baseData = passDataService.getObj();
            vm.protocols = vm.baseData.protocolDatas;
        }

        function addProtocol() {
            vm.detailObj = {
                data: vm.baseData.protocolDatas,
                count: vm.baseData.protocolDatas.length,
                selectedIdx: -1
            };

            vm.detailObj.data.push(
                {
                    id: vm.baseData.protocolDatas[vm.detailObj.count - 1].id + 1,
                    isLocalInspection: true,
                    localInspectionDate: new Date().toISOString(),
                    protocolType: "",
                    participants: "",
                    tempreture: "",
                    weather: "",
                    particularties: "",
                    reportDate: new Date().toISOString(),
                    projectType: {},
                    constructionState: {},
                    acceptance: {},
                    acceptanceComment: "",
                    note: "",
                    selectedDetection: "",
                    titlePicUrl: "https://picsum.photos/100/100/?random",
                    date: new Date().toISOString(),
                    members: "",
                    selectedDetections: [],
                    documents: [],
                }
            );

        }

        function setSelected(detection) {
            vm.selectedProtocol = detection;
            vm.selectedProtocolIdx = vm.baseData.protocolDatas.findIndex( data => data.id === detection.id );
        }

        function editProtocol() {
            vm.detailObj = {
                data: vm.baseData.protocolDatas,
                count: vm.baseData.protocolDatas.length,
                selectedIdx: vm.selectedProtocolIdx
            }
            /* Open detection detail modal */
            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', vm.detailObj).then(
                (data) => {
                    
                }
            );
        }

        function deleteProtocol() {
            vm.baseData.protocolDatas.splice(vm.selectedProtocolIdx, 1);
            vm.selectedProtocolIdx = 0;
            vm.selectedProtocol = vm.baseData.protocolDatas[vm.selectedProtocolIdx];
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close(vm.baseData);
        }
}
})();