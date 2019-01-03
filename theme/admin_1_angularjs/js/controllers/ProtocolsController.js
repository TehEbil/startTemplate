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
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.baseData = {};

        init();

        function init() {
            vm.baseData = passDataService.getObj();
            vm.protocols = vm.baseData.protocolDatas;
        }

        function editProtocol(protocol) {
            console.log('f:' + protocol)
            /* Open detection detail modal */
            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', {data: protocol}).then(
                (data) => {
                    
                }
            );
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close(vm.baseData);
        }
}
})();