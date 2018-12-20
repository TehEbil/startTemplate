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
                localInspectionDate: "2018-12-20T06:06:53+00:00",
                protocolType: "type1",
                participants: "Mahmut, Can, Muhammed",
                tempreture: "26",
                weather: "Summer",
                particularties: "1. particularity, 2. particularity",
                reportDate: "2018-12-20T06:06:53+00:00",
                projectType: "Type 1",
                constructionState: "Condemned",
                acceptance: "Accepted",
                acceptanceComment: "As a result of the researching of a defect has not been found.",
                note: "All we need a just a little lahmacun!",
                selectedDetection: "Detection 1",
                titlePicUrl: "https://picsum.photos/100/100/?random",
                date: "2018-12-20T06:06:53+00:00",
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
                tempreture: "",
                weather: "",
                particularties: "",
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
                tempreture: "",
                weather: "",
                particularties: "",
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