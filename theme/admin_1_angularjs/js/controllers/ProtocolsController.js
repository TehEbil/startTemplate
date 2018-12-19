(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolsController', ProtocolsController);

        ProtocolsController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'modalService'];

	/* @ngInject */
	function ProtocolsController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, modalService) {
		// console.log("ProtocolsController Loaded");
		var vm = this;

        vm.dblClick = dblClickProtocols;

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

        function dblClickProtocols(protocol) {

            /* Open detection detail modal */
            // modalService.openMenuModal('views/project.html', 'ProjectController', 'animated zoomIn')
            console.log('====================================');
            console.log(protocol);
            console.log('====================================');
        }
}
})();