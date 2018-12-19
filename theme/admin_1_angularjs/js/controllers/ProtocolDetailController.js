(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDetailController', ProtocolDetailController);

        ProtocolDetailController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService'];

	/* @ngInject */
	function ProtocolDetailController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService) {
		// console.log("ProtocolDetailController Loaded");
		var vm = this;

        vm.dblClick = dblClickProtocol;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.protocols = [
            {
                id: 1,
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
            },
            {
                id: 2,
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
            },
            {
                id: 3,
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
            }
        ];

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