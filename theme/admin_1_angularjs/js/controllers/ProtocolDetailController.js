(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService', 'getId'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService, getId) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.dblClick = dblClickProtocol;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.protocol = {
            id: 0,
            isLocalInspection: true,
            localInspectionDate: "",
            participants: "",
            temperature: "",
            weather: "",
            particularties: "",
            reportDate: "",
            projectType: "",
            constructionState: "",
            acceptance: "",
            acceptanceComment: "",
            note: "",
            selectedDetection: "",
            titlePicUrl: ""
        };

        init();

        function init() {
            vm.protocol = getId.data;
            console.log('====================================');
            console.log(vm.protocol);
            console.log('====================================');
        }

        function dblClickProtocol(protocol) {
            console.log('f:' + protocol)
            /* Open detection detail modal */
            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', {data: protocol}).then(
                (data) => {
                    console.log('====================================');
                    console.log('coming data:', data);
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