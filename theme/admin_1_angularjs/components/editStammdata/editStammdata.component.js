(function () {
    'use strict';

    angular
    .module('MetronicApp')
    .component('bxpNewRequests', {
        bindings: {
            data: '=',
            label: '=',
            ngModel: '=',
            edit: '&',
            makeDisabled: '=',
            hide: '='
        },
        controller: NewRequestsController,
        controllerAs: 'vm',
        templateUrl: '/components/newRequests/newRequests.template.html'
    });

    NewRequestsController.$inject = ["$rootScope", "$scope", "$http", "$timeout", "$stateParams", "$state", "modalService", "localStorageService"];

    /* @ngInject */
    function NewRequestsController($rootScope, $scope, $http, $timeout, $stateParams, $state, modalService, localStorageService) {

        var vm = this;

        vm.typeKind = getId.title;
        vm.tmpSelected = false;
        vm.newItem = "";

        vm.show = false;
        if(getId.type)
            vm.type = getId.type;
        else {
            vm.type = MainDataService.customerType;
        }

        vm.items = MainDataService.getAllStammdata(true)[vm.typeKind][vm.type];

        if(!vm.items)
            vm.items = [];

        if(getId.selected != -1)
            vm.selected = vm.items.findIndex(o => o.id == getId.selected);
        vm.mastercopy = angular.copy(vm.items);

        vm.newEntry = newEntry;
        vm.closeModal = closeModal;
        vm.onSelect = onSelect;
        vm.editEntry = editEntry;
        vm.deleteEntry = deleteEntry;
        vm.saveEntry = saveEntry;
        vm.cancelEntry = cancelEntry;
        vm.closeModal = closeModal;
        vm.closeModal2 = closeModal2;
        vm.editStatus = false;

        $scope.state = true;


        function newEntry() {
            var obj = {"id": -1, "value": vm.newItem};
            vm.items.push(obj);
            vm.newItem = "";
            vm.editStatus = true;

            vm.show = false;
        }

        function editEntry(id = -1) {
            if(id != -1)
                vm.selected = id;
            if(vm.tmpSelected !== false){
                vm.items[vm.tmpSelected].editMode = false;
                vm.editStatus = false;
            }
            vm.tmpSelected = vm.selected;

            vm.tmpVar = angular.copy(vm.items[vm.selected].value);
            vm.items[vm.selected].editMode = true;
            vm.editStatus = true;
        }

        function saveEntry() {
            vm.items[vm.selected].editMode = false;
            vm.editStatus = false;
        }

        function deleteEntry(id) {
            $scope.sharedService.showConfirmDialog("sure","Löschen").then(function () {

                if (id != -1)
                  vm.selected = id;

              vm.items.splice(vm.selected, 1);
              vm.selected = -1;
              $scope.sharedService.isOpen = false;
          })
        }

        function cancelEntry() {
            vm.items[vm.selected].editMode = false;
            vm.editStatus = false;
            vm.items[vm.selected].value = vm.tmpVar;
        }

        function closeModal() {
            $scope.$close();
            $rootScope.$broadcast('myCustomEvent', {
                            state: true // send whatever you want
                        });
            sharedService.isOpen = false;

        };

        function closeModal2() {
            if(vm.editStatus = !vm.editStatus){
                $scope.$close();
                $rootScope.$broadcast('myCustomEvent', {
                            state: true // send whatever you want
                        });
                sharedService.isOpen = false;

            }
            else
                angular.element(document).find('#idAbbrechen').focus();
        };

        function onSelect() {
            var obj = MainDataService.getCopiedData();

            if(vm.selected !== undefined && obj)
                obj[vm.typeKind + 'x'] = vm.items[vm.selected];
            else
                console.log("NICHTS ausgewählt")

            saveDataxy();
            if(vm.selected >= 0)
                $scope.$close(vm.items[vm.selected]);
            else
                $scope.$close();
        }


        function loadData() {
            StammdatenHandler.getData().then(({data}) => {
                var data1 = data[vm.typeKind][vm.type];
                vm.items = data1;
            });
        };

        function saveDataxy() {
            StammdatenHandler.updateData(vm.typeKind + '/' + [vm.type] + '/', vm.items).then(({data}) => {
                var tmp2 = MainDataService.getAllStammdata(false);
                tmp2[vm.typeKind][vm.type] = data.data;

                vm.items = data.data;
                vm.newItem = "";
            }, () => {console.log("HALLOOOOOOOO");})
        }
    }
})();