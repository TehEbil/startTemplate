(function() {
    'use strict';

    angular
    .module('MetronicApp')
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = ["$rootScope", "$http", "modalService", "ProjectHandler", "passDataService"];

    /* @ngInject */
    function DashboardController($rootScope, $http, modalService, ProjectHandler, passDataService) {
        var vm = this;
        vm.title = 'DashboardController';
        vm.alertExample = alertExample;
        vm.modalExample = modalExample;
        vm.onsave = onsave;
        vm.deleteUpload = deleteUpload;
        vm.addKunde = addKunde;

        vm.testMessage = "HELLO, welcome to this WORLD!";
        vm.uploads = [];
        vm.testMasterData = [];

        /* demonstration of vm.uploads */

        $http.get($rootScope.ip + 'testUploads').then( ({data}) => {
            /* data -> user.uploads */
            data.forEach((elem) => {
                vm.uploads.push(elem);
            });
        });

        function alertExample() {
            $rootScope.sharedService.alert("hi", "danger");
        } 

        function onsave(file) {
            /* File Uploaded Callback */
            console.log("File has been uploaded: ", file);

            // $rootScope.sharedService.alert("File has been saved", "success");
        } 

        function deleteUpload(id) {
            /* File Deletion Callback */

            vm.uploads.splice(vm.uploads.findIndex(o => o.id == id), 1);
            $rootScope.sharedService.alert("File has been deleted", "success");
        } 

        function addKunde() {
            ProjectHandler.getData().then((res) => {
                let obj = {
                    data: res.data
                };
                // passDataService.setObj(res.data);
                // obj.data = passDataService.getObj();

                modalService.openMenuModal('views/form_projekt.html', 'FormProjektController', 'animated zoomIn', obj).then(
                    (data) => {
                        console.log('====================================');
                        console.log('incoming data: ', data);
                        console.log('====================================');
    
                        if (typeof data !== 'undefined') {
                            // ProjectHandler.postData(data).then((res) => {
                            //     console.log('====================================');
                            //     console.log('response: ', res);
                            //     console.log('====================================');
                            // });    
                        }
                    }
                );
			});
            
        }

        function modalExample() {
            var obj = {
                uploads: vm.uploads,
                callback: onsave
            };
            // $rootScope.modalService.openMenuModal would work too, globally defined to use more easily
            // modalService.openComponentModal('bxpStammdata').then((data) => {
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then((data) => {
                /* vm.uploads has to be saved to the data (e.g. customer) it belongs to */
                console.log("Modal closed, vm.uploads now = ", vm.uploads);
            });
        }
    }
})();