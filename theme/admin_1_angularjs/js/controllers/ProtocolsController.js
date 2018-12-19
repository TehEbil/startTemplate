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
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;

        vm.protocols = [
            {
                id: 1,
                isLocalInspection: true,
                localInspectionDate: "",
                protocolType: "type1",
                participants: [
                  "",
                  ""
                ],
                temperature: "",
                weather: "",
                peculiarity: "",
                reportDate: "",
                projectType: "",
                constructionState: "Condemned",
                acceptance: "",
                acceptanceComment: "",
                note: "",
                selectedDetection: "",
                titlePicUrl: "",
                date: "19.12.2018",
                members: "Mahmut, Can"
            },
            {
                id: 2,
                isLocalInspection: true,
                localInspectionDate: "",
                protocolType: "Type2",
                participants: [
                  "",
                  ""
                ],
                temperature: "",
                weather: "",
                peculiarity: "",
                reportDate: "",
                projectType: "",
                constructionState: "Not Good",
                acceptance: "",
                acceptanceComment: "",
                note: "",
                selectedDetection: "",
                titlePicUrl: "",
                date: "19.12.2018",
                members: "Necati, Mahmut, Muhammed"
            },
            {
                id: 3,
                isLocalInspection: true,
                localInspectionDate: "",
                protocolType: "Type3",
                participants: [
                  "",
                  ""
                ],
                temperature: "",
                weather: "",
                peculiarity: "",
                reportDate: "",
                projectType: "",
                constructionState: "Ok",
                acceptance: "",
                acceptanceComment: "",
                note: "",
                selectedDetection: "",
                titlePicUrl: "",
                date: "19.12.2018",
                members: "Muhammed, Necati, Can"
            }
        ];

        function dblClickProtocols(protocol) {

            /* Open detection detail modal */
            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn')
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