(function () {
    'use strict';

    angular
	.module('MetronicApp')
	.controller('BaseDatasController', BaseDatasController);

	BaseDatasController.$inject = ['$rootScope', '$scope', 'modalService', 'StammDatenHandler', 'BaseDataHandler'];

	/* @ngInject */
	function BaseDatasController($rootScope, $scope, modalService, StammDatenHandler, BaseDataHandler) {

        var vm = this;
        vm.state = true;
        vm.baseData = {
            data: [],
            changedCounter: 0
        };
        
        vm.editData = editData;
        vm.onsave = onsave;
        vm.ondelete = ondelete;
        
        $scope.tabs = [
            { title:'Auftrasart', content:'Dynamic content 1' },
            { title:'Grundlagen', content:'Dynamic content 2' }
        ];

        vm.tabs = $scope.tabs;

        init();

        function init() {
            console.log('====================================');
            console.log('Load base datas' );
            console.log('====================================');
            BaseDataHandler.getData().then( (res) => {
                vm.baseData = res.data;
            });
        }

        function onsave(item) {
            console.log("saved");
        }

        function ondelete(item) {
            console.log("saved");
        }

        function editData() {
            var obj = {
                uploads: vm.uploads,
                callback: onsave,
                data: vm.baseData,
                title: "Stammdata"
            };
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            modalService.openComponentModal('editStammdata', obj).then((data) => {

                // this is so we don't send a request when we "cancel" modal
                if(typeof data ===  "undefined")
                    return;

                var obj = {
                    data, // same as data: data -> because key and value is the same
                    changedCounter: vm.baseData.changedCounter
                };

                StammDatenHandler.postData(obj).then(
                    (res) => {
                        // vm.baseData.data = res.data.data;

                        // fixed changedCounter issue and wrapped them together like in init
                        vm.baseData = res.data;
                    },
                    (err) => {
                        $rootScope.sharedService.alert('data has been changed!', "danger");
                    }
                );

                console.log("Modal closed, vm.uploads now = ", vm.baseData);
            });
        }
    }
})();