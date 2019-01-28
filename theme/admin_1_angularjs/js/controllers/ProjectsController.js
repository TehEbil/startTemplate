(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$rootScope', '$scope', '$stateParams', 'modalService', 'ProjectHandler', '$interval', '$timeout', 'uiGridConstants'];

    /* @ngInject */
    function ProjectsController($rootScope, $scope, $stateParams, modalService, ProjectHandler, $interval, $timeout, uiGridConstants) {
        var vm = this;
        vm.title = 'ProjectsController';
        vm.type = "Protocol";
        vm.data = undefined
        vm.id = false;
        vm.allData = {};
        vm.untouched = [];
        vm.selected = {};

        vm.newProject = newProject;
        vm.editProject = editProject;
        // vm.deleteData = deleteData;
        // vm.setColor = setColor;

        vm.isMobile = isMobile.any;
        vm.mobileAmount = 50;

        if(vm.isMobile) // for blue loading bar
            $rootScope.$broadcast('loadTable');

        vm.isEmployee = true;

        init();

        vm.columnDefs = [
            { field: 'orderDatas.otherInformations.orderDate', width: 120, displayName: "Erst. Datum", type : 'date',
                    cellFilter : 'date:"dd.MM.yyyy"',
                    filterCellFiltered : 'true',
                    cellTemplate:
                `
                <div tooltip-append-to-body="true"
                  uib-tooltip-html="!COL_FIELD ? '' : 'um ' + (COL_FIELD | date:'HH:mm') + ' Uhr'"
                  tooltip-class="" class="ui-grid-cell-contents">
                    {{grid.getCellValue(row, col) | date:'dd.MM.yyyy'}}
                </div>
                `,
              sort: {
                direction: uiGridConstants.DESC
              },
              filters: [{
                  condition: function(term, value){
                      if (!term) return true;
                      var valueDate = createDate(value);
                      var replaced = term.replace(/\\/g,'');
                      var termDate = createDate(replaced);
                      return valueDate >= termDate;
                  },
                  placeholder: ' from'
                  
              }, {
                  condition: function(term, value){
                      if (!term) return true;
                      var valueDate = createDate(value);
                      var replaced = term.replace(/\\/g,'');
                      var termDate = createDate(replaced);
                      return valueDate <= termDate;
                    },
                  placeholder: ' to'
              }]
            },
            { field: 'id', displayName: "ID", width: 120 },
            { field: 'projectNumber', displayName: "ProjektNummer", width: 120 },
            { field: 'ownPerformanceBuilder', displayName: "Name" },
            { field: 'orderDatas.customer.mobile', displayName: "Telefon", visible: false},
            { field: 'orderDatas.customer.email', displayName: "E-Mail", visible: false, cellTemplate: 
                `<div tooltip-append-to-body="true"
                  uib-tooltip-html="COL_FIELD"
                  class="ui-grid-cell-contents">
                    {{COL_FIELD}}
                </div>`
            },
            { field: 'orderDatas.customer.address.route', displayName: "Straße (Kunde)"},
            { field: 'orderDatas.customer.address.postal_code', displayName: "PLZ (Kunde)", width: 89},
            { field: 'orderDatas.customer.address.locality', displayName: "Stadt (Kunde)"},
        ];

        vm.menuOptions = [
            // NEW IMPLEMENTATION
            {
                text: 'Neu',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    vm.newData()
                }
            },
            {
                text: 'Bearbeiten',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    vm.editData()
                }
            },
            {
                text: 'Löschen',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    vm.deleteData()
                }
            },
            // {
            //     text: 'Farben',
            //     children: [
            //         {
            //             text: 'Rot',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('red')
            //             }
            //         },
            //         {
            //             text: 'Gelb',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('yellow')
            //             }
            //         },
            //         {
            //             text: 'Grün',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('green')
            //             }
            //         },
            //         {
            //             text: 'Blau',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('blue')
            //             }
            //         },
            //         null, // Dividier
            //         {
            //             text: 'Zurücksetzen',
            //             click: function ($itemScope, $event, modelValue, text, $li) {
            //                 setColor('normal')
            //             }
            //         },
            //     ]
            // },
            null, // Dividier
            {
                text: 'Zurück',
                click: function ($itemScope, $event, modelValue, text, $li) {
                    return;
                }
            },
        ];

        function init() {
            ProjectHandler.getData().then((res) => {
                vm.data = res.data; // getData() should get all Projects instead of only one;
                vm.data[0].id = 1 // fakeId, it has no id;

                console.log("data", vm.data);
            });
        }

        function newProject() {

            /* you will not need project data for new */
            let obj = {
                title: 'Text Snippets',
                data: globalData.auftragsart
            };

            modalService.openMenuModal('views/text_snippets.html', 'TextSnippetsController', 'animated zoomIn', obj).then( (data) => {
                
                if (typeof data !== 'undefined') {
                    console.log('====================================');
                    console.log('data', data.value);
                    console.log('====================================');   
                    let newObj = {
                        data: {
                            "id": 1,
                            "projectNumber": "BXP-PRN-003",
                            "projectName": "Project Name Field",
                            "ownPerformanceBuilder": "Mahmut Akyol",
                            "documents": [
                              {
                                "id": 1,
                                "name": "Test Dökümanı 1",
                                "document": {
                                  "id": 1,
                                  "filename": "file1.txt",
                                  "filepath": "public/uploads/file1.txt",
                                  "oldfilename": "expFile.txt",
                                  "refName": "file1.txt",
                                  "date": "2018-11-12T11:39:29.137Z",
                                  "editMode": false
                                },
                                "isDisplay": true
                              },
                              {
                                "id": 2,
                                "name": "Test Dökümanı 2",
                                "document": {
                                  "id": 2,
                                  "filename": "Ekran Resmi 2018-11-22 13.12.32.png",
                                  "filepath": "public/uploads/1-Ekran Resmi 2018-11-22 13.12.32.png",
                                  "oldfilename": "Ekran Resmi 2018-11-22 13.12.32.png",
                                  "refName": "Ekran Resmi 2018-11-22 13.12.32.png",
                                  "date": "2018-11-12T11:39:29.137Z",
                                  "editMode": false
                                },
                                "isDisplay": true
                              },
                              {
                                "id": 3,
                                "name": "Test Dökümanı 3",
                                "document": {
                                  "id": 3,
                                  "filename": "4-cv.docx",
                                  "filepath": "public/uploads/4-cv.docx",
                                  "oldfilename": "cv.docx",
                                  "refName": "4-cv.docx",
                                  "date": "2019-01-03T08:18:12.080Z",
                                  "editMode": false
                                },
                                "isDisplay": true
                              },
                              {
                                "id": 4,
                                "name": "Test Dökümanı 4",
                                "isDisplay": true
                              }
                            ],
                            "intenalNotes": "test text field",
                            "orderDatas": {
                              "customer": {
                                "customerNumber": "BXP-105",
                                "isCompany": "invidual",
                                "selectedGen": "Mr.",
                                "selectedTit": "Prof. Dr.",
                                "firstName": "Mahmut",
                                "lastName": "Akyol",
                                "companyName": "Compact Management A.Ş.",
                                "additive": "baubasis",
                                "address": {
                                  "route": "Mecidiyekoy st.",
                                  "country": {
                                    "name": "Türkei",
                                    "code": "TR"
                                  },
                                  "postal_code": "34000",
                                  "locality": "Istanbul"
                                },
                                "phone": "+90 212 212 12 12",
                                "mobile": "+90 553 364 04 74",
                                "email": "mahmut.akyol@outlook.com.tr"
                              },
                              "object": {
                                "objectNumber": 0,
                                "objectType": "Einfamilienhaus",
                                "address": {
                                  "route": "Mecidiyekoy st.",
                                  "country": {
                                    "name": "Türkei",
                                    "code": "TR"
                                  },
                                  "postal_code": "34000",
                                  "locality": "Istanbul"
                                }
                              },
                              "otherInformations": {
                                "orderNumber": "BXP-ORD-0000-256",
                                "orderDate": "2019-01-15T21:00:00.000Z",
                                "referenceNumber": "BXP-REF-005",
                                "orderType": data
                              }
                            },
                            "detectionDatas": [
                              {
                                "number": 1,
                                "status": "status",
                                "title": "test",
                                "coverPicUrl": "https://www.picsum.photos/200/300",
                                "detection": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                "isAddProtocol": true,
                                "isAddShortInfo": true,
                                "detail": {
                                  "id": 8743,
                                  "date": "2019-01-30T21:00:00.000Z",
                                  "datetime": "2019-01-04T09:15:48.000Z",
                                  "hour": 14,
                                  "minute": 25,
                                  "testField": 1,
                                  "position": "position",
                                  "title": "title",
                                  "evaluation": {
                                    "id": "03",
                                    "name": "Abweichung von den allg. anerkannten Regeln der Technik(a.a.R.d.T.)",
                                    "shortcut": "AT"
                                  },
                                  "basics": 6,
                                  "status": {
                                    "id": 4,
                                    "name": "Mengelbeseitigung durch den Sachverständigen nicht mehr einsehbar und somit nicht mehr kontrollierbar 1Dausend 2Dausend 3Dausend"
                                  },
                                  "description": "desc",
                                  "costs": {
                                    "disposalCost": 500,
                                    "impairment": 600,
                                    "recoup": 700,
                                    "isPrint": true
                                  }
                                },
                                "documents": [
                                  {
                                    "id": 6,
                                    "filename": "2-Ekran Resmi 2018-08-03 13.48.21.png",
                                    "filepath": "public/uploads/2-Ekran Resmi 2018-08-03 13.48.21.png",
                                    "oldfilename": "Ekran Resmi 2018-08-03 13.48.21.png",
                                    "refName": "2-Ekran Resmi 2018-08-03 13.48.21.png",
                                    "date": "2019-01-14T07:51:56.272Z",
                                    "editMode": false
                                  },
                                  {
                                    "id": 7,
                                    "filename": "Ekran Resmi 2018-11-22 11.49.13.png",
                                    "filepath": "public/uploads/Ekran Resmi 2018-11-22 11.49.13.png",
                                    "oldfilename": "Ekran Resmi 2018-11-22 11.49.13.png",
                                    "refName": "Ekran Resmi 2018-11-22 11.49.13.png",
                                    "date": "2019-01-14T07:54:49.676Z",
                                    "editMode": false
                                  }
                                ]
                              },
                              {
                                "number": 2,
                                "status": "status",
                                "title": "foo",
                                "coverPicUrl": "https://www.picsum.photos/200/300",
                                "detection": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                "isAddProtocol": false,
                                "isAddShortInfo": true,
                                "detail": {
                                  "id": 8744,
                                  "date": "2019-01-24T21:00:00.000Z",
                                  "datetime": "2019-01-04T09:36:48.000Z",
                                  "hour": 14,
                                  "minute": 25,
                                  "testField": {
                                    "id": 8,
                                    "name": "Wasserhaltungsarbeiten",
                                    "group": "ROHBAU"
                                  },
                                  "position": "position",
                                  "title": "title",
                                  "evaluation": {
                                    "id": "03",
                                    "name": "Abweichung von den allg. anerkannten Regeln der Technik(a.a.R.d.T.)",
                                    "shortcut": "AT"
                                  },
                                  "basics": {
                                    "id": "03",
                                    "name": "Baubeschreibung"
                                  },
                                  "status": {
                                    "id": 2,
                                    "name": "abgestellt und durch den Sachverständigen kontrolliert"
                                  },
                                  "description": "desc",
                                  "costs": {
                                    "disposalCost": 500,
                                    "impairment": 600,
                                    "recoup": 700,
                                    "isPrint": true
                                  }
                                },
                                "documents": []
                              },
                              {
                                "number": 3,
                                "status": "status",
                                "title": "foo",
                                "coverPicUrl": "https://www.picsum.photos/200/300",
                                "detection": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                "isAddProtocol": true,
                                "isAddShortInfo": true,
                                "detail": {
                                  "id": 8745,
                                  "date": "2019-01-27T21:00:00.000Z",
                                  "datetime": "2019-01-04T09:27:48.000Z",
                                  "hour": 14,
                                  "minute": 25,
                                  "testField": {
                                    "id": 5,
                                    "name": "Brunnenbauarbeiten und Aufschlussbohrungen",
                                    "group": "ROHBAU"
                                  },
                                  "position": "position",
                                  "title": "title",
                                  "evaluation": {
                                    "id": "03",
                                    "name": "Abweichung von den allg. anerkannten Regeln der Technik(a.a.R.d.T.)",
                                    "shortcut": "AT"
                                  },
                                  "basics": {
                                    "id": "03",
                                    "name": "Baubeschreibung"
                                  },
                                  "status": {
                                    "id": 3,
                                    "name": "Mengelbeseitigung schriftlich vom BT / GU / NU bestätig und durch den Sachverständigen kontrolliert"
                                  },
                                  "description": "desc",
                                  "costs": {
                                    "disposalCost": 500,
                                    "impairment": 600,
                                    "recoup": 700,
                                    "isPrint": true
                                  }
                                },
                                "documents": []
                              }
                            ],
                            "protocolDatas": [
                              {
                                "id": 1,
                                "isLocalInspection": "inspectionYes",
                                "localInspectionDate": "2018-12-28T06:06:53.000Z",
                                "protocolType": "type 1",
                                "participants": "Mahmut, Can, Muhammed",
                                "tempreture": "26",
                                "weather": "Summer",
                                "particularties": "1. particularity, 2. particularity",
                                "reportDate": "2019-01-23T21:00:00.000Z",
                                "projectType": 3,
                                "constructionState": {
                                  "id": "04",
                                  "name": "Rohinstallation der Heizungsanlagen"
                                },
                                "acceptance": {
                                  "id": "2",
                                  "name": "Abnahme kann mit Vorbehalten erteilt werden, siehe nachstehende Begründung"
                                },
                                "acceptanceComment": "As a result of the researching of a defect has not been found.",
                                "note": "All we need a just a little lahmacun!",
                                "titlePicUrl": "https://picsum.photos/100/100/?random",
                                "date": "2019-01-23T21:00:00.000Z",
                                "members": "Mahmut, Can",
                                "documents": [
                                  {
                                    "id": 1,
                                    "filename": "file1.txt",
                                    "filepath": "public/uploads/file1.txt",
                                    "oldfilename": "expFile.txt",
                                    "refName": "file1.txt",
                                    "date": "2018-11-12T11:39:29.137Z",
                                    "editMode": false,
                                    "isAddJustName": true,
                                    "isAddAttachment": true
                                  },
                                  {
                                    "id": 2,
                                    "filename": "Ekran Resmi 2018-11-22 13.12.32.png",
                                    "filepath": "public/uploads/1-Ekran Resmi 2018-11-22 13.12.32.png",
                                    "oldfilename": "Ekran Resmi 2018-11-22 13.12.32.png",
                                    "refName": "Ekran Resmi 2018-11-22 13.12.32.png",
                                    "date": "2018-11-12T11:39:29.137Z",
                                    "editMode": false,
                                    "isAddJustName": false,
                                    "isAddAttachment": true
                                  },
                                  {
                                    "id": 3,
                                    "filename": "4-cv.docx",
                                    "filepath": "public/uploads/4-cv.docx",
                                    "oldfilename": "cv.docx",
                                    "refName": "4-cv.docx",
                                    "date": "2019-01-03T08:18:12.080Z",
                                    "editMode": false,
                                    "isAddJustName": true,
                                    "isAddAttachment": true
                                  },
                                  {
                                    "id": 8,
                                    "filename": "3-bau-logo.jpg",
                                    "filepath": "public/uploads/3-bau-logo.jpg",
                                    "oldfilename": "bau-logo.jpg",
                                    "refName": "testlogo2",
                                    "date": "2019-01-09T07:51:37.515Z",
                                    "editMode": false,
                                    "isAddJustName": true,
                                    "isAddAttachment": true
                                  }
                                ]
                              },
                              {
                                "id": 2,
                                "isLocalInspection": "inspectionNo",
                                "localInspectionDate": "",
                                "protocolType": "type 2",
                                "participants": "Mahmut, Necati",
                                "tempreture": 23,
                                "weather": "",
                                "particularties": "",
                                "reportDate": "2019-01-26T21:00:00.000Z",
                                "projectType": {
                                  "id": "02",
                                  "name": "Änderung ( Umbau / Nutzungsänderung )"
                                },
                                "constructionState": {
                                  "id": 3,
                                  "name": "Dachflächen, Dachrinnen"
                                },
                                "acceptance": {
                                  "id": "2",
                                  "name": "Abnahme kann mit Vorbehalten erteilt werden, siehe nachstehende Begründung"
                                },
                                "acceptanceComment": "test",
                                "note": "",
                                "titlePicUrl": "",
                                "date": "2019-01-25T21:00:00.000Z",
                                "members": "Necati, Mahmut, Muhammed",
                                "documents": [
                                  {
                                    "id": "",
                                    "title": ""
                                  }
                                ]
                              },
                              {
                                "id": 3,
                                "isLocalInspection": "inspectionYes",
                                "localInspectionDate": "",
                                "protocolType": "type 3",
                                "participants": "Can, Muhammed",
                                "tempreture": 18,
                                "weather": "",
                                "particularties": "",
                                "reportDate": "2019-01-29T21:00:00.000Z",
                                "projectType": {
                                  "id": 1,
                                  "name": "Errichtung ( Neubau / Erweiterung )"
                                },
                                "constructionState": {
                                  "id": 2,
                                  "name": "Rohbaufertigstellung einschließlich Zimmererarbeiten"
                                },
                                "acceptance": {
                                  "id": 1,
                                  "name": "Abnahme kann ohne Vorbehalte erteilt werden"
                                },
                                "acceptanceComment": "",
                                "note": "",
                                "titlePicUrl": "",
                                "date": "2019-01-25T21:00:00.000Z",
                                "members": "Muhammed, Necati, Can",
                                "documents": [
                                  {
                                    "id": "",
                                    "title": ""
                                  }
                                ]
                              },
                              {
                                "id": 4,
                                "isLocalInspection": true,
                                "localInspectionDate": "2019-01-22T06:54:05.605Z",
                                "protocolType": "",
                                "participants": "",
                                "tempreture": 23,
                                "weather": "",
                                "particularties": "",
                                "reportDate": "2019-01-22T06:54:05.605Z",
                                "projectType": {},
                                "constructionState": {},
                                "acceptance": {},
                                "acceptanceComment": "",
                                "note": "",
                                "selectedDetection": "",
                                "titlePicUrl": "https://picsum.photos/100/100/?random",
                                "date": "2019-01-22T06:54:05.605Z",
                                "members": "",
                                "selectedDetections": [],
                                "documents": []
                              }
                            ]
                          }, // selected Auftragsart
                        isEdit: false
                    };

                    modalService.openMenuModal('views/form_projekt.html', 'FormProjektController', 'animated zoomIn', newObj).then(
                        (data) => {
                            if (typeof data !== 'undefined') {
                                ProjectHandler.postData(data).then((res) => {
                                    console.log('====================================');
                                    console.log('response: ', res);
                                    console.log('====================================');
                                });    
                            }
                        }
                    );
                }
                
            });
            
        }

        function editProject() {
            let obj = {
                data: vm.selected,
                isEdit: true
            };

            modalService.openMenuModal('views/form_projekt.html', 'FormProjektController', 'animated zoomIn', obj).then(
                (data) => {
                    if (typeof data !== 'undefined') {
                        ProjectHandler.postData(data).then((res) => {
                            console.log('====================================');
                            console.log('response: ', res);
                            console.log('====================================');
                        });    
                    }
                }
            );
        }   
        
        $scope.$on("$destroy", function() {
            // console.log("clearing interval")
            // $interval.cancel(interval)
            // $rootScope.authService.func = null;

        });

        $rootScope.$on('selectedElement', function (event, data) {
            vm.selected = data.selected;
        });
        
    }
})();
