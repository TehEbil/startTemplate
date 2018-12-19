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
            participants: [
              "",
              ""
            ],
            temperature: "",
            weather: "",
            peculiarity: "",
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
        }

        function dblClickProtocol(protocol) {

            /* Open detection detail modal */
            // modalService.openMenuModal('views/project.html', 'ProjectController', 'animated zoomIn')
            console.log('====================================');
            console.log(protocol);
            console.log('====================================');
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }
}
})();