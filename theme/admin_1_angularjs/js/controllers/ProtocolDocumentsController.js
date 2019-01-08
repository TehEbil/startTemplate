(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ProtocolDocumentsController', ProtocolDocumentsController);

        ProtocolDocumentsController.$inject = ['$rootScope', '$scope', 'modalService', 'passDataService'];

	/* @ngInject */
	function ProtocolDocumentsController($rootScope, $scope, modalService, passDataService) {
		// console.log("ProtocolDocumentsController Loaded");
		var vm = this;

        vm.editProtocolDocument = editProtocolDocument;
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
        vm.setSelected = setSelected;
        vm.onDelete = onDelete;

        vm.selectedDocument = {};
        vm.selectedDocumentIdx = -1;

        vm.protocolDocuments = [];

        init();

        function init() {
            vm.protocolDocuments = passDataService.getObj().protocolDatas;
        }

        function editProtocolDocument(protocol) {
            console.log('f:' + protocol)
            /* Open detection detail modal */
            modalService.openMenuModal('views/protocol_detail.html', 'ProtocolDetailController', 'animated zoomIn', {data: protocol}).then(
                (data) => {
                }
            );
        }

        function setSelected(document) {
            vm.selectedDocument = document;
            vm.selectedDocumentIdx = vm.protocolDocuments.findIndex( data => data.id === document.id);
        }

        function onDelete() {
            vm.protocolDocuments.splice(vm.selectedDocumentIdx, 1);
            $rootScope.sharedService.alert("File has been deleted", "success");
        }

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close(vm.protocols);
        }
}
})();