(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('EditStammdataController', EditStammdataController);

    EditStammdataController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService", "getId"];

    /* @ngInject */
    function EditStammdataController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService, getId) {

        var vm = this;
        $scope.state = true;
 
        vm.newEntry = newEntry;
        vm.onSelect = onSelect;
        // vm.cancelEntry = cancelEntry;
        vm.editEntry = editEntry;
        vm.deleteEntry = deleteEntry;
        vm.saveEntry = saveEntry;
        vm.closeModal = closeModal;

        init();

        function init() {

            console.log('====================================');
            console.log('Model Opened');
            console.log('====================================');

            vm.tmpSelected = false;
            vm.newItem = "";
            vm.show = false;
            vm.editStatus = false;

            vm.typeKind = getId.title;
            vm.items = angular.copy(getId.data) || [];
            vm.selected = getId.selected; // first init undefined 
            if(getId.type)
                vm.type = getId.type;

            vm.master = angular.copy(getId.data);

        }

        function getIndex(id) {
            if(id === -1)
                return $rootScope.sharedService.alert("ID not set", "danger");

            if(vm.items && vm.items.length <= 0)
                return $rootScope.sharedService.alert("No items", "danger");
             
            var idx = vm.items.findIndex(o => o.id === id);
            if(idx < 0)  
                return $rootScope.sharedService.alert("ID not found", "danger");

            return idx;
        }


        function newEntry() {
            console.log('====================================');
            console.log('New Entry');
            console.log('====================================');
            var obj = {"id": helperFuncs.maxId(vm.items) + 1, "value": vm.newItem};
            vm.items.push(obj);

            if(typeof vm.onsave === "function")
                vm.onsave(obj);

            vm.newItem = "";
            vm.editStatus = true;
            vm.show = false;
        }

        function editEntry(id = -1) {
            console.log('====================================');
            console.log('Edit Entry');
            console.log('====================================');
            var idx = getIndex(id);

            if(vm.tmpSelected !== false){ // another one is being editted, save it & close edit form
                vm.items[vm.tmpSelected].editMode = false;
                vm.editStatus = false;

                if(typeof vm.onsave === "function")
                    vm.onsave(vm.items[vm.tmpSelected]);
            }
            vm.tmpSelected = idx;
            // vm.tmpVar = angular.copy(vm.items[idx].value);
            vm.items[idx].editMode = true;
            vm.editStatus = true;
        }

        function saveEntry(id = -1) {
            console.log('====================================');
            console.log('Save Entry');
            console.log('====================================');
            var idx = getIndex(id);

            vm.items[idx].editMode = false;
            vm.editStatus = false;

            console.log(typeof vm.onsave === "function")
            if(typeof vm.onsave === "function")
                vm.onsave();
        }

        function deleteEntry(id = -1) {
            var idx = getIndex(id);
            
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function () {
                vm.items.splice(idx, 1);
                vm.selected = -1;
                // $rootScope.$broadcast('editStammdata.delete', vm.items[idx]);
                if(typeof vm.ondelete === "function")
                    vm.ondelete();
            })
        }

        function closeModal() {
            if(angular.equals(vm.master, vm.items) && vm.editStatus == false)
                $scope.$close();
            else {
                $scope.sharedService.showConfirmDialog("sure","Löschen").then(function () {
                    $scope.$close();
                    vm.items = vm.master;
                })
            }
        };

        // function cancelEntry(id) {
        //     var idx = vm.items.findIndex(o => o.id === id)
        //     vm.items[vm.selected].editMode = false;
        //     vm.editStatus = false;
        //     vm.items[vm.selected].value = vm.tmpVar;
        // }

        function onSelect() {
            // vm.master = vm.items;
            $scope.$close(vm.items);
        }

        // function onSelect() {
        //     var obj = MainDataService.getCopiedData();

        //     if(vm.selected !== undefined && obj)
        //         obj[vm.typeKind + 'x'] = vm.items[vm.selected];
        //     else
        //         console.log("NICHTS ausgewählt")

        //     saveDataxy();
        //     if(vm.selected >= 0)
        //         $scope.$close(vm.items[vm.selected]);
        //     else
        //         $scope.$close();
        // }

        // function loadData() {
        //     StammdatenHandler.getData().then(({data}) => {
        //         var data1 = data[vm.typeKind][vm.type];
        //         vm.items = data1;
        //     });
        // };

        // function saveDataxy() {
        //     StammdatenHandler.updateData(vm.typeKind + '/' + [vm.type] + '/', vm.items).then(({data}) => {
        //         var tmp2 = MainDataService.getAllStammdata(false);
        //         tmp2[vm.typeKind][vm.type] = data.data;

        //         vm.items = data.data;
        //         vm.newItem = "";
        //     }, () => {console.log("HALLOOOOOOOO");})
        // }
    }
})();