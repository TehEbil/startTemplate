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

        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            console.log('====================================');
            console.log('submitForm');
            console.log('====================================');
            $scope.$close(vm.protocol);
        }
}
})();