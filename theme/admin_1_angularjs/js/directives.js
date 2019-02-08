/***
GLobal Directives
***/

const wait = ms => new Promise((r, j)=>setTimeout(r, ms))

var waitForCond = (cond, timeoutms, interval=50) => new Promise((r, j)=>{
  var check = () => {
    if(cond()) 
      r()
    else if((timeoutms -= interval) < 0)
      j('timed out!')
    else
      setTimeout(check, interval)
  }
  setTimeout(check, interval)
})

function waitFor(conditionFunction) {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 100);
  }

  return new Promise(poll);
}

// Route State Load Spinner(used on page or content load)
var MetronicApp = angular.module('MetronicApp');
MetronicApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                // element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    // element.removeClass('hide'); // show spinner bar
                });

                $rootScope.$on('loadTable', function() {
                    // console.log("loading");
                    // element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('finishedTable', function(event) {
                    // console.log("finishing");
                    // element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    // setTimeout(function () {
                    //     App.scrollTop(); // scroll to the top on content load
                    // }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function(event) {
                    // element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

                    // // auto scorll to page top
                    // setTimeout(function () {
                    //     App.scrollTop(); // scroll to the top on content load
                    // }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    // element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    // element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
]);

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };
});

function maxId(arr) {
    // console.log(arr);
    var x = Math.max.apply(this, arr.map(function (o) { return o.id; }));
    return (x == "-Infinity") ? 0 : x;
}

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpMoreDetails', {
            bindings: {
              pagetitle: '=',
              new: '=',
              enableNew: '=',
              enableOptions: '=',
              edit: '=',
              delete: '=',
              data: '=data',
              id: "=",
              columndefs: '=',
              enableselect: '=',
              enableexport: '=',
              menuOptions: '=?',
              getstate: '='
            },
            controller: moreDetailsController,
            controllerAs: 'vm',
            transclude: true,
            // MULTIPLE TRANSCLUDE:::: https://blog.thoughtram.io/angular/2015/11/16/multiple-transclusion-and-named-slots.html
            template: function ($element, $attrs) {
              // access to $element and $attrs
              return `
                <div>
                  <div ng-style="vm.openedDetails && vm.id && {'padding-right':'340px'}">

                  <bxp-table-view
                    new="vm.new"
                    edit="vm.edit"
                    delete="vm.delete"
                    data="vm.data"
                    id="vm.id"
                    enable-new="vm.enableNew"
                    pagetitle="vm.pagetitle"
                    enableexport="vm.enableexport"
                    columndefs="vm.columndefs"
                    getstate="vm.getstate"
                    menu-options="vm.menuOptions"
                  > <ng-transclude></ng-transclude>
                  </bxp-table-view>

                    <div ng-class="{ 'bxp-openedDetails1' : vm.openedDetails && vm.id}">

                      <div ng-show="vm.openedDetails && vm.id" ng-style="vm.openedDetails && vm.id" ng-class="{ 'bxp-openedDetails2' : vm.openedDetails && vm.id}" >
                        <div class="bxp-container">
                        <p>TEST</p>
                        </div>
                      </div>
                    </div> <!-- Weitere Details end-->


                  </div>
                  <div class="bxp-button-container fixed group">
                    <span ng-if="!vm.enableOptions" class="ta-right float-right">


                      <button ng-if="vm.enableNew" ng-disabled="!vm.data && vm.data.length != 0" class="bxp-rounded-button add" ng-click="vm.new()" type="button"><i class="fa fa-plus"></i></button>
                      <button class="bxp-rounded-button animate-hidden nothing-to-see edit" ng-disabled="!vm.id" ng-class="{ 'nothing-to-see': !vm.id }" ng-click="vm.edit()" type="button"><i class="fa fa-pencil"></i></button>
                      <!--button class="bxp-rounded-button animate-hidden nothing-to-see details" ng-disabled="!vm.id" ng-class="{ 'nothing-to-see': !vm.id }" ng-click="vm.openWeitereDetails()" type="button"><i class="fa fa-angle-double-left"></i></button-->
                      <button class="bxp-rounded-button animate-hidden nothing-to-see delete fixed" ng-disabled="!vm.id" ng-class="{ 'nothing-to-see': !vm.id }" ng-click="vm.delete()" type="button"><i class="fa fa-trash"></i></button>
                    </span>
                  </div>
                </div>
              `
            }

        });

    moreDetailsController.$inject = ['$rootScope', '$scope', "$q"];

    /* @ngInject */
    function moreDetailsController($rootScope, $scope, $q) {
      var vm = this;
      vm.openWeitereDetails = openWeitereDetails;
      vm.openedDetails = false;
      // vm.isEmployee = $rootScope.authService.isAuthorized("employee");
      // vm.isAdmin = $rootScope.authService.isAuthorized("admin");

      vm.$onInit = () => {
        // $q.when(vm.data).then((data) => console.log(data))
        // console.warn(vm);
        // console.log(vm.getstate)
      }

      // vm.getState = function(state, color) {
      //   vm.getstate(state, color);
      // }

      function openWeitereDetails () {
        vm.openedDetails = !vm.openedDetails;
      }
    }
})();

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpTableView', {
            bindings: {
              pagetitle: '=',
              enableNew: '=',
              new: '=',
              edit: '=',
              delete: '=',
              id: '=',
              data: '=',
              columndefs: '=',
              enableselect: '=',
              menuOptions: '=?',
              getstate: '=',
              enableexport: '=?'
            },
            controller: tableViewController,
            controllerAs: 'vm',
            transclude: true,
            template: function ($element, $attrs) {
              // access to $element and $attrs
              return `
                    <h3 ng-if="vm.pagetitle && vm.pagetitle !== 'dispo'" class="page-title"> {{vm.pagetitle}}</h3>

                    <div class="bauexperts-box" id="onClickHandler" on-mouse-click="vm.onMouseClick()">
                      <p ng-show="vm.data.length === 0" class="no-entries"> Keine Einträge vorhanden. </p>
                      <div id="grid1" ui-grid="vm.gridOptions" class="bxp-table-width" doneLoading="vm.doneLoading"
                        class="grid row-border hover" ui-grid-selection ui-grid-exporter ui-grid-resize-columns ui-grid-save-state ui-grid-auto-resize ui-grid-pinning ui-grid-move-columns context-menu="vm.menuOptions">
                      </div>
                      <ng-transclude></ng-transclude>
                      <button ng-if="vm.pagetitle !== 'dispo'" class="btn btn-primary small" type="button" ng-click="vm.resetState()" style="">Gespeicherte Tabellenoptionen zurücksetzen</button>
                    </div>
              `
            }
        });

    tableViewController.$inject = ['$rootScope', '$scope', '$timeout', 'localStorageService', 'uiGridConstants'];

    /* @ngInject */
    function tableViewController($rootScope, $scope, $timeout, localStorageService, uiGridConstants) {
        var vm = this;
        vm.doubleClick = doubleClick;
        vm.resetState = resetState;
        vm.isEmployee = true; //$rootScope.authService.isAuthorized('employee');
        vm.selectedElement = {};

        var markup = "";
        if(vm.isEmployee)
            markup = `<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid"
                ui-grid-one-bind-id-grid="rowRenderIndex + '-' + row.entity.id + '-' + col.uid + '-cell'"
                class="ui-grid-cell"
                ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader, 'bxp-psd-bank': row.entity.kunde.quellex.value==='PSD Bank', 'background-red': row.entity.col == 'red', 'background-yellow': row.entity.col == 'yellow', 'background-green': row.entity.col == 'green', 'background-blue-sel': row.entity.col == 'blue'}"
                role="{{col.isRowHeader ? 'rowheader' : 'gridcell'}}"
                ng-right-click="grid.appScope.click()" ng-dblclick="grid.appScope.doubleClick(row)" ng-click="grid.appScope.selectRow($event)"
                ui-grid-cell>
            </div>`;
        else
            markup = `<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid"
                ui-grid-one-bind-id-grid="rowRenderIndex + '-' + row.entity.id + '-' + col.uid + '-cell'"
                class="ui-grid-cell"
                ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader,'bxp-psd-bank': row.entity.kunde.quellex.value==='PSD Bank'}"
                role="{{col.isRowHeader ? 'rowheader' : 'gridcell'}}"
                ng-right-click="grid.appScope.click()" ng-dblclick="grid.appScope.doubleClick(row)" ng-click="grid.appScope.selectRow($event)"
                ui-grid-cell>
            </div>`;

        vm.gridOptions = {
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                enableFiltering: true,
                enableGridMenu: true,
                enableColumnMenus: false,
                scrollDebounce: 70,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                enableHorizontalScrollbar: 2,
                enableVerticalScrollbar: 2,
                showGridFooter: true,
                enableSelectAll: false,
                exporterMenuAllData: false,
                exporterMenuCsv: false,
                exporterMenuExcel: false,
                exporterMenuPdf: false,

                rowTemplate: markup,
                onRegisterApi: function(gridApi) {
                    vm.gridApi = gridApi;

                    vm.gridApi.colMovable.on.columnPositionChanged($scope, () => {
                        saveState();
                    })
                    vm.gridApi.colResizable.on.columnSizeChanged($scope, () => {
                        saveState();
                    })
                    //vm.gridApi.grouping.on.aggregationChanged($scope, saveState);
                    //vm.gridApi.grouping.on.groupingChanged($scope, saveState);
                    vm.gridApi.core.on.columnVisibilityChanged($scope, () => {
                        // console.log("columnVisibilityChanged")
                        saveState();
                    })
                    vm.gridApi.core.on.filterChanged($scope, () => {
                        // console.log("filterChanged")
                        // saveState();
                    })
                    // vm.gridApi.core.on.filterChanged($scope, checkIfFiltered);
                    vm.gridApi.core.on.sortChanged($scope, () => {
                        saveState();
                    })

                    // Restore previously saved state.
                    restoreState();



                    //vm.gridApi.core.on.rowsVisibleChanged( $scope, vm.onFiltered );
                    //console.log(vm.gridApi.core.on);
                    // vm.gridApi.core.on.filterChanged($scope, function() {
                    //      console.log('filter changed');
                    //      $timeout(() => console.log("FILTERED"), 800);
                    //  });
                    vm.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
                        // vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    })
                    vm.gridApi.core.on.filterChanged( $scope, function( grid, sort ) {
                    //    console.log(grid, sort)
                        //vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    })
                    vm.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    // var msg = row.entity;
                    // console.log("Row Selected!",  msg);
                    });

                    // vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                }
        };

        function resetState() {
            localStorageService.set('gridState' + vm.pagetitle, {});
            location.reload();
        }

        function saveState() {
            var state = vm.gridApi.saveState.save();

            for(let col of state.columns) {
            col.filters  = [{}];
            }
            localStorageService.set('gridState' + vm.pagetitle, state);
        }

        function restoreState() {
            $timeout(function () {
            var state = localStorageService.get('gridState' + vm.pagetitle);
            if (state) 
                vm.gridApi.saveState.restore($scope, state);

            vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN); //Performance Improvement?
            });
        }

        vm.getState = function(state, color) {
            if(!vm.getstate)
                return;
            return vm.getstate(state,color);
        };

        $scope.$on('receivedData', function (event, data) {
            if(vm.pagetitle !== "dispo")
                return;
            $timeout( () => {
            vm.gridOptions.data = data;
            
            });
            //vm.gridOptions.data = data; // 'Data to send'

            // console.error(vm.gridOptions.data)
            // console.error(vm.gridOptions.data)
            // console.error(vm.gridOptions.data)
         });

        // function * foo(x) {
        //     while (true) {
        //         x = x * 2;
        //         yield x;
        //     }
        // }
        //
        // var test = foo(5);
        // test.next();
        //
        //
        // function testFunc2() {
        //     return new Promise(resolve => {
        //         if(vm.data !=)
        //       setTimeout(() => {
        //         resolve(x);
        //       }, 2000);
        //     });
        // }
        // async function testFunc() {
        //     var data = await testFunc2;
        //     console.log(data);
        // }

        vm.leistungen = globalData.leistungen;
        // vm.leistungen = [{ "id": "1", "leistung": "Kaufberatung", "group": "Beratung" }, { "id": "2", "leistung": "Verkaufsberatung", "group": "Beratung" }, { "id": "3", "leistung": "Baubegleitung / Bauabnahme", "group": "Beratung" }, { "id": "4", "leistung": "Wohnraumvermessung", "group": "Beratung" }, { "id": "5", "leistung": "Feuchtemessung", "group": "Beratung" }, { "id": "6", "leistung": "Schimmelpilzanalysen", "group": "Beratung" }, { "id": "7", "leistung": "Energieausweis", "group": "Beratung" }, { "id": "8", "leistung": "Kurzgutachten", "group": "Immobilienbewertung" }, { "id": "9", "leistung": "Verkehrswertgutachten", "group": "Immobilienbewertung" }, { "id": "10", "leistung": "Mietwertgutachten", "group": "Immobilienbewertung" }, { "id": "11", "leistung": "Beleihungswertgutachten", "group": "Immobilienbewertung" }, { "id": "12", "leistung": "Portfolioanalyse", "group": "Immobilienbewertung" }, { "id": "13", "leistung": "Gutachten für Entschädigung", "group": "Immobilienbewertung" }, { "id": "14", "leistung": "Bauschäden", "group": "Begutachtung" }, { "id": "15", "leistung": "Baumängel", "group": "Begutachtung" }, { "id": "16", "leistung": "Schimmelpilzschäden", "group": "Begutachtung" }, { "id": "17", "leistung": "Versicherungsschäden", "group": "Begutachtung" }, { "id": "18", "leistung": "Beweissicherung", "group": "Begutachtung" }, { "id": "19", "leistung": "Prüfung von Schadensgutachten", "group": "Begutachtung" }, { "id": "20", "leistung": "Planungsleistungen", "group": "Planung" }, { "id": "21", "leistung": "Prüfung von Planungsleistungen", "group": "Planung" }, { "id": "22", "leistung": "Bauleitung", "group": "Planung" }, { "id": "23", "leistung": "Baubegleitende Qualitätsüberwachung", "group": "Planung" }, { "id": "24", "leistung": "SiGeKo", "group": "Planung" }, { "id": "25", "leistung": "Übergabeprotokoll", "group": "Beratung" }, { "id": "26", "leistung": "Kanaldichtheitsprüfung", "group": "Begutachtung" }];
        vm.getAuftragsart = function(kob) {
            var string = "";
            for(var key_s in kob) {
            var tmpLeistung = vm.leistungen.find(o => o.id == kob[key_s]);
            if(tmpLeistung && 'leistung' in tmpLeistung)
                string += tmpLeistung.leistung + ", ";
            else
                string += kob[key_s] + ", ";
            }
            // console.log(string[string.length-1])
            string =  string.substring(0,  string.length - 2);
            return string;
        };

        vm.click = function() {
            // console.log(vm.id)
            // if(vm.id !== false)
            // {
            //   console.log(vm.id);
            //   return;
            // }

            var elements2 = document.getElementsByClassName('ui-grid-row-selected');

            var elements = document.querySelectorAll(':hover');
            // console.log("16:" , elements[16], "17:" , elements[17], "18:" , elements[18], "19:" , elements[19])
            // console.log(elements);
            // if(elements[17].className.indexOf('ui-grid-row-selected') == -1)
            //     elements[17].click();

            // if(elements[18].className.indexOf('ui-grid-row-selected') == -1)
            //     elements[18].click();

            // console.log(elements2[0]);
            // console.log(elements[17]);
            // console.log(elements[18]);
            // console.log(elements[21]);
            // console.log(elements[19].className);
            // console.log("right one:", elements[19]);
            // console.log(elements[19].parentElement.parentElement.parentElement);

            var idx = -1;

            for(idx in elements)
                if(elements[idx] && elements[idx].className.indexOf('ui-grid-cell-contents') >= 0)
                    break;

            if(elements[idx] && elements[idx].className && elements[idx].className.indexOf('ui-grid-row-selected') == -1)
            {
                if(elements2[0] == elements[idx].parentElement.parentElement.parentElement)
                    return;
                // vm.curSel = elements[idx];
                elements[idx].click();
            }
            else {
                if(elements2[0] == elements[idx-1].children[0].parentElement.parentElement.parentElement)
                    return;
                // vm.curSel = elements[idx-1].children[0];
                elements[idx-1].children[0].click()
                }

            //$scope.selectRow();

            //elements[14].click();

        };

        vm.onMouseClick = function() {
            if(vm.gridApi)
            vm.gridApi.selection.clearSelectedRows();
            console.log("ID cleared");
            vm.id = false;
        };

        var i = 0;
        function doStuff() {

            if(vm.data===undefined) {//we want it to match
                if(++i == 100) {
                    // $timeout( () => {
                    //     // console.log("Nach 5 Sek.", vm.data);
                    //     vm.gridOptions.data = vm.data;
                    // });
                    return; // console.error("nach 5 Sekunden keine Daten bekommen.");
                }

                // console.log(i);
                setTimeout(doStuff, 100);//wait 100 millisecnds then recheck
                // console.log(++i)

                return;
            }
            // console.log("data2", vm.data)
            $timeout( () => {
            vm.gridOptions.data = vm.data;
            
            });
            //return vm.data;
            //real action
        }

        vm.$onInit = () => {
            vm.gridOptions.columnDefs = vm.columndefs;
            this.gridOptions.appScopeProvider = vm;
            $scope.formatters = {};

            if(vm.enableexport) {
                var obj = {
                // exporterMenuPdf: false,
                exporterCsvFilename: 'SV-Daten.csv',
                exporterMenuLabel: "Exportieren",
                exporterMenuAllData: false,

                exporterMenuCsv: true,
                exporterMenuExcel: true,
                exporterMenuPdf: true,

                exporterFieldCallback: function ( grid, row, col, value ) {
                    //loops through every row
                    // console.log(grid, row, col, value)
                    console.log(col.name)
                    switch(col.name) {
                        case "auftragsart":
                            value = getAuftragsart(value);
                            break;
                        default:
                            break;
                    }
                    // if ( col.name === 'status' ) {
                    // }
                    return value;
                },

                exporterPdfDefaultStyle: { fontSize: 7 },
                exporterPdfTableStyle: { margin: [5, 5, 5, 20] },
                exporterPdfTableHeaderStyle: { fontSize: 9, bold: true, italics: true, color: 'black' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: "Seite " + currentPage.toString() + ' von ' + pageCount.toString(), style: 'footerStyle' };
                },
                // exporterPdfCustomFormatter: function (docDefinition) {
                //     docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                //     docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                //     return docDefinition;
                // },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 400,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                exporterExcelFilename: 'myFile.xlsx',
                    exporterExcelSheetName: 'Sheet1',
                    exporterExcelCustomFormatters: function ( grid, workbook, docDefinition ) {
                
                        var stylesheet = workbook.getStyleSheet();
                        var stdStyle = stylesheet.createFontStyle({
                        size: 9, fontName: 'Calibri'
                        });
                        var boldStyle = stylesheet.createFontStyle({
                        size: 9, fontName: 'Calibri', bold: true
                        });
                        var aFormatDefn = {
                        "font": boldStyle.id,
                        "alignment": { "wrapText": true }
                        };
                        var formatter = stylesheet.createFormat(aFormatDefn);
                        // save the formatter
                        $scope.formatters['bold'] = formatter;
                        var dateFormatter = stylesheet.createSimpleFormatter('date');
                        $scope.formatters['date'] = dateFormatter;
                
                        aFormatDefn = {
                        "font": stdStyle.id,
                        "fill": { "type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE" },
                        "alignment": { "wrapText": true }
                        };
                        var singleDefn = {
                        font: stdStyle.id,
                        format: '#,##0.0'
                        };
                        formatter = stylesheet.createFormat(aFormatDefn);
                        // save the formatter
                        $scope.formatters['red'] = formatter;
                
                        Object.assign(docDefinition.styles , $scope.formatters);
                
                        return docDefinition;
                    },
                    exporterExcelHeader: function (grid, workbook, sheet, docDefinition) {
                        // this can be defined outside this method
                        var stylesheet = workbook.getStyleSheet();
                        var aFormatDefn = {
                            "font": { "size": 11, "fontName": "Calibri", "bold": true },
                            "alignment": { "wrapText": true }
                        };
                        var formatterId = stylesheet.createFormat(aFormatDefn);
                
                        // excel cells start with A1 which is upper left corner
                        sheet.mergeCells('B1', 'C1');
                        var cols = [];
                        // push empty data
                        cols.push({ value: '' });
                        // push data in B1 cell with metadata formatter
                        // cols.push({ value: 'My header that is long enough to wrap', metadata: {style: formatterId.id} });
                        sheet.data.push(cols);
                    },
                    exporterFieldFormatCallback: function(grid, row, gridCol, cellValue) {
                    // set metadata on export data to set format id. See exportExcelHeader config above for example of creating
                    // a formatter and obtaining the id
                    var formatterId = null;
                    // if (gridCol.field === 'name' && cellValue && cellValue.startsWith('W')) {
                    //   formatterId = $scope.formatters['red'].id;
                    // }
                
                    // if (gridCol.field === 'updatedDate') {
                    //   formatterId = $scope.formatters['date'].id;
                    // }
                
                    if (formatterId) {
                        return {metadata: {style: formatterId}};
                    } else {
                        return null;
                    }
                    },
                    exporterColumnScaleFactor: 4.5,
                    exporterFieldApplyFilters: true
                }
                vm.gridOptions = Object.assign(vm.gridOptions, obj)
            }

            if(!vm.menuOptions) {
            vm.menuOptions = [
                // NEW IMPLEMENTATION
                {
                    text: 'Neu',
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        vm.new()
                    }
                },
                {
                    text: 'Bearbeiten',
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        vm.edit()
                    }
                },
                {
                    text: 'Löschen',
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        vm.delete()
                    }
                },
                {
                    text: 'Farben',
                    children: [
                    {
                        text: 'Rot',
                        click: function ($itemScope, $event, modelValue, text, $li) {
                            setColor('red')
                        }
                    },
                    {
                        text: 'Gelb',
                        click: function ($itemScope, $event, modelValue, text, $li) {
                            setColor('yellow')
                        }
                    },
                    {
                        text: 'Grün',
                        click: function ($itemScope, $event, modelValue, text, $li) {
                            setColor('green')
                        }
                    },
                    {
                        text: 'Blau',
                        click: function ($itemScope, $event, modelValue, text, $li) {
                            setColor('blue')
                        }
                    },
                    null, // Dividier
                    {
                        text: 'Zurücksetzen',
                        click: function ($itemScope, $event, modelValue, text, $li) {
                            setColor('normal')
                        }
                    },
                    ]
                },

                null, // Dividier
                {
                    text: 'Zurück',
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        return;
                    }
                },
            ];

            // var deletePos = 2;
            // if(!vm.enableNew) {
            //   // console.error("SPLICING", vm.enableNew);
            //   vm.menuOptions.splice(0, 1);
            //   deletePos = 1;
            // }
            // if(!$rootScope.isEmployee)
            //   vm.menuOptions.splice(deletePos, 1);
            };

            // console.log("Innited?!");
            waitForCond(() => vm.data !== undefined, 10000, 25).then((a) => {
            $timeout( () => {
                vm.gridOptions.data = vm.data; 
            });
            });
            // doStuff(); // 'Data to send'

            // console.error("DOSTUFF");
            // console.log(vm.gridOptions.data)
            // setTimeout( () => vm.tetc = true, 2800)
            // }, 2000);



            // if(vm.title == "SV")
            //   vm.handler = MainDataServiceSV;

        //   vm.handler.init('verified').then((data) => {

        //   vm.svs = data.sv;
        //   sortData(data.sv);
        //   // setCssThings(vm.svs);
        //   // console.log(vm.svs);
        //   if (vm.svs.length <= 0)
        //       $rootScope.$broadcast('finishedTable');


        //     vm.entfernung = true;
        //   },
        //   (data) => {
        //     alert("Fehler, Server down?!");
        //     $rootScope.$broadcast('finishedTable');
        //   });
        }

        // function setColor(col) {
        //   MainDataService.setColor(vm.id, col);
        // }

        function newData() {
            // console.log("newData")
            vm.new();
        }

        function doubleClick(row) {
            $timeout( () => {
                row.isSelected = true;
                vm.id = row.entity.id;
                }, 111)
                // console.log(typeof vm.enableselect);
                if(typeof vm.enableselect === 'boolean')
                    $scope.$parent.FormCtrl.closeModal(vm.id); //.$close();
                else if(vm.enableselect){
                console.log("shouldDispo", vm.id)
                // vm.enableselect(vm.id);
                }
                else {
                // vm.click();
                vm.edit();
            }
        }

        function sortData(data) {
            // console.log(data)
            data = vm.svs;
            for(var key_s in data) {
            var tmpData = '';
            if(data[key_s].dist)
                data[key_s].dist = data[key_s].dist.value / 1000;
            if(data[key_s].account)
                if(data[key_s].account.role)
                    data[key_s].account = data[key_s].account.role.key;

            for(var key2_s in data[key_s].kompetenzen)
                if(data[key_s].kompetenzen.length -1 == key2_s)
                tmpData += data[key_s].kompetenzen[key2_s].selectedQual;
                else
                tmpData += data[key_s].kompetenzen[key2_s].selectedQual + ", ";
            data[key_s].kompetenzenList = tmpData;

            tmpData = '';

            for(var key2_s in data[key_s].selectedLeistungen){
                if(data[key_s].selectedLeistungen.length -1 == key2_s)
                tmpData += data[key_s].selectedLeistungen[key2_s].leistung;
                else
                tmpData += data[key_s].selectedLeistungen[key2_s].leistung + ", ";
            }
            data[key_s].leistungenList = tmpData;
            }

            setCssThings(data)
            vm.gridOptions.data = data;

        }

        vm.selectRow = function(event, rightClick) {
            vm.editIsOpen = false;
            var tId = -1;
            if ((angular.element(event.target)[0].className.indexOf("ui-grid-icon-minus-squared") >= 0) || (angular.element(event.target)[0].className.indexOf("ui-grid-icon-plus-squared") >= 0))
            {
                vm.id = false;
                // vm.gridApi.selection.clearSelectedRows();
                return;
            }

            var selectedElement = vm.gridApi.selection.getSelectedRows()[0];
            $rootScope.$broadcast('selectedElement', {
                selected: selectedElement
            })

            if(selectedElement) {
                if (vm.id !== false && !rightClick && selectedElement.id == vm.id) { // Zweiter Klick
                    $timeout(function () {
                        if(!vm.editIsOpen)
                        {
                            // vm.id = false;
                            // console.log(vm.id)
                            // vm.gridApi.selection.clearSelectedRows();
                        }
                    }, 100);
                }
                else
                    vm.id = selectedElement.id;
            }
            else
                $timeout(function () {
                    // if(!vm.editIsOpen)
                    // {
                        vm.id = false;
                        // console.log(vm.id)
                        vm.gridApi.selection.clearSelectedRows();
                    // }
                }, 100);

            //if(vm.id==false)
            //console.error(vm.id, selected);
        };

        vm.selectRow2 = function(event, rightClick) {
            var tId = -1;
            var selectedElement = vm.gridApi.selection.getSelectedRows()[0];
            if(selectedElement)
            if (vm.id !== false && !rightClick && selectedElement.id == vm.id) { // Zweiter Klick
                $timeout(function () {
                    if(!vm.editIsOpen)
                    {
                        // console.log(vm.id)
                    }
                }, 100);
            }
            else if(selectedElement)
                vm.id = selectedElement.id;
            else
                vm.id = false;
        };

        function setCssThings(custSV) {
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpAddress', {
            bindings: {
              address: '=ngModel',
              plzorlocality: '=',
              make: '=',
              ignoreRoute: '=',
              ignoreCountry: '=',
              disableCity: '=',
              stepforward: '=',
              validate: '=',
              submitted: '=',
              onSelect: '=',
              onUpdate: '&'
            },
            controller: AddressController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
              // access to $element and $attrs
              return `
              <div ng-if="vm.plzorlocality">
                <div class="form-group modal-adress">
                  <div ng-if="!vm.ignoreRoute" class="group">
                    <label for="input-street" class="control-label bxp-label float-left">Straße, Nr.</label>
                    <!-- <input ng-disabled="vm.make" name="route" type="text" ng-model="vm.address.route" ng-model-options="vm.modelOptions" uib-typeahead="address for address in vm.getLocation($viewValue)" typeahead-loading="loadingLocations" typeahead-no-results="noResults" class="form-control bxp-input float-left" autocomplete="off" typeahead-on-select="vm.onSelectCity($item, $model, $label)" /> -->

                    <input ng-disabled="vm.make" name="route" type="text" ng-model="vm.address.route" vs-google-autocomplete="vm.modelOptions" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input float-left" autocomplete="off" placeholder=" ">

                    <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
                  </div>
                </div>
                <div class="form-group group">
                  <div>
                      <div class="modal-zip-loc" ng-class="{ 'has-warning' : (!vm.address.postal_code && !vm.address.locality)  && vm.stepforward}">
                        <label for="input-zip" class="control-label bxp-label float-left">PLZ</label>
                        <input ng-disabled="vm.make" name="postal_code" type="text" ng-model="vm.address.postal_code" vs-google-autocomplete="vm.modelOptions" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input bxp-input-plz float-left" autocomplete="off" placeholder=" " />
                      </div>

                      <div class="modal-zip-loc" ng-class="{ 'has-warning' : (!vm.address.postal_code && !vm.address.locality) && vm.stepforward}">
                        <label for="input-location" class="control-label bxp-label-ort float-left">Ort</label>
                        <div id="locationField" class="bxp-input-ort float-left">
                          <!-- <input ng-disabled="vm.make" name="locality" ng-model="vm.address.locality" class="form-control bxp-input" type="text"/> -->

                          <input ng-disabled="vm.make || vm.disableCity" name="route" type="text" ng-model="vm.address.locality" vs-google-autocomplete="vm.modelOptions" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input" autocomplete="off" placeholder=" " >

                        </div>
                        <p class="control-label" ng-show="(!vm.address.postal_code && !vm.address.locality) && vm.stepforward">Entweder PLZ oder Ort muss angegeben werden.</p>
                      </div>
                  </div>
                </div>

                <div ng-if="!vm.ignoreCountry" class="form-group group modal-country" >
                    <label for="country-select" class="bxp-label control-label float-left">Land</label>
                    <div id="country-select" class="bxp-input country-select float-left">
                        <ui-select ng-disabled="vm.make" ng-model="vm.address.country" theme="bootstrap" remove-selected="false">
                            <ui-select-match>{{$select.selected.name}}</ui-select-match>
                            <ui-select-choices repeat="item in vm.countries | filter: $select.search">
                                <span ng-bind-html="item.name  | highlight: $select.search"></span>
                            </ui-select-choices>
                        </ui-select>
                    </div>
                </div>
              </div>

              <div ng-if="vm.validate && !vm.plzorlocality">
                <div class="form-group modal-adress">
                  <div class="group" ng-class="{ 'has-error' : !vm.address.route && vm.submitted}">
                    <label for="input-street" class="control-label bxp-label float-left">Straße, Nr.<span class="required"> * </span></label>
                      <input name="route" type="text" ng-model="vm.address.route" vs-google-autocomplete="vm.modelOptions" ng-disabled="vm.make" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input float-left" autocomplete="off" required  placeholder=" ">
                  </div>
                </div>

                <div class="form-group group">
                  <div class="modal-zip-loc" ng-class="{ 'has-error' : !vm.address.postal_code  && vm.submitted}">
                    <label for="input-zip" class="control-label bxp-label float-left">PLZ
                      <span class="required"> * </span>
                    </label>
                    <input name="postal_code" type="text" ng-model="vm.address.postal_code" vs-google-autocomplete="vm.modelOptions" ng-disabled="vm.make" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input bxp-input-plz float-left" autocomplete="off" placeholder=" "required>
                  </div>

                  <div class="modal-zip-loc" ng-class="{ 'has-error' : !vm.address.locality && vm.submitted}">
                    <label for="input-location" class="control-label bxp-label-ort float-left">Ort
                      <span class="required"> * </span>
                    </label>
                    <div id="locationField" class="bxp-input-ort float-left">
                      <input name="locality" type="text" ng-model="vm.address.locality" vs-google-autocomplete="vm.modelOptions" ng-disabled="vm.make" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route" class="form-control bxp-input" placeholder=" " autocomplete="off" required>

                    </div>
                  </div>
                </div>

                <div class="form-group group" ng-class="{ 'has-error' : !vm.address.country && vm.submitted }">
                    <label for="country-select" class="bxp-label control-label float-left">Land
                    <span class="required"> * </span>
                    </label>
                    <div id="country-select" class="bxp-input float-left">
                        <ui-select required ng-model="vm.address.country" theme="bootstrap" remove-selected="false">
                            <ui-select-match>{{$select.selected.name}}</ui-select-match>
                            <ui-select-choices repeat="item in vm.countries | filter: $select.search">
                                <span ng-bind-html="item.name  | highlight: $select.search"></span>
                            </ui-select-choices>
                        </ui-select>
                    </div>
                </div>
              </div>

              <div ng-if="!vm.validate && !vm.plzorlocality">
                <div class="form-group modal-adress">
                  <div class="group" ng-class="{ 'has-error' : !vm.address.route && vm.routereq && vm.submitted}">
                    <label for="input-street" class="control-label bxp-label float-left">Straße, Nr.</label>
                      <input name="route" type="text" ng-model="vm.address.route" vs-google-autocomplete="vm.modelOptions" ng-disabled="vm.make" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input float-left" autocomplete="off"  placeholder=" ">
                      
                      <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
                  </div>
                </div>

                <div class="form-group group">
                  <div class="modal-zip-loc">
                    <label for="input-zip" class="control-label bxp-label float-left">PLZ
                    </label>
                    <input name="postal_code" type="text" ng-model="vm.address.postal_code" vs-google-autocomplete="vm.modelOptions" ng-disabled="vm.make" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route"  class="form-control bxp-input bxp-input-plz float-left" autocomplete="off" placeholder=" ">
                  
                  </div>
                  <div class="modal-zip-loc">
                    <label for="input-location" class="control-label bxp-label-ort float-left">Ort
                    </label>
                    <div id="locationField" class="bxp-input-ort float-left">
                      <input name="locality" type="text" ng-model="vm.address.locality" vs-google-autocomplete="vm.modelOptions" ng-disabled="vm.make" on-select="vm.onSelectCity" is-searching="vm.isSearching" datavalue="vm.route" class="form-control bxp-input" autocomplete="off" placeholder=" ">

                    </div>
                  </div>
                </div>

                <div class="form-group modal-country group">
                    <label for="country-select" class="bxp-label control-label float-left">Land</label>
                    <div id="country-select" class="bxp-input country-select float-left">
                        <ui-select ng-disabled="vm.make" ng-model="vm.address.country" theme="bootstrap" remove-selected="false">
                            <ui-select-match >{{$select.selected.name}}</ui-select-match>
                            <ui-select-choices repeat="item in vm.countries | filter: $select.search">
                                <span ng-bind-html="item.name  | highlight: $select.search"></span>
                            </ui-select-choices>
                        </ui-select>
                    </div>
                </div>
              </div>
              `;
            }

        });

    AddressController.$inject = ['$http', '$timeout'];

    /* @ngInject */
    function AddressController($http, $timeout) {

      var vm = this;
      // vm.countries = [{"name":"Deutschland","code":"DE"},{"name":"Afghanistan","code":"AF"},{"name":"Åland","code":"AX"},{"name":"Albanien","code":"AL"},{"name":"Algerien","code":"DZ"},{"name":"Amerikanisch-Samoa","code":"AS"},{"name":"Andorra","code":"AD"},{"name":"Angola","code":"AO"},{"name":"Anguilla","code":"AI"},{"name":"Antarktika","code":"AQ"},{"name":"Antigua und Barbuda","code":"AG"},{"name":"Argentinien","code":"AR"},{"name":"Armenien","code":"AM"},{"name":"Aruba","code":"AW"},{"name":"Australien","code":"AU"},{"name":"Österreich","code":"AT"},{"name":"Aserbaidschan","code":"AZ"},{"name":"Bahamas","code":"BS"},{"name":"Bahrain","code":"BH"},{"name":"Bangladesch","code":"BD"},{"name":"Barbados","code":"BB"},{"name":"Weißrussland","code":"BY"},{"name":"Belgien","code":"BE"},{"name":"Belize","code":"BZ"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Bhutan","code":"BT"},{"name":"Bolivien","code":"BO"},{"name":"Bonaire, Sint Eustatius und Saba","code":"BQ"},{"name":"Bosnien und Herzegowina","code":"BA"},{"name":"Botswana","code":"BW"},{"name":"Bouvetinsel","code":"BV"},{"name":"Brasilien","code":"BR"},{"name":"Britisches Territorium im Indischen Ozean","code":"IO"},{"name":"Kleinere Inselbesitzungen der Vereinigten Staaten","code":"UM"},{"name":"Britische Jungferninseln","code":"VG"},{"name":"Amerikanische Jungferninseln","code":"VI"},{"name":"Brunei","code":"BN"},{"name":"Bulgarien","code":"BG"},{"name":"Burkina Faso","code":"BF"},{"name":"Burundi","code":"BI"},{"name":"Kambodscha","code":"KH"},{"name":"Kamerun","code":"CM"},{"name":"Kanada","code":"CA"},{"name":"Kap Verde","code":"CV"},{"name":"Kaimaninseln","code":"KY"},{"name":"Zentralafrikanische Republik","code":"CF"},{"name":"Tschad","code":"TD"},{"name":"Chile","code":"CL"},{"name":"China","code":"CN"},{"name":"Weihnachtsinsel","code":"CX"},{"name":"Kokosinseln","code":"CC"},{"name":"Kolumbien","code":"CO"},{"name":"Union der Komoren","code":"KM"},{"name":"Kongo","code":"CG"},{"name":"Kongo (Dem. Rep.)","code":"CD"},{"name":"Cookinseln","code":"CK"},{"name":"Costa Rica","code":"CR"},{"name":"Kroatien","code":"HR"},{"name":"Kuba","code":"CU"},{"name":"Curaçao","code":"CW"},{"name":"Zypern","code":"CY"},{"name":"Tschechische Republik","code":"CZ"},{"name":"Dänemark","code":"DK"},{"name":"Dschibuti","code":"DJ"},{"name":"Dominica","code":"DM"},{"name":"Dominikanische Republik","code":"DO"},{"name":"Ecuador","code":"EC"},{"name":"Ägypten","code":"EG"},{"name":"El Salvador","code":"SV"},{"name":"Äquatorial-Guinea","code":"GQ"},{"name":"Eritrea","code":"ER"},{"name":"Estland","code":"EE"},{"name":"Äthiopien","code":"ET"},{"name":"Falklandinseln","code":"FK"},{"name":"Färöer-Inseln","code":"FO"},{"name":"Fidschi","code":"FJ"},{"name":"Finnland","code":"FI"},{"name":"Frankreich","code":"FR"},{"name":"Französisch Guyana","code":"GF"},{"name":"Französisch-Polynesien","code":"PF"},{"name":"Französische Süd- und Antarktisgebiete","code":"TF"},{"name":"Gabun","code":"GA"},{"name":"Gambia","code":"GM"},{"name":"Georgien","code":"GE"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Griechenland","code":"GR"},{"name":"Grönland","code":"GL"},{"name":"Grenada","code":"GD"},{"name":"Guadeloupe","code":"GP"},{"name":"Guam","code":"GU"},{"name":"Guatemala","code":"GT"},{"name":"Guernsey","code":"GG"},{"name":"Guinea","code":"GN"},{"name":"Guinea-Bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Haiti","code":"HT"},{"name":"Heard und die McDonaldinseln","code":"HM"},{"name":"Heiliger Stuhl","code":"VA"},{"name":"Honduras","code":"HN"},{"name":"Hong Kong","code":"HK"},{"name":"Ungarn","code":"HU"},{"name":"Island","code":"IS"},{"name":"Indien","code":"IN"},{"name":"Indonesien","code":"ID"},{"name":"Elfenbeinküste","code":"CI"},{"name":"Iran","code":"IR"},{"name":"Irak","code":"IQ"},{"name":"Irland","code":"IE"},{"name":"Insel Man","code":"IM"},{"name":"Israel","code":"IL"},{"name":"Italien","code":"IT"},{"name":"Jamaika","code":"JM"},{"name":"Japan","code":"JP"},{"name":"Jersey","code":"JE"},{"name":"Jordanien","code":"JO"},{"name":"Kasachstan","code":"KZ"},{"name":"Kenia","code":"KE"},{"name":"Kiribati","code":"KI"},{"name":"Kuwait","code":"KW"},{"name":"Kirgisistan","code":"KG"},{"name":"Laos","code":"LA"},{"name":"Lettland","code":"LV"},{"name":"Libanon","code":"LB"},{"name":"Lesotho","code":"LS"},{"name":"Liberia","code":"LR"},{"name":"Libyen","code":"LY"},{"name":"Liechtenstein","code":"LI"},{"name":"Litauen","code":"LT"},{"name":"Luxemburg","code":"LU"},{"name":"Macao","code":"MO"},{"name":"Mazedonien","code":"MK"},{"name":"Madagaskar","code":"MG"},{"name":"Malawi","code":"MW"},{"name":"Malaysia","code":"MY"},{"name":"Malediven","code":"MV"},{"name":"Mali","code":"ML"},{"name":"Malta","code":"MT"},{"name":"Marshallinseln","code":"MH"},{"name":"Martinique","code":"MQ"},{"name":"Mauretanien","code":"MR"},{"name":"Mauritius","code":"MU"},{"name":"Mayotte","code":"YT"},{"name":"Mexiko","code":"MX"},{"name":"Mikronesien","code":"FM"},{"name":"Moldawie","code":"MD"},{"name":"Monaco","code":"MC"},{"name":"Mongolei","code":"MN"},{"name":"Montenegro","code":"ME"},{"name":"Montserrat","code":"MS"},{"name":"Marokko","code":"MA"},{"name":"Mosambik","code":"MZ"},{"name":"Myanmar","code":"MM"},{"name":"Namibia","code":"NA"},{"name":"Nauru","code":"NR"},{"name":"Népal","code":"NP"},{"name":"Niederlande","code":"NL"},{"name":"Neukaledonien","code":"NC"},{"name":"Neuseeland","code":"NZ"},{"name":"Nicaragua","code":"NI"},{"name":"Niger","code":"NE"},{"name":"Nigeria","code":"NG"},{"name":"Niue","code":"NU"},{"name":"Norfolkinsel","code":"NF"},{"name":"Nordkorea","code":"KP"},{"name":"Nördliche Marianen","code":"MP"},{"name":"Norwegen","code":"NO"},{"name":"Oman","code":"OM"},{"name":"Pakistan","code":"PK"},{"name":"Palau","code":"PW"},{"name":"Palästina","code":"PS"},{"name":"Panama","code":"PA"},{"name":"Papua-Neuguinea","code":"PG"},{"name":"Paraguay","code":"PY"},{"name":"Peru","code":"PE"},{"name":"Philippinen","code":"PH"},{"name":"Pitcairn","code":"PN"},{"name":"Polen","code":"PL"},{"name":"Portugal","code":"PT"},{"name":"Puerto Rico","code":"PR"},{"name":"Katar","code":"QA"},{"name":null,"code":"XK"},{"name":"Réunion","code":"RE"},{"name":"Rumänien","code":"RO"},{"name":"Russland","code":"RU"},{"name":"Ruanda","code":"RW"},{"name":"Saint-Barthélemy","code":"BL"},{"name":"Sankt Helena","code":"SH"},{"name":"St. Kitts und Nevis","code":"KN"},{"name":"Saint Lucia","code":"LC"},{"name":"Saint Martin","code":"MF"},{"name":"Saint-Pierre und Miquelon","code":"PM"},{"name":"Saint Vincent und die Grenadinen","code":"VC"},{"name":"Samoa","code":"WS"},{"name":"San Marino","code":"SM"},{"name":"São Tomé und Príncipe","code":"ST"},{"name":"Saudi-Arabien","code":"SA"},{"name":"Senegal","code":"SN"},{"name":"Serbien","code":"RS"},{"name":"Seychellen","code":"SC"},{"name":"Sierra Leone","code":"SL"},{"name":"Singapur","code":"SG"},{"name":"Sint Maarten (niederl. Teil)","code":"SX"},{"name":"Slowakei","code":"SK"},{"name":"Slowenien","code":"SI"},{"name":"Salomonen","code":"SB"},{"name":"Somalia","code":"SO"},{"name":"Republik Südafrika","code":"ZA"},{"name":"Südgeorgien und die Südlichen Sandwichinseln","code":"GS"},{"name":"Südkorea","code":"KR"},{"name":"Südsudan","code":"SS"},{"name":"Spanien","code":"ES"},{"name":"Sri Lanka","code":"LK"},{"name":"Sudan","code":"SD"},{"name":"Suriname","code":"SR"},{"name":"Svalbard und Jan Mayen","code":"SJ"},{"name":"Swasiland","code":"SZ"},{"name":"Schweden","code":"SE"},{"name":"Schweiz","code":"CH"},{"name":"Syrien","code":"SY"},{"name":"Taiwan","code":"TW"},{"name":"Tadschikistan","code":"TJ"},{"name":"Tansania","code":"TZ"},{"name":"Thailand","code":"TH"},{"name":"Timor-Leste","code":"TL"},{"name":"Togo","code":"TG"},{"name":"Tokelau","code":"TK"},{"name":"Tonga","code":"TO"},{"name":"Trinidad und Tobago","code":"TT"},{"name":"Tunesien","code":"TN"},{"name":"Türkei","code":"TR"},{"name":"Turkmenistan","code":"TM"},{"name":"Turks- und Caicosinseln","code":"TC"},{"name":"Tuvalu","code":"TV"},{"name":"Uganda","code":"UG"},{"name":"Ukraine","code":"UA"},{"name":"Vereinigte Arabische Emirate","code":"AE"},{"name":"Vereinigtes Königreich","code":"GB"},{"name":"Vereinigte Staaten von Amerika","code":"US"},{"name":"Uruguay","code":"UY"},{"name":"Usbekistan","code":"UZ"},{"name":"Vanuatu","code":"VU"},{"name":"Venezuela","code":"VE"},{"name":"Vietnam","code":"VN"},{"name":"Wallis und Futuna","code":"WF"},{"name":"Westsahara","code":"EH"},{"name":"Jemen","code":"YE"},{"name":"Sambia","code":"ZM"},{"name":"Simbabwe","code":"ZW"}];
      vm.countries = globalData.countries;
        // console.log(vm.make)
        // console.log(vm.onSelect)
        // console.log(vm.address)

      vm.$onInit = function() {
        vm.tmpResult = "";
        // if(!vm.address){
        //     console.error("CRITICAL ERRRORR AUFPASSEN VM ADDRESS NICHT GESETZT")
        //     // vm.address = {};
        // }
      };


      vm.getLocation = function(val) {

        return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
          //return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + val + '&language=de&components=country:DE')
          params: {
            language: 'de',
            address: val,
            componentRestrictions: { country: 'DE' },
            key: 'AIzaSyCGddpVu_R1w4VUqGLBcOpnh_vrm4oD8cs',
            components: 'country:DE',
            types: ['(cities)'],
            sensor: false
          }
        })
        .then(function(response){
          vm.tmpResult = response.data.results;
          return response.data.results.map(function(item){
            return item.formatted_address;
          });
        });
      };

      vm.update = function(key, value){
        vm.onUpdate({'value': {'key': key, 'value': value}});
        // type!
      };

      /*vm.onchange = function() {
        vm.isValid =
      }*/

      vm.onSelectCity = function (paddr) {
        var addr = paddr.address_components;
        var addrObj = {};

        addrObj = {
            route: "",
            postal_code: "",
            country: "",
            locality: ""
        };

        for(var key in addr)
          if(addr[key]['types'].indexOf("street_number") != -1)
              addrObj.route = addr[key].short_name;
          else if(addr[key]['types'].indexOf("route") != -1)
              if(addrObj.route)
                  addrObj.route = addr[key].short_name + " " + addrObj.route;
              else
                  addrObj.route = addr[key].short_name;
          else if(addr[key]['types'].indexOf("locality") != -1)
              addrObj.locality = addr[key].long_name;
          else if(addr[key]['types'].indexOf("postal_code") != -1)
              addrObj.postal_code = addr[key].short_name;
          else if(addr[key]['types'].indexOf("country") != -1)
              addrObj.country = addr[key].long_name;

        addrObj.country = vm.countries.find(o => o.name == addrObj.country);
        // console.log(addrObj, vm.formData)
        $timeout( () => {
          if(vm.address.route) 
            delete addrObj.route;
          
          vm.address = Object.assign(vm.address, addrObj);
          if(vm.onSelect)
              vm.onSelect();
        });
        return;
      };

        vm.onSelectCity2 = function ($item, $model, $label) {
        console.log($item, $model, $label);
        console.log(vm.address.route);

            var addr;
            for(var key in vm.tmpResult)
                if(vm.tmpResult[key].formatted_address == $item)
                    addr = vm.tmpResult[key].address_components;

            var addrObj = {};

            //addrObj.route = addr[1] + " " + addr[0]
            addrObj = {
                route: "",
                postal_code: "",
                country: "",
                locality: ""
            };

            for(key in addr)
                if(addr[key]['types'].indexOf("street_number") != -1)
                    addrObj.route = addr[key].short_name;
                else if(addr[key]['types'].indexOf("route") != -1)
                    if(addrObj.route)
                        addrObj.route = addr[key].short_name + " " + addrObj.route;
                    else
                        addrObj.route = addr[key].short_name;
                else if(addr[key]['types'].indexOf("locality") != -1)
                    addrObj.locality = addr[key].long_name;
                else if(addr[key]['types'].indexOf("postal_code") != -1)
                    addrObj.postal_code = addr[key].short_name;
                else if(addr[key]['types'].indexOf("country") != -1)
                    addrObj.country = addr[key].long_name;

            addrObj.country = vm.countries.find(o => o.name == addrObj.country);
            // console.log(addrObj, vm.formData)
            vm.address = Object.assign(vm.address, addrObj);
            if(vm.onSelect)
                vm.onSelect();
            return;
        };



      vm.modelOptions = {
        //types: ['(cities)'],
        componentRestrictions: { country: 'DE' }
      };

      /*
      vm.modelOptions = {
        debounce: {
          default: 250,
          blur: 0
        },
        types: ['(cities)'],
        componentRestrictions: { country: 'DE' },
        getterSetter: true
      };*/
    }
})();

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpResponsiveTab', {
            bindings: {
                selectedTab: '=',
                tab: '@'
            },
            controller: responsiveTabController,
            controllerAs: 'vm',
            transclude: true,
            template: function ($element, $attrs) {
              return `
                <div ng-if="!vm.mobile" ng-show="vm.selectedTab == vm.tab" class="tab-content" ng-view >
                    <ng-transclude></ng-transclude>
                </div>

                {{FormCtrl.testtesttest}}

                <div ng-if="vm.mobile" uib-accordion-group class="clAccordion panel-default bxp-accordion-{{vm.tab}}">
                  <uib-accordion-heading>
                    {{vm.tab}}
                  </uib-accordion-heading>
                    <ng-transclude></ng-transclude>                
                </div>
              `;
            }

        });

    responsiveTabController.$inject = ['$rootScope', '$scope', "$q"];

    /* @ngInject */
    function responsiveTabController($rootScope, $scope, $q) {
        var vm = this;
        vm.mobile = isMobile.any;

        vm.$onInit = () => {
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpResponsiveTabs', {
            bindings: {
                selectedTab: '=',
                tabs: '=',
                submitForm: '=',
                closeModal: '='
            },
            controller: responsiveTabsController,
            controllerAs: 'vm',
            transclude: true,
            template: function ($element, $attrs) {
                return `
                    <div class="bxp-container">
                        
                        <div ng-if="!vm.mobile" class="tabbable tabbable-tabdrop bxp-modal-box" >
                            <ul class="nav nav-tabs">
                                <li ng-class="{'active': tab === vm.selectedTab}" ng-repeat="tab in vm.tabs track by $index" tab="tab">
                                    <a ng-click="vm.setSelectedTab(tab)">{{tab}}</a>
                                </li>
                            </ul>
                        </div>

                        <div ng-if="!vm.mobile">
                            <ng-transclude></ng-transclude>
                        </div>

                        <uib-accordion ng-if="vm.mobile" close-others="false">
                            <ng-transclude></ng-transclude>
                        </uib-accordion>

                        <div class="bxp-button-container group">
                            <span class="ta-right float-right">
                                <button type="button" class="btn btn-primary bxp-button-ok" ng-click="vm.submitForm()">Speichern</button>
                                <button type="button" class="btn default bxp-button-ok" ng-click="vm.closeModal()">Abbrechen</button>
                            </span>
                        </div>
                    </div>
                `;
            }

        });

    responsiveTabsController.$inject = ['$rootScope', '$scope', "$q"];

    /* @ngInject */
    function responsiveTabsController($rootScope, $scope, $q) {
        var vm = this;
        vm.mobile = isMobile.any;
        vm.setSelectedTab = setSelectedTab;

        vm.$onInit = () => {
            vm.selectedTab = vm.tabs[0];
        };

        function setSelectedTab(tab) {
            vm.selectedTab = tab;
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpResponsiveInModal', {
            bindings: {
                selectedTab: '=',
                submitForm: '=',
                closeModal: '='
            },
            controller: responsiveDetailController,
            controllerAs: 'vm',
            transclude: true,
            template: function ($element, $attrs) {
                return `
                    <div class="bxp-form-anschrift bxp-form" close-esc-key>
                        <div ng-if="!vm.mobile">
                            <ng-transclude></ng-transclude>
                        </div>

                        <uib-accordion ng-if="vm.mobile" close-others="false">
                            <ng-transclude></ng-transclude>
                        </uib-accordion>

                        <div class="bxp-button-container group">
                            <span class="ta-right float-right">
                                <button type="button" class="btn btn-primary bxp-button-ok" ng-click="vm.submitForm()">Speichern</button>
                                <button type="button" class="btn default bxp-button-ok" ng-click="vm.closeModal()">Abbrechen</button>
                            </span>
                        </div>
                    </div>
                `;
            }

        });

    responsiveDetailController.$inject = ['$rootScope', '$scope', "$q"];

    /* @ngInject */
    function responsiveDetailController($rootScope, $scope, $q) {
        var vm = this;
        vm.mobile = isMobile.any;
        vm.setSelectedTab = setSelectedTab;

        vm.$onInit = () => {
            
        };

        function setSelectedTab(tab) {
            vm.selectedTab = tab;
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpUploadComponent', {
            bindings: {
                uploads: '=',
                onsave: '=',
                ondelete: '=',
                note: '=',
                hide: '=',
                uploadtype: '@',
                hideContent: '=',
                makeDisabled: '=',
                disablesub: '='
            },
            controller: UploadComponentController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
                return `
                    <div ng-if="!vm.hideContent" ng-show="vm.uploads.length > 0" class="bxp-form-container group">
                        <ul class="table table-uploads table-striped table-bordered">
                            <li ng-repeat="item in vm.uploads track by $index">
                                <div ng-class="{'activex': vm.selected === $index}" ng-click="vm.id = item.id" class="bxp-grundatensatz" ng-dblclick="vm.editEntry()">
                                    <div class="hover-text-field">
                                    <div ng-if="item.uploadtype" ng-class="{ 'bxp-rechnung-ic' : item.uploadtype == 'rechnung', 'bxp-normal-ic' : item.uploadtype == 'normal', 'bxp-event-ic' : item.uploadtype == 'event'}"></div>
                                    <input ng-if="vm.note" type="text" ng-model="item.note" placeholder="">
                                    <input type="text" id="editInput" ng-if="item.editMode" ng-enter="vm.saveEntry()" ng-blur="vm.saveEntry()" ng-keyup="onInputKeyup($event)" ng-model="item.refName" placeholder="" auto-focus>

                                        <span class="inline-block" ng-if="!item.editMode">{{item.refName}}
                                        <i class="fa fa-cloud-download" ng-click="vm.download('uploads/', item.filename)"></i>
                                        <div ng-if="!vm.hide" style="display: none;" class="animate-show float-right">
                                            <i class="fa fa-trash bauexperts-blue" ng-click="vm.deleteEntry(item.id)"></i>
                                            <i class="fa fa-pencil bauexperts-blue" ng-click="vm.editEntry(item.id)"></i>
                                        </div>
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <span>
                      <a ng-disabled="vm.makeDisabled" ng-if="!vm.hide" ng-click="vm.newDocument()" class="bxp-rounded-button add small">
                          <i class="fa fa-plus"></i>
                      </a>
                    </span>
                `;
            }

        });

    UploadComponentController.$inject = ['$rootScope', 'modalService', '$http'];

    /* @ngInject */
    function UploadComponentController($rootScope, modalService, $http) {
        var vm = this;

        vm.$onInit = function () {
            vm.id = false;
            vm.recentEl = false;
            if(vm.uploads)
                vm.uploadsLen = vm.uploads.length;
        };


        function startBlobDownload(dataBlob, suggestedFileName) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // for IE
                console.log("hier");
                window.navigator.msSaveOrOpenBlob(dataBlob, suggestedFileName);
            } else {
                // for Non-IE (chrome, firefox etc.)
                console.log("hier2");
                var urlObject = URL.createObjectURL(dataBlob);

                var downloadLink = angular.element('<a>Download</a>');
                downloadLink.css('display', 'none');
                downloadLink.attr('href', urlObject);
                downloadLink.attr('download', suggestedFileName);
                angular.element(document.body).append(downloadLink);
                downloadLink[0].click();

                // cleanup
                downloadLink.remove();
                URL.revokeObjectURL(urlObject);
            }
        }

        vm.download = function(fileResourceUrl, fileName) {
             var url = $rootScope.ip + fileResourceUrl + fileName;
             console.log(url);
             console.log($rootScope.ip + 'uploads/' + fileName);

             $http({
                 method: 'GET',
                 url: url,
                 responseType: 'blob'
             }).then(function (response) {
                 var blob = response.data;
                 startBlobDownload(blob, fileName);
             }, () => $rootScope.sharedService.alert("File not found.", 'danger'));
         };

        vm.editEntry = function (id = -1) {
            // console.log(id);
            if(id == -1 && vm.id == false)
                return console.error("Fehler bei editEntry");

            if(id == -1)
                id = vm.id;

            if(vm.recentEl)
                vm.recentEl.editMode = false;

            var idx = vm.uploads.findIndex(o => o.id == id);

            vm.recentEl = vm.uploads[idx];
            vm.uploads[idx].editMode = true;
            vm.id = id;
        };

        vm.saveEntry = function (id = -1) {
            if(vm.id == false)
                return console.error("Fehler bei saveEntry");

            var idx = vm.uploads.findIndex(o => o.id == vm.id);
            vm.uploads[idx].editMode = false;
        };

        vm.deleteEntry = function (id = -1) {

            if(id == -1)
                return console.error("Fehler bei deleteEntry");

            var idx = vm.uploads.findIndex(o => o.id == id);
            $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                if (vm.ondelete)
                    vm.ondelete(vm.uploads[idx].id);
            });
        };

        vm.newDocument = function () {
            if(vm.makeDisabled)
                return;
            // console.log("HI");
            //$scope.$close();
            // console.log(vm.uploadtype);
            // console.log(vm);

            console.log('====================================');
            console.log('liste', vm.uploads);
            console.log('====================================');

            var obj = {
              uploads: vm.uploads,
              callback: vm.onsave
            };
            if(vm.uploadtype)
              obj['uploadtype'] = vm.uploadtype;

            obj.single = true;

            // console.log(obj);
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then((res) => {
                console.log('====================================');
                console.log('yükleme sonrası ', res);
                console.log('====================================');
                if(vm.disablesub && vm.uploadsLen < vm.uploads.length)
                    vm.disablesub = false;
            });
        };

    }
})();

(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .component('bxpImageUpload', {
            bindings: {
                uploads: '=',
                onsave: '=',
                ondelete: '=',
                note: '=',
                hide: '=',
                uploadtype: '@',
                hideContent: '=',
                makeDisabled: '=',
                disablesub: '='
            },
            controller: ImageUploadComponentController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
                return `
                    <div ng-if="!vm.hideContent" ng-show="vm.uploads.length > 0" class="bxp-form-container group">
                        <ul class="table table-uploads table-striped table-bordered">
                            <li ng-repeat="item in vm.uploads track by $index">
                                <div ng-class="{'activex': vm.selected === $index}" ng-click="vm.id = item.id" class="bxp-grundatensatz" ng-dblclick="vm.editEntry()">
                                    <div class="hover-text-field" style="width:170px; display: flex; flex-wrap: wrap; justify-content: space-around; padding: 12px 12px;">
                                    <div ng-if="item.uploadtype" ng-class="{ 'bxp-rechnung-ic' : item.uploadtype == 'rechnung', 'bxp-normal-ic' : item.uploadtype == 'normal', 'bxp-event-ic' : item.uploadtype == 'event'}"></div>
                                    <input ng-if="vm.note" type="text" ng-model="item.note" placeholder="">
                                    <input type="text" id="editInput" ng-if="item.editMode" ng-enter="vm.saveEntry()" ng-blur="vm.saveEntry()" ng-keyup="onInputKeyup($event)" ng-model="item.refName" placeholder="" auto-focus>
                                        <img style="max-width: 146px;" ng-src="https://picsum.photos/150/150">
                                        <span style="margin: 5px 0 !important; font-size:10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" class="inline-block" ng-if="!item.editMode">{{item.refName}}
                                        <div ng-if="!vm.hide" style="display: none;" class="animate-show float-right">
                                            <i class="fa fa-trash bauexperts-blue" ng-click="vm.deleteEntry(item.id)"></i>
                                            <i class="fa fa-pencil bauexperts-blue" ng-click="vm.editEntry(item.id)"></i>
                                        </div>
                                        </span>
                                        <i style="margin-left: 0 !important;" class="fa fa-cloud-download" ng-click="vm.download('uploads/', item.filename)"></i>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <span>
                      <a ng-disabled="vm.makeDisabled" ng-if="!vm.hide" ng-click="vm.newDocument()" class="bxp-rounded-button add small">
                          <i class="fa fa-plus"></i>
                      </a>
                    </span>
                `;
            }

        });

        ImageUploadComponentController.$inject = ['$rootScope', 'modalService', '$http'];

    /* @ngInject */
    function ImageUploadComponentController($rootScope, modalService, $http) {
        var vm = this;

        vm.$onInit = function () {
            vm.id = false;
            vm.recentEl = false;
            if(vm.uploads)
                vm.uploadsLen = vm.uploads.length;
        };


        function startBlobDownload(dataBlob, suggestedFileName) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // for IE
                console.log("hier");
                window.navigator.msSaveOrOpenBlob(dataBlob, suggestedFileName);
            } else {
                // for Non-IE (chrome, firefox etc.)
                console.log("hier2");
                var urlObject = URL.createObjectURL(dataBlob);

                var downloadLink = angular.element('<a>Download</a>');
                downloadLink.css('display', 'none');
                downloadLink.attr('href', urlObject);
                downloadLink.attr('download', suggestedFileName);
                angular.element(document.body).append(downloadLink);
                downloadLink[0].click();

                // cleanup
                downloadLink.remove();
                URL.revokeObjectURL(urlObject);
            }
        }

        vm.download = function(fileResourceUrl, fileName) {
             var url = $rootScope.ip + fileResourceUrl + fileName;
             console.log(url);
             console.log($rootScope.ip + 'uploads/' + fileName);

             $http({
                 method: 'GET',
                 url: url,
                 responseType: 'blob'
             }).then(function (response) {
                 var blob = response.data;
                 startBlobDownload(blob, fileName);
             }, () => $rootScope.sharedService.alert("File not found.", 'danger'));
         };

        vm.editEntry = function (id = -1) {
            // console.log(id);

            console.log('====================================');
            console.log(id);
            console.log('====================================');
            if(id == -1 && vm.id == false)
                return console.error("Fehler bei editEntry");

            if(id == -1)
                id = vm.id;

            if(vm.recentEl)
                vm.recentEl.editMode = false;

            var idx = vm.uploads.findIndex(o => o.id == id);

            vm.recentEl = vm.uploads[idx];
            vm.uploads[idx].editMode = true;
            vm.id = id;
        };

        vm.saveEntry = function (id = -1) {
            if(vm.id == false)
                return console.error("Fehler bei saveEntry");

            var idx = vm.uploads.findIndex(o => o.id == vm.id);
            vm.uploads[idx].editMode = false;
        };

        vm.deleteEntry = function (id = -1) {

            if(id == -1)
                return console.error("Fehler bei deleteEntry");

            var idx = vm.uploads.findIndex(o => o.id == id);
            $rootScope.sharedService.showConfirmDialog("delete").then(function () {
                if (vm.ondelete)
                    vm.ondelete(vm.uploads[idx].id);
            });
        };

        vm.newDocument = function () {
            if(vm.makeDisabled)
                return;
            // console.log("HI");
            //$scope.$close();
            // console.log(vm.uploadtype);
            // console.log(vm);

            console.log('====================================');
            console.log('liste', vm.uploads);
            console.log('====================================');

            var obj = {
              uploads: vm.uploads,
              callback: vm.onsave
            };
            if(vm.uploadtype)
              obj['uploadtype'] = vm.uploadtype;

            obj.single = true;

            // console.log(obj);
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then((res) => {
                console.log('====================================');
                console.log('yükleme sonrası ', res);
                console.log('====================================');
                if(vm.disablesub && vm.uploadsLen < vm.uploads.length)
                    vm.disablesub = false;
            });
        };

    }
})();

MetronicApp.directive('onMouseClick', function($timeout) {
    return {
        replace: true,
        transclude: false,
        link: ["scope", "element", "attrs", "ctrl", function (scope, element, attrs, ctrl) {
          // console.log(attrs)
          //var htmlElement = (attrs.id == "formKunde") ? 'body' : 'body #' + attrs.id;
          var htmlElement = 'body #' + attrs.id;
          var toBind = angular.element(document).find(htmlElement).parent().parent().parent();

          //console.log('click.' + attrs.id);





            toBind.bind('click.' + attrs.id, function (event) {
              //            console.log(event.target.nodeName);


              /*
              TO SEE IF element has a PARENT!!!!
              if($(this).closest(".last").length > 0) {
                 alert("it's inside");
              }*/

                //console.log(angular.element(event.target).parents(".bxp-openedDetails1").length <=);
                if(angular.element(event.target).closest(".bxp-openedDetails1").length > 0)
                {
                  //console.log(angular.element(event.target).parents())
                  return;
                }

                // console.log("entering", attrs, event.target.nodeName);
                // console.log(event.target.className);
                // if(event.target.className.indexOf("ui-grid-filter") >= 0)
                //     return;
                //     console.log("still");
                if (event.target.nodeName != "TD" && event.target.className.indexOf("ui-grid-cell-content") == -1 && event.target.nodeName != "A" && event.target.nodeName != "BUTTON" && event.target.nodeName != "I"/* && scope.state*/) {
                      scope.$apply(function (){
                          scope.$eval(attrs.onMouseClick);
                      });

                    event.preventDefault();
                }
            });

            scope.$on('$destroy', function () {
              //console.log("destroyed", htmlElement)
              toBind.unbind('click.' + attrs.id);
            });
        }]
    };
})

.directive('compareTo', function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
            ngModel.$validate();
      });
    }
  };
})

.directive("formOnChange", function ($parse) {
    return {
        require: "form",
        link: function (scope, element, attrs) {
            var cb = $parse(attrs.formOnChange);
            element.on("change", function () {
                cb(scope);
            });
        }
    };
})

.directive('greaterThen', function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=greaterThen"
    },

    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.greaterThen = function(modelValue) {
        if(modelValue && scope.otherModelValue)
          return modelValue >= scope.otherModelValue;
        return true;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
})

.directive('verifyAge', function() {
  return {
    require: "ngModel",
    link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.verifyAge = function(modelValue) {
            dateToValidate = new Date(modelValue);
            return new Date((dateToValidate.getFullYear())+18, dateToValidate.getMonth(), dateToValidate.getDate()) <= new Date();
        };
    }
  };
})

.directive('closeEscKey', function($timeout) {
    return {
        scope: {
            state: '=ngModel',
            func: '=func'
            //formName: '=name'
        },
        replace: true,
        transclude: false,
        link: function (scope, element, attrs, ctrl) {
          //var htmlElement = (attrs.id == "formKunde") ? 'body' : 'body #' + attrs.id;
          var htmlElement = 'body #' + attrs.id;
          var toBind;
          toBind = angular.element(document).find(htmlElement).parent().parent().parent();
          toBind.bind('keydown', function (event) {

              if(event.which === 27 && scope.state) {  // 27 = esc key

                  scope.$apply(function (){
                    if(scope.func)
                      scope.$eval(scope.func());
                  });

                  event.preventDefault();
              }
          }),

          scope.$on('$destroy', function () {
            toBind.unbind('keydown');
          });
        }
    };
});

MetronicApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})
/*
.directive('closeEscKey', function () {
  return function (scope, element, attrs) {
    angular.element(document).find('body').bind('keydown keypress', function (event) {
        if(event.which === 27 && attrs.closeEscKey == 'true') {  // 27 = esc key
            console.log(attrs.closeEscKey);
            scope.$apply(function (){
              scope.$eval(scope.closeModal());
            });

            event.preventDefault();
        }
    })
}
})*/

.directive('escKey', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress keyup', function (event) {
      // console.log("ESC PRESSED");
      if(event.which === 27) { // 27 = esc key
        // console.log("reached escKey");
        scope.$apply(function (){
          scope.$eval(attrs.escKey);

        });

        event.preventDefault();
      }
    });
  };
})

.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            //scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            //});
        });
    };
})

.directive('autoFocus', ['$timeout', function($timeout) {
    return {
        link: {
            pre: function preLink(scope, element, attr) {
                // console.log('prelink called');
                // this fails since the element hasn't rendered
                //element[0].focus();
            },
            post: function postLink(scope, element, attr) {
                // console.log('postlink called');
                // this succeeds since the element has been rendered

                $timeout(function () {
                    if(attr.autoFocus == "false")
                        return;
                    element[0].focus();
                }, 0);
            }
        }
    };
}])

.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }])

.filter('distance2', function () {
    return function (input) {
        if (input >= 1000) {
            if(input ==99999000)
                return "Fehler";
            return (input/1000).toLocaleString('de', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) + ' km';
        } else {
            return input + ' m';
        }
    };
})

.filter('distance3', function ()  {
return function (input) {
  console.log(input);
  input = "" + input;
  input = input.replace(/\./g, '');
  console.log(input);
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
};
})

.filter('myDateFilter', ['$filter',
  function($filter) {
    return function(input) {
      var inp = new Date(0, 0, 0, 0, 0, input); // assumes minutes as an input
      var m = inp.getMinutes();
      var h = inp.getHours();
      var d = inp.getDay();

      if(h<10)
        h = "0" + h;
      if(m<10)
        m = "0" + m;

      if(h == "00")
        return m + " Min.";
      else if(m == "00")
        return h + " Std.";
      else
        return h + " Std. " + m + " Min.";
    };
  }
])

.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);