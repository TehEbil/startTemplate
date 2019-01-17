(function() {
    'use strict';

    angular
    .module('MetronicApp')
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = ["$rootScope", "$http", "modalService", "ProjectHandler"];

    /* @ngInject */
    function DashboardController($rootScope, $http, modalService, ProjectHandler) {
        var vm = this;
        vm.title = 'DashboardController';
        vm.alertExample = alertExample;
        vm.modalExample = modalExample;
        vm.onsave = onsave;
        vm.deleteUpload = deleteUpload;
        vm.addKunde = addKunde;
        vm.openAsPdf = openAsPdf;

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
			});
            
        }

        function openAsPdf() {
            
            var protocolNr = '1-2018-BBQ-14';
            var sv = 'Herr Frank Tekook';
            var thirdHeader = '3. Überprüfung der Abarbeitung bisher festgestellter Mängel';
            var docDefinition = {
                header: function() {
                    return [
                        {
                            style: 'table',
                            margin: [62,35,62,35],
                            table: {
                                widths: ['*', '*'],
                                headerRows: 0,
                                body: [
                                    [
                                        {text: 'Booking Summary', style: 'topHeader', alignment: 'left'},
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                footer: function(currentPage, pageCount) { 
                    return {
                        style: 'table',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        columns: [
                                            {text: `Protokoll-Nr.: ${protocolNr}`, alignment: 'left', fontSize: 10, bold: true},
                                            {text: `Seite ${currentPage.toString()} von ${pageCount}`, alignment: 'center', fontSize: 10},
                                            {text: `SV: ${sv}`, alignment: 'right', fontSize: 10}
                                        ],
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    }
                },
                content: [
                    //#region First Page Start
                    {
                        image: 'logo',
                        fit: [140, 140],
                        alignment: 'right',
                        margin: [0, 40, 32, 0]
                    },
                    {
                        columns: [
                            [
                                {
                                    text: 'BAUEXPERTS Sachverständigenorganisation | Ostwall 223 | 47798 Krefeld \n',
                                    decoration: 'underline',
                                    fontSize: 8,
                                    alignment: 'left',
                                    margin: [32, 0, 0, 0]
                                },
                                {
                                    text: 'Firma \nImmoSubstanz GmbH & Co. KG \nRathausufer 23 \nD 40231 Düsseldorf',
                                    fontSize: 8,
                                    bold: true,
                                    alignment: 'left',
                                    margin: [32, 0, 0, 0]
                                },
                            ],
                            [
                                {
                                    text: 'Ostwall 223\n 47798 Krefeld\n www.bauexperts-krefeld.de\n Telefon 02151 - 3260018\n Telefax 02151 - 3262264\n Herr Frank Tekook\n zertifizierter Sachverständiger\n für Schäden an Gebäuden & Wertermittlung\n (TÜV-PersCert) + Z€ert-Verband\n Mobil 0174 - 2010505\n frank.tekook@bauexperts.de',
                                    fontSize: 7,
                                    light: true,
                                    alignment: 'right',
                                    margin: [0, 0, 32, 0],
                                    width: 162
                                }
                            ]
                        ]
                    },
                    {
                        columns: [
                            [
                                {
                                    text: 'Datum: ',
                                    fontSize: 8,
                                    bold: true,
                                    alignment: 'left',
                                    margin: [380, 10, 0, 0]
                                }
                            ],
                            [
                                {
                                    text: '14.08.2018',
                                    fontSize: 8,
                                    bold: true,
                                    alignment: 'right',
                                    margin: [0, 10, 440, 0]
                                }
                            ]
                        ]
                    },
                    {
                        columns: [
                            [
                                {
                                    text: 'Protokoll: ',
                                    fontSize: 8,
                                    bold: true,
                                    alignment: 'left',
                                    margin: [380, 0, 0, 0]
                                }
                                
                            ],
                            [
                                {
                                    text: '1-2018-BBQ-14',
                                    fontSize: 8,
                                    bold: true,
                                    alignment: 'right',
                                    margin: [0, 0, 465, 0]
                                }
                            ]
                        ]
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    {
                        columns: [
                            {
                                text: 'Auftrags-Nr.: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: '2018-BBQ-14',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '40%'
                            },
                            {
                                text: 'Bestand-Sanierung Altbau',
                                fontSize: 10,
                                aligment: 'right',
                                margin: [0, 20, 32, 0],
                                width: '30%'
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Bauvorhaben: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 10, 0, 0],
                                width: '30%'
                            },
                            {
                                text: 'Umbau + Aufstockung eines Mehrfamilienhauses; Brehmstrasse 65; D 40239 Düsseldorf',
                                fontSize: 10,
                                alignment: 'left',
                                margin: [0, 10, 32, 0],
                                width: '70%'
                            }
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Auftraggeber: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 10, 0, 0],
                                width: '30%'
                            },
                            {
                                text: 'Firma ImmoSubstanz GmbH & Co. KG; Rathausufer 23; D 40231 Düsseldorf',
                                fontSize: 10,
                                light: true,
                                alignment: 'left',
                                margin: [0, 10, 32, 0],
                                width: '70%'
                            }
                        ]
                    },
                    {
                        text: 'Ansprechpartner: ',
                        fontSize: 10,
                        bold: true,
                        aligment: 'left',
                        margin: [32, 10, 0, 0],
                        width: '30%'
                    },
                    {
                        text: 'Frau Sprenger - Tel.: 0211-56942031 - Fax: 0211-56942060 - Mail: Csprenger@hanitax.de \nHerr Overwien - Mail: Moverwien@hanitax.de \nHerr Dr. Kind - Tel.: 0211-41819920 - Fax: 0211-882531023 - Mail: Sebastian.Kind@privatcapital.net',
                        fontSize: 10,
                        alignment: 'left',
                        margin: [32, 0, 0, 0],
                    },
                    {
                        columns: [
                            [
                                {
                                    text: [
                                        { text: 'Datum der Begehung: ', style: 'field' },
                                        { text: '09.08.2018', style: 'date' }
                                    ],
                                    fontSize: 10,
                                    bold: true,
                                    aligment: 'left',
                                    margin: [32, 10, 0, 0],
                                }
                            ],
                            [
                                {
                                    text: [
                                        { text: 'Berichtsabschluss: ', style: 'field' },
                                        { text: '14.08.2018', style: 'date' }
                                    ],
                                    fontSize: 10,
                                    bold: true,
                                    aligment: 'left',
                                    margin: [0, 10, 0, 0],
                                }
                            ]
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Protokollnummer: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 10, 0, 0],
                                width: '30%'
                            },
                            {
                                text: '1',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 10, 0, 0],
                                width: '70%'
                            }
                        ]
                    },
                    {
                        text: 'Teilnehmer: ',
                        fontSize: 10,
                        bold: true,
                        aligment: 'left',
                        margin: [32, 10, 0, 0],
                    },
                    {
                        text: 'Frau Sprenger (ImmoSubstanz GmbH & Co. KG); Herr Ringwald (Architekt); Herr Ehl (Bauleiter); Herr Tekook (Sachverständiger)',
                        fontSize: 10,
                        aligment: 'left',
                        margin: [32, 10, 32, 0],
                    },
                    {
                        text: 'Bautenstand zum Zeitpunkt der Begehung: ',
                        fontSize: 10,
                        bold: true,
                        aligment: 'left',
                        margin: [32, 10, 0, 0],
                    },
                    {
                        text: 'Rohbauarbeiten abgeschlossen, Dacheindeckung weitestgehend fertig gestellt, Fenster eingebaut, Innenputz fertig, TGA-Rohinstallationen in Arbeit, Trockenbau- und Fliesenarbeiten in Arbeit, Fassade WDVS weitestgehend fertig gestellt.',
                        fontSize: 10,
                        aligment: 'left',
                        margin: [32, 10, 32, 0],
                    },
                    {
                        columns: [
                            {
                                text: 'Der Prüfbericht darf nur ungekürzt vervielfältigt werden. Jede Veröffentlichung bedarf der vorherigen, schriftlichen Genehmigung des Sachverständigen.',
                                fontSize: 8,
                                aligment: 'center',
                                margin: [32, 30, 32, 0]
                            }
                        ]
                    },
                    //#endregion

                    //#region Object Page Start 
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14,
                                        pageBreak: 'before',
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    {
                        toc: {
                            numberStyle: { bold: true },
                            title: { text: 'Inhaltsverzeichnis: ', bold: true, fontSize: 14, margin: [32, 20, 0, 0]},
                            
                        }
                    },
                    {
                        text: 'Objekt: ',
                        fontSize: 14,
                        bold: true,
                        margin: [32, 20, 0, 0]
                    },
                    {
                        image: 'logo',
                        fit: [300, 300],
                        alignment: 'center',
                        margin: [0, 20, 0, 0],
                        width: '60%'
                    },
                    //#endregion

                    //#region Algemeine Angaben Page Start 
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14,
                                        pageBreak: 'before',
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    { 
                        text: '1. Allgemeine Angaben', 
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]

                    },
                    { 
                        text: '1.1 Leistungsbeschreibung / Leistungsabgrenzung', 
                        style: 'subHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [72, 10, 0, 0]
                    },
                    {
                        text: 'Grundlage dieses Protokolls und seiner Inhalte sind Erkenntnisse aus der Ortsbesichtigung (Sichtprüfung), sowie Inhalte aus den Archiv bzw. den zur Verfügung gestellten Unterlagen.\n\nDieses Protokoll ist kein Bausubstanz- bzw. Bauschadensgutachten. Es wurden keine Untersuchungen bezüglich des Befalls durch tierische oder pflanzliche Schädlinge oder dergleichen durchgeführt.\n\nDas Bauwerk wurde nicht nach schadstoffbelasteten Baustoffen untersucht. Eine Öffnung von Bauteilen (z.B. von Verkleidungen) zur Untersuchung der darunter befindlichen Konstruktion bzw. Materialien fand nicht statt. Die Funktionsfähigkeit einzelner Bauteile, Anlagen und technischer Einrichtungen (z.B. Heizung, Elektroanlagen) wurde nicht geprüft. Aussagen über Baumängel und Bauschäden können daher unvollständig sein.',
                        style: 'paragraph'
                    },
                    {
                        text: '1.2 Verwendete Unterlagen',
                        style: 'subHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [72, 10, 0, 0]
                    },
                    {
                        text: 'Der Auftraggeber stellte folgende Unterlagen zur Verfügung:',
                        style: 'paragraph'
                    },
                    {
                        style: 'unterlagenTable',
                        table: {
                            headerRows: 1,
                            body: [
                                [
                                    { text: 'Unterlagen', style: ['tableHeader', 'wd70'] }, 
                                    { text: 'Datum der Übergabe', style: ['tableHeader', 'wd30']}
                                ],
                                [{ text: 'Grundrisse Architekten Seidler-Ringwald, M.: 1:50: KG-01-Index G; EG-02-Index E; 1.-3. OG-03', style: 'tableContent'}, { text: '03.08.2018', style: 'tableContent'}],
                                [{ text: 'Ansicht Strasse-11-Index A; Ansicht Strasse-12-Index D', style: 'tableContent'}, { text: '03.08.2018', style: 'tableContent'}]
                            ]
                        },
                        layout: 'noBorders'
                    },
                    {
                        text: '1.3 Eigenleistungen des Bauherrn',
                        style: 'subHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [72, 10, 0, 0]
                    },
                    {
                        text: 'Der Bauherr übermimmt folgende Eigenleistungen: \nkeine',
                        style: 'paragraph'
                    },
                    {
                        text: '1.4 Terminhistorie',
                        style: 'subHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [72, 10, 0, 0]
                    },
                    {
                        text: 'Termin-/Begehungshistorie, an folgenden Tagen wurden Ortstermine bisher durchgeführt:',
                        style: 'paragraph'
                    },
                    //#endregion

                    //#region 4th Page Start 
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14,
                                        pageBreak: 'before',
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    {
                        text: '1.5 Daten der Ortsbesichtigung',
                        style: 'subHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [72, 10, 0, 0]
                    },
                    {
                        style: 'unterlagenTable',
                        table: {
                            headerRows: 1,
                            body: [
                                [{ text: 'Datum der Ortsbesichtigung:', style: ['tableContent', 'wd70']}, { text: '09.08.2018', style: ['tableContent', 'wd30']}],
                                [{ text: 'Uhrzeit: ', style: 'tableContent'}, { text: '10:00 bis 12:00', style: 'tableContent'}],
                                [{ text: 'Wetter: ', style: 'tableContent'}, { text: 'sonnig / trocken', style: 'tableContent'}],
                                [{ text: 'Temperatur: ', style: 'tableContent'}, { text: '30°C', style: 'tableContent'}],
                                [{ text: 'Teilnehmer: ', style: ['tableContent', 'wd30']}, { text: 'Frau Sprenger (ImmoSubstanz GmbH & Co. KG); Herr Ringwald (Architekt); Herr Ehl (Bauleiter); Herr Tekook (Sachverständiger)', style: ['tableContent', 'wd70']}],

                            ]
                        },
                        layout: 'noBorders'
                    },
                    {
                        text: '1.6 Allgemeine Hinweise und Anmerkungen',
                        style: 'subHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [72, 10, 0, 0]
                    },
                    {
                        text: 'Die Feststellungen in den o.g. Bereichen (Musterwohnung + Gemeinschaftseigentum) als exemplarische Feststellungen dienen zur weiteren Beachtung bei den Arbeiten in allen anderen Wohnungen und Bereichen.',
                        style: 'paragraph'
                    },
                    //#endregion

                    //#region Prüffeld Page Start 
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14,
                                        pageBreak: 'before',
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    {
                        text: '2. Prüffelder und Feststellungen zum Ortstermin ',
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Zum Ortstermin wurden folgende Prüffelder baubegleitend geprüft:',
                        style: 'paragraph'
                    },
                    {
                        columns: [
                            [
                                {
                                    ul: [
                                        { text: 'item 1', style: 'tableContent'},
                                        { text: 'item 3', listType: 'circle', style: 'tableContent' }
                                    ],
                                    margin: [32, 15, 0, 0]
                                }
                            ],
                            [
                                {
                                    ul: [
                                        { text: 'item 1', style: 'tableContent'},
                                        { text: 'item 3', listType: 'circle', style: 'tableContent' }
                                    ],
                                    margin: [0, 15, 32, 0]
                                }
                            ]
                        ]
                    },
                    //#endregion

                    //#region Detections Start
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14,
                                        pageBreak: 'before',
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    {
                        columns: [
                            {
                                text: 'Laufende Nummer: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: '1 / 1',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '70%'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Prüffelder: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: '014 - Putz - und Trockenbau',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '70%'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Beurteilung: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: 'Hinweis allgemeiner Art',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '70%'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Status: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: '',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '70%'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Lage / Position: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: '3. OG-links / Musterwohnung(WE 8) / Bilder 01-01 + 01-02',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '70%'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Feststellung: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: 'Der Innenputz (Nassputz) wurde nach den Trockenbauwänden erstellt. In den Anschlussbereichen vom Nassputz an die GK-Trockenbauwände sind, vermutlich durch die erhöhte Feuchteeinwirkung, diverse dunkle Verfärbungen und Flecken zu erkennen. Um auszuschliessen, dass sich hier Schimmelpilze bilden und verbreiten, sollten sämtliche Bereiche die so aussehen, mit Wasserstoffperoxid oder hochprozentigem Alkohol behandelt werden.',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0],
                                width: '70%'
                            },
                        ]
                    },
                    {
                        columns: [
                            [
                                {
                                    image: 'logo',
                                    fit: [150, 150],
                                    alignment: 'center',
                                    margin: [32, 15, 0, 0]
                                },
                            ],
                            [
                                {
                                    image: 'logo',
                                    fit: [150, 150],
                                    alignment: 'center',
                                    margin: [0, 15, 32, 0]
                                },
                            ]
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'schwarze Flecken in Raumecke',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [32, 20, 0, 0]
                            },
                            {
                                text: 'rechts neben dem Fenster',
                                fontSize: 10,
                                aligment: 'left',
                                margin: [0, 20, 0, 0]
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: 'Grundlagen: ',
                                fontSize: 10,
                                bold: true,
                                aligment: 'left',
                                margin: [32, 20, 0, 0],
                                width: '30%'
                            },
                            {
                                text: [
                                    { 
                                        text: 'Schimmelpilz-Leitfaden" des Umweltbundeamtes f. Mensch und Gesundheit;', 
                                        fontSize: 10,
                                        aligment: 'left',
                                        margin: [0, 20, 0, 0],
                                    },
                                    { 
                                        text: 'Schimmelpilzsanierungs-Leitfaden" des Umweltbundeamtes f. Mensch und Gesundheit; Allg. anerkannte Regeln der Technik', 
                                        fontSize: 10,
                                        aligment: 'left',
                                        margin: [0, 20, 0, 0],
                                    },
                                ],
                                width: '70%',
                                margin: [0, 20, 0, 0]
                            },
                        ]
                    },
                    //#endregion

                    //#region Sign Page Start 
                    {
                        style: 'tableExample',
                        table: {
                            widths: [550],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        fillColor: '#ccc',
                                        text: 'Baubegleitende Qualitätskontrolle',
                                        bold: true,
                                        alignment: 'center',
                                        fontSize: 14,
                                        pageBreak: 'before',
                                    },
                                ],
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                        }
                    },
                    {
                        text: thirdHeader,
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Aufgrund der noch nicht abgestellten Mängel und der noch nicht vollständig abgeschlossenen Leistungen werden folgende Kosten \n\n\tBeseitigungskosten: \nWertminderung: \nEinbehalt: \als angermessen beurteilt.',
                        style: 'paragraph'
                    },
                    {
                        text: '4. Voraussetzungen für die Erteilung der Abnahme',
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Der Status der durch die Sachverständigen festgestellten Mängel zeigt an: \n\n\tAbnahme kann nicht erteilt werden \n\nBesichtigt wurde in erster Linie die Musterwohnung im 3. OG links, da diese im Bautenstand am weitesten fertig gestellt ist. Außerdem wurde das Gemeinschaftseigentum besichtigt.',
                        style: 'paragraph'
                    },
                    {
                        text: '5. Unterschrift',
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Krefeld, den 14.08.2018',
                        style: 'paragraph'
                    },
                    {
                        image: 'sign',
                        width: 100,
                        alignment: 'left',
                        margin: [32, 15, 0, 0]
                    },
                    {
                        text: 'Herr Frank Tekook',
                        style: 'paragraph'
                    },
                    {
                        columns: [
                            [
                                {
                                    image: 'stamp',
                                    width: 150,
                                    alignment: 'left',
                                    margin: [32, 15, 0, 0]
                                },
                            ],
                            [
                                {
                                    image: 'tuv',
                                    width: 200,
                                    alignment: 'left',
                                    margin: [0, 15, 32, 0]
                                },
                            ]
                        ]
                    },
                    {
                        text: [
                            { text: 'Partner der Sachverständigenorganisation Bauexperts\n', italics: true },
                            { text: 'Staatlich geprüfter Techniker - Fachrichtung Hochbau\n', bold: true },
                            { text: 'TÜV-Rheinland zertifizierter Sachverständiger für Schäden an Gebäuden & Wertermittlung\n', bold: true },
                            { text: 'Z€rt-Verband geprüfter Sachverständiger für Schäden an Gebäuden & Wertermittlung\n', bold: true },
                            { text: 'SiGeKo - FQL geprüfter Sicherheits- und Gesundheitsschutzkoordinator nach RAB 30', bold: true },
                        ],
                        style: 'paragraph'
                    },
                    //#endregion
                ],
                images: {
                    logo: 'data:image/jpeg;base64,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'
                    ,sign: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEApgCmAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAOQWRvYmUAZAAAAAAB/9sAQwAMCAgICAgMCAgMEAsLCwwPDg0NDhQSDg4TExIXFBIUFBobFxQUGx4eJxsUJCcnJyckMjU1NTI7Ozs7Ozs7Ozs7/9sAQwENCgoMCgwODAwOEQ4ODA0RFBQPDxEUEBEYERAUFBMUFRUUExQVFRUVFRUVGhoaGhoaHh4eHh4jIyMjJycnLCws/9sAQwINCgoMCgwODAwOEQ4ODA0RFBQPDxEUEBEYERAUFBMUFRUUExQVFRUVFRUVGhoaGhoaHh4eHh4jIyMjJycnLCws/8AAEQgAhgFjAwAiAAERAQIRAv/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAAABEQIRAD8A9VooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopNwoAWkyKTcOtYWq+NPD2k5Wa4E8oz+6t8TPx64O0fiRQBvbgKWuZ8MeM7fxNdXVvBbSxLbYIlYqykE4AbH3X9ua6agAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACisvV/EmkaHGW1C4RHwMQghpmz0wg+bHv0rI07X/EWt6pbT2Wmta6Pz5ktyVWWRTnayjORyOgz7npQB1dFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUgINAC0UmaNwHU0ABIHWjIrF1TxfoGlAi4u1eXoIYP30pb+7hQcH64rH/ALX8b64Nuj6cmlwN924vT+8/74xx/wB8mgDrLu+tLCE3F5MkES9XchR+tctcePo7qd7LwxZS6pcLwXVWjt1P+0SAfzxT7XwBaTuLvxHdTavcn73msVgHsFBz+uPaultrK2soVt7OJIIkGFjjUIgH0HFAHJ/8I14o8Q4bxLqH2O3J3GysTt4/uswPP47q3NL8L6LoyKLG1QSL0mfDzZ7ncRkfhx7VsUUAVbSwtbJZFtIkhEsjSyBBt3O5yzHHc1aoooAKKKKACiiigAoopMg0ALRVJ9Y02O+j017iMXcu7ZDuy52jJzjpx61doAKKKKACiqV7rOlabMkF/dRW0kilkEzrGCBwTlsDr71nTeOfCsCln1GI4OMIHlP5IrE/WgDepK4y5+JllM32fQ7G51GdlJCqpTuB0Adj69PT8IP7P8feJCP7QuF0Wykx+5hyZtrdAcHPTqCw69O1AHQ6z4u0PQ0b7ZcK0o6W8JEk5PXG0Hj6sQK5/wDtXxh4tymiwDR7AnH2q4BEzjvt+U/oOv8AFW1o/gbQNHIlSH7VcA7vPucSvn1AwFHXsM+9b4GKAOc0XwLo+mbbm6B1C+3FpLq4y5LHjhSzAfjk+9dHjaOO1Fcd4l1y/wBU1AeFPDLD7VIp+23Kk4gTgMMjoeeT1HQcngAfr3j1LSWew0S3OoXVsjvO4ybeIRjc+4jrgA556+/FdJpV2b/TLS/ZdhuraKcoDkL5ih8Z4zjNcrfaBbaNotv4V0o/6XrEqxSzkDzGRcPcSn/ZCcAds+uTXY28UcEKQRDbHGqoijoFUAAd+1AElFFFABRRRQAUVT1XVrLRrR77UJBFCg69SSeiqOpJqWyvLfULWK9tH8yCZQ8b4Iyp6HBAI/EUAT0UUUAFFFFABRRRQAUUUUAFcjqPxJ0LS72axuorpZYJCrfIgDe67pVOPwrrqr3FtDdRvDPGsiOMMrDIIPWgDlB4x13VlzoGiSuj8pcXTeVDj14wD+DU4+GfFOtAnxBq3kQsQTa2IKLtPVSxOfzzVmKOfwveRW5YyaNcP5cW/l7WRs7V3E/6snp6V0wYEUAZGleFND0YA2VqnmjrPIBJOf8AgZGR+Fa2adkVzegXs+sa9q16HJsrRotPtgCfLd49zzSehO5wMjsKAOlopMiloAKKKKACiiigAooooAKTNGaoavrNjotr9rvpNoJ2xoOZJHPRFHUmgC3cXMFpC9xcyLFFGu55HIVVHqSeBXMf2jq/id9mkBtP0okq2ouMXEw9IlOCo/2iKLXSNR8STpqHiRPs9nG2620sE45/inH8R/2T/wDrt317/aF8fDely+XIsYa/ni+9BCeBGpHAkYHjP3Rz6UAQ6Bo2lx3bXdjAvkWpeKG4fLzzSkkTS7m5IH3V9eT0xXT1DBBHbQpBCojjjUKiLwoA4AqagAooooA5fx/oUGqaPJeiIPdWCGaM8gsi/NJGcEHBUHvnPSnaF4Y8I3On2+o2mmxbLiNZQs264Kl1GVPmM446fWukdVdGRgCrAgg8gg8EGuc+HpkXwzFay4LWlxcwZGTnbIx74/vYFAG9bWVpZJ5VnDHbx8fJEixrx7KAKnpDwM1XsdRstSjklsZknSKVonZDuUOoBIz34YUAWaKKr6hew6dZT3twcRQRPI59lGcfX0oA53xl4luLAxaJow8zVb/CIBkmJGJUP0xnPT069KveGPDlp4c0/YuGuZAHurg8l2xk8nGFHOPzPOayPAlk2pm58Yaiu67vLiQWxY7ljhT5cJ3HOV+g9zm54ku7jWLseEtLYxy3CFtQuByILc9unLPnAGf0OQAHhp21rVLzxMykQMPsOnnnBgjcl3xn+KQdT6Yrp6htLWGxtorS3XZFCixoo7KoCgfkKmoAKKKQ8DNAC1z3iLxbBpEg02yia+1SYYitYgWIyCQz4HTjOBzj0HNUte8VXVxeDw/4WUXN/JlZrgHdDbZ4OSMjcOc+nTk8UtrpGleBtNudbune7vPKBmuZDukdjxsTOcZYj19zxQBytz4d1rXfENjb65ciS7uVea6to/mFpbKVKjOcDcWIAHTgknNepW1tDaQJbW6COKJQqIowqqBgAVzvgzTLny5/EWqj/iYaq/mHOcxw4Hlx4PTgflj0rp6ACiiigAooooAKKKKACiiigAooooAqajp8OpWctnPnZMpBxjIPYjjqDyKp+Hbue4sDDeYNxaStbykdSU4DH6jFXr6/tdOtnu7yRYYYxl3boP61zXh7V4JNU1afa9vZyeVdrLcDygQRtZhn+GgDT8U6pNpumMtng3t2y2tmp7zSnYh+gJzUEE2i+B9Dgs7q4CrGmefmmlkYl3YKBkksx7VzGp6tqHivxNbp4YVJ4tNDlbiQEWySnjzuh+72459K6bRvB1tZzrqerSNqWqZ3G5mJYIf9gdBjt/SgCXQ9e1LWLuVZtLmsrNYw0M852s5JxjYVBH51u5rn9Q1+50zxJp+kSwq1rqkTrFNkiRZYslgQeowRin+JfE8WhLFbQJ9q1C6bFvaru3Ef3jtBwP8AIoA3c0m7tXJjxH4qsYftmuaMqWaoXlktpEeWJRySULEnA5qla6hr3jmeSfSbltI0u3dljlChp5XGMEqeAB9aAO53CnVwmjePXi1NPDWqqbu9F2bU3cG3y3OcK2OMY74ruS4HWgB1FJkUbqAKWsanBoumXOp3H+rtozIR3J6Ko9ySAK5/w7psutfZ/FPiD95dSIJLS24+z28bYKOqncd5HO7P8qj+KMmzwlPHvCmaeBdpPLYcNgeuCoNRQyax4ujgt9OE2laCkaB7jIiu7hdoG1AAdqg988j16UAXb3xDfarqX9h+GNreWSL7UGBeGBe4TBAaT0zW1pOj22j2otrYFmPMsz4aaVupkkbA3MSeSfwwOKk03S7PSbVLKwiEMMfRR1JPVie5461coAKKKKACiiigBK5vwISun39s4w9rrF7C/cEhlY4/76rpD0rjdA1eDTdH8R6ucNHHrd/KmeNxYRbBzjqSBQA7xPq97qmqr4P0M4lljzqFxjPkwtjcB6HaeT7gDnpelk0fwD4fIiX92hJVCw86eVsDk8ZPAyccAdOMVU8D6abLSJfEOpsHvNR33ckpA3iIjeo4B4P3uPUelcZr9/f+OvEYs9KDS28ZMdsp3KgQY3zvnoCeeRnGBjNAE0+t+LfGWoxaRA4tBJ87Qwb4gicMHkY/MRgjgH8M4rqvG1nPZeB5LOGSW4EJtxLJMQ8rIHU5Yn/axWn4f0DS/CWmMWkRZAA11dykRhiPUk4VBngZ/WuT8W+NX1aznstKjA04t5NxfSqQrk4IWIEgk98cnHOAOaANePxGsdtpfh7wqkdzdy2sBJYO0FvEUUl5MYOcHpnPr2B39D0K20aOVlZ5rq6k826uZceZK+ScnAAABJwB0/WuO+Gtxb6Xpd1c6mbe0illVoLiZkjlkAyrLliCUDL8vuTW7f8AxB8PQafPdWdyl1NGCI4AHjZ2zgD5lHHPX0oA6V5oo9vmOqb2CLuIGWPRRnqfanZFeeaX4Sk8X2q+IPE17NuudzwwwsqpFGCQB8yuAOM4H485qhpnjS68N6jdaJaLJrVotyYrMNJ+9znaFVhG+4E8AAY9KAPQdU8RaNo0sMGpXSQSXH+rVgx77cnaDtGT1OBXN32val4n1iXw94bljjtEjAu9RQ72CnG7yiGx0O0HGc55A5rC+ItlHcQ2HiI/6Lc3kCpLZykrLlQDkAgH5d2G6duOtYFvJ4n8JbbiMSacL+PaHkjU7lGG/iViMZB6ZoA9KDeGvh9phhV8O4Mm1ir3c5HA6BfXA4AH51S0/TtW8ZSQal4nhFvp8L+baWKAjeSTh5twYkbeO2fQA82PDvgvTo3j1zULltYu5lWaOeX5ocMAyMqtuJPPBJ9wBXWAYoAAMUtFFABRRRQAUUUUAFFFFABRRRQAUUUUAY/ibw9F4j0/7DJK8BWRZEkQZIZeRkcA1xGp+HY7PVHk8S6hJqUdvpslwB/qFGxtqpgE8fTFen15n4yik1fxxZaPExCvFGswHdCd7Z/KgDpPAGkDTNBSYpslvWNw4/uhvurzk8DvXUVHHEkUaxRjCIoVR7AYAqSgDzjxtrUFh410qe4BeLTLSWYouNxkm3KinJGMlF5rY8H6JeSNL4m14BtTvSSinP7mLsgB6Hj8KW+8BQaj4q/4SG7nLw/umNrtGC0aqgUn+78ucetdaBigDjPidc3EOiW8CM0VtdXsUN3MvJSI8npjgkZPPb3rL1ybQ9BUy+EdREF7c26wi0tAl1HNs+65HIVx/er0K4tYLuFoLmNZYnGGRhlTVDT/AAzoelSGaws44ZD/ABgFmH0LFiPwNAHm/gqTQPDs0+o+IpXj1SJiqWzwyb48j5n4Ujcx681ra7428SXEKX+h2M1vp0UoMlxKgZpR3GPm2r9Dn3rv5LK2lkSWWGN3j+4zKGZf90kZFTbB3oA4VviZJDJb3N1pNxb6bOzL9qcnLHttBVVP/fVST/EG7v1aLwzpVxdOOPNlQiNfchN2B9SK7OSCKUbZUVxnOGAYfrmnKiqAqgKAMADgD8KAOKHga71m0nufFN0Z9QnhdIApIgt8jIIXABOevar/AIA1iTVdFNtcAGfTJPsbuv3X8sAK4+oHIxW9qlidR0+4sRI0H2iGSLzYztdd4xkH1ri9H8KeNdDt203Tryygt2dpDMqFpGJIHO+JudooA73eANx4GM88VDBfWdy8kdvNHK8LBJVjZXKN1w2CcfjXNx+AxeEP4j1K61QjB8pmMVvn/dy36EVvabo+naPE0OmW6W6SMGcIMZIGMk9T+JoAvUUUUAFFFFACV5DaC61LUG8FBMJJr1xcXbg9UjwrKOnQRsfc4r149K5bR/CEmmeKr/XnkWSK6MjQJg+YjTOHkJ4A45AwTwaALHi2y1240cab4djiCzfuJ1O1CsLDaQucKBjg8Zx0rmdP0Hxf4JmkbSbaHVUvI41dgCpjkUNgY3qdoLHnoeM4NekUUAcXB4W1vxDMl34znHkqdyabbEpEv++VPPPoxP8Atdq3dV8L6Pq2mppc8Xlww4MJhwjxkcfLwRyOoxzWvRQByFj8MfDVsENys106EkmRyit+CbePxrF8b+AREsV94as2KgMLmCIs7equqlifUEL7cV6TRQB5RofhTxpqVkNNnmm03S+cpNuUkMdzBY+GPJyQ2BWprHw+uNOj0268LRia6sZfMlMrKJJXDI6P8xC4BU5GRx616HRQBxuheENRuNQXXvF8v2q8UKYLfIaKEjnnA25HYLxnnk81Z+IOhajrmjpFp3ztbzCdoON0mFZflPqN2QO/1xXU0UAcRYePY7KCOxudDvrUW8SxiONDJs2AKFw/lnGB3rQ0vxjd6rdw28Gi3scUshU3Ei7IUUfeZmIwOO2evFdNgUAYoAWiiigAooooAKKKKACiiigAooooAKKKKAEJrhPDaDWPHesa0RujswtrC3UZHB9e1dvOsrROISBIUYITnG7HGfxrnfA3h290Czuv7QKm4u7ppn2HcvcA9AaAOmFLSUtABRRRQAUUUUAFFFFABRRRQAUmD/8AXpaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApMY6UtFACUtFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2Q=='
                    ,stamp: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAqwCrAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAACrAAAAAQAAAKsAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAPygAwAEAAAAAQAAAKAAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAKAA/AMBIgACEQEDEQL/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAwICAgICAwICAwQCwsLDA8ODQ0OFBIODhMTEhcUEhQUGhsXFBQbHh4nGxQkJycnJyQyNTU1Mjs7Ozs7Ozs7Ozv/2wBDAQ0KCgwKDA4MDA4RDg4MDREUFA8PERQQERgREBQUExQVFRQTFBUVFRUVFRUaGhoaGhoeHh4eHiMjIyMnJycsLCz/2wBDAg0KCgwKDA4MDA4RDg4MDREUFA8PERQQERgREBQUExQVFRQTFBUVFRUVFRUaGhoaGhoeHh4eHiMjIyMnJycsLCz/3QAEABD/2gAMAwEAAhEDEQA/APVKKKKACiiigAooooAKKM1R1PW9L0eMSaldRWynp5jAMfoOp/KgC9Veyv7e/WVrckiGeSB8/wB6M4auO1Hxrr0MC6nYW9vcaPMxEd8yzpsGduZEPzKB64wR3FUo38QeDbxLHShHqkmtFrvym3mRZeDMw+4oj+YYJNAHoUtxFCC0rqgHdiFH6kVjXfjfwzZuY5L5HdTgrCGmI/75BrA8UzaTJHZDxfZy3epBS6WunGYRBWIyCdyq2Pfn0FV7GWdoifD/AILWKNvuyXnlxcjjlSC34igDXPxL0N/+POC9vAc7TDA2G+m7b+tRHx3qlwM6d4cv5Vf7jygRAn3GCRSJH8TZSfLXS7FTjau1nIH4Z5pf+Ed8ezn9/wCI1iBGCsMCnvzg4U9KANFPFf8AZ1jFdeJ7Z9LlnlZEhG654AyGLRhgMjtnNY0nihH8SR+IB5w0O2tHtGmEcvzTTFHB2bQSPk+9jHvW7baT9g0m6g1+7bWIm3SubpEACKv3QAAMcVxC3Wqt4N877DjQ1vFkZXeVrhoDOkg2jtEq/KexHI4oA61/F0+pwiXwpYvqZSby7gS77MINpIIZwA3PpVQeLfFluW+2+GJyn8Jt5VkOO2cjH5VqXmgx3+mWttot5Lo8EQDx/YgqAqy8Aj05zWZL4T8Wxrix8Tzjqf30SyEnsM9hQA2P4kBZPLvdF1G3AJDN5TOq49yqj681at/iV4UncRvcvAxGSZY3VB9WAKj86pxaT8S7Rj5erWt4pGB9pQbfyWJT/wCPGmXM/jJIymq+G7HU1AwPs8i9D14dTQB1ljq+m6mu7T7mK4HX926scfTOaS/1W106W1huThr24FvFyAdxBbPJHHHauZ0jTY5IZ77w/oy+H9ViURKbyINE6sAzBdkgyOAM1i7da8SX9za+IryKzvNEBlto4oyn70jckmfOIcAKfl4JBoA9Nori/C+reMNTtDrGovCdPEZkiWKDbcTgAn5R5j4z78+1aGk+PfD+qOIGmayucgNb3a+S6sRnbk8Z9s0AdJRSBgQCDkHkEdDS5oAKKKKACiiigAooooA//9D1SiiigAoopruERnY4Cgkn0A5NADs1j674p0nw/HuvZcyn7kEQ8yZj0HA6DPGTgVUvLvV/EmiW114YuIrUXTfvJpcs6R4YHZt43ZA/CuW2aZo142n6Fp7eIPEMbFp72dfMWKTABJ3MMHB6Z+poAt/214t8Vh5bN08PaZESJLmcMszDGeN6qD/wHj3PSs+3k8LW100WlWVx4r1TIJmlw8O7qGy2Fx6HB+tbtr4KvtbKXnjW7ku3xuWxgdorWI8EEbCpyP8AJNdXZadY6dCILGBII8AbY1C5xxzjrQBzWrWniXWvD9vphgisLq6nH2kRMJIIYUO8A9CScAYFVJvCOr6Le2Oq6bfT6gttcbrm3nILsJcJK6EbRjByVPoMYruNopcDpQAwIpw2BkdD3p+KAMUUAFFFFADJYlmRo5FDIw2srDIIPUUeUnl+VgbMY24GMemPSn0UAMhiSGNYo1CIgCqqjCgDgAe1PoooAKKKKAEb6Zri4/h5FqV3qGqa7JvuL6Z3hWLIEIwERsnq+1R2wK7WjGOKAOT0rQfEGleHbjRLO5SO4huWazum5QxsRJjHJU9V5z+VY+q3N4kQXx14divIgcG/sdrAA9SQSGUfjXoe0UbRQB51pVncSRm68Aa+Zo1+f+zL4s4AxgJ83zKvHHH41q2Xj77NOth4ps5NKuclfMwZLdsd9w6Ajn0HrWhrHgnRNVl+2Ro1jfD7t3akxSA9eQpAb8awroeJNIUaf4js18SaRI4Tz0TdOgYgLuXrxnr7ZJoA7qKeKaNZYWDxuAyupBUg9CCKkrnrTSrPwdp1/e2ss7W6xNcC3mffHHsUnC55Ge/NaOgaqNa0i11QLs+0wq7J12t/Ev4HigDQooooAKKKKAP/0fVKKKq6jqNtpdnLfXbiOGFdzE/oPqTxQA3VNSstLtGur6dYIlGNzZPJ6AAck+wrjdX1Pxms8enXD2cdjqf+jwXqQSsP3o+UECYMrEdsEd81Qku/t4/4TLxfuhsrdm/szTj8hlZRvUgE8nA5JOOp6Vu67pGoeMTpTIX0+xjT7VPv+W4V2AUIuCCGClhuzgZ70AZdsvibQdQXwp4Ve2uYET7Tm4ikIhjlJ5aQSqCCytgKDjpXaxvBplukupTW8U8oUTzALbpJLjkgEk9uASeK56y8KXGgeJbfUNKZn057d7aaB3ZniB2lWXPVdwJOTkZOKzviG9sut6Y2p7DZfY70os+TA1xgbM/7XIwRz6d6AO/SRHUOjBlYAgjkHPTmnZrxnS/EmrpLotrp9y8ENnDYxfZc580PJtnZVwwlG0HJ/hAOMc1abWtauYrpbLWZpDI0bMd2TbNJei3iUYAOCkgYgnkUAeqLqNg1y9mtxEbiLmSEOvmLhVc5XOR8rg/iKkgura6RZbaVJUZQysjBwVPQjB6GvMb26kj1m60n7X5t89/cW8h+U3LW/wDZyquP4gvmDPpnk1l25vNM0q5k026e2e6sdDdzv8pY4rhpc5cDciqSBkfdB96APZs1FHdW00RnilR4huBdSGX5CVbkccEEGvPNEtNV8QXmnw32o3D2y6PI8rRTSCOf968MZbBAfuS2M8D1rpNE8Nf8Ixod9Z/apLsSrLLucBdv7oKQAOACQT+PrQBtWeraZqDulhdw3LRY3rC6yFc9M7ScVayK8P8AD93Jpmjapd2tw0chsNOTzYMAxs87qVZugGByQenSryeJtYTRoSNSmMslneR2xLszyyLOm0Bs8kDuTnHegD2LIoyK8iiv9QK+JYf7QvZpI7UMZCxjj5aLMjJhTEwBI+UAEAn0pdFutTB0r7deX6RfarxYUhDysZhJCio4cHcGV2Iz90ZI9gD1e2vLW9hFxaSpPEWZRJGwdCVJVhkZHBBBqXIryi3ttQ0rSp7u1uZ4Z0gN+8KyOItkF6ysvbaPLHzDv7iq8tzrt1caNJ9uuYnu4YbiFi05DPdXL7lTaCCFXBAYYC4HQ0AevbhVG91/RdOga6vbyKKJJTCzFs4kClynGTu2gnHpXl+p2eqWGgQanFfX0ksmrXaNBvlKt5LSrGy8kjIi6HKnPTpUur2anS9XgdZnaTXHmUssjhXkslkBdUV2J+dgB93PoMUAesh1KhgeCMg+xqtLqumw3H2SW5jScNEpjLAMDNuEYI7bipx6157Ba3z6pZ6msl40yvaxumZjGqvpzuSQeP8AWKPofc1S8MI7SJIi3Tu0mhfaHuVm8wzqbhpQC65KhgMdhxjtQB6xuFLkV41DcyXNjcW9lPeNdSWiS6lG7XJYMl0pmZVzuwquNwTnqOuRW54NsL6fVdIubh7kwW1tqLxs5mAJSXykDiTJAKyEqDzx7UAd5NrOlwSXEUtwoezSOS4UZZo1kJCEgA9SKmt7m3v7WO6tZN8FxGrxyLkblcZUjoehrgdXWfSPEesaxHBOVN5ozyGNZG3xZKybdo+bAXkf41N4Qsp7zW7S9lNzFb2ulB7eM74odzXF0mxlIxkIRx1HHpQAniHTLjT9Vtk1fV7i40W/llEsE0ixmMIrSkN8oDx4XBHXpVbTNOTV9dktPDerS2+kQJHdskUrEt55Y7Y1G3YAVwc5+ldbqfhez1jWrTVL9mkSxQiK248suWDb2znOCBihfDVlZ67/AG7p+LeWaN47yMcRTKRlWwOjAgc+maAC18RaeuryeHpRNBcQhRC1x0nGMkoxYlvxrbBrz/UZx4iu30DW4hpeuW0rNpd2m4RyhTvUKxGeccjv1HIwNjwl4nu7+afRdbi+z6nZ/eB4EqdN4Hr646jB70AdTRQKKAP/0vVCcVwGrO/jDX3si5TQdHJe9kztjkkXkqc9cYx+ffFdH4y1g6JoFxdxZM7gQQBcbjJJ8q4z9a5GewmtNM0vwFYki71MfadTkBy6xn5pCSRnk8etAFzRbOTxrrB12/jKaTYuI9OtmG0NswQ+PQEZPvx2rvVAAxjFQWNnBYWsVnbKI4YI1jjVRgBVGBVigAwKjntba5TyrmJJUzna6h1/Ig1JRQBXXTrBNpjt4kMaMiFUVSqtywUgZAJPasxLbRPBujPI48u1hwZJGXzJWLN8oOBljlsKK265/wAeraP4YuVvTIsRktxuiAd1bzo9jYJAKhsFh6UAT6Dr+i+IxLcaaCzQuFk82IxSAsOD8wBIIyKnv9S0nTJ7a1vNiSXz+TCNmdxUZ544Uep4rzCDUri08PeIrCB4554IrIjULYsDLBuMSoXG0kKOAevJzk8m1d6Zpl49jpmn3s13af23LbHf8/liSATuEYltw460AeharrelaFFHcXh2I6SmNo03DbEjTOARx91SQO/bmn6rrmnaRpTavfMwtQsZOFLsRJgD5RyevNeS3dzBL4T0W2cSSS7r+SLc58hYklKcLzl+QF7Bc1V1G8TU9OYXss/2q20ywgsgxZ4nAMiTykH1Q5U55PGTQB7fGLRkCqI8OgYLheV6g4pQtozCMCMsgOFwpI6du1eSs0//AAsHzDcBJItSggTczGTyzEihQoBOz5j7AkZ61N4TtJbLxPo1xGzO97catDcbyMhLYmMHPViTjPJ6cUAerN9mRstsVpDjnALH096C9vv2bk35ztyN2fXHWvM/idNp41KZSP8ATYdMWRJJ5XCKSzeX5CKMeb8rEsSMAcZqEwRzeL5dSfIngv8Aw/sbPP8ApIEcgOeTwv6n1oA7rxH4m03w3HEbqJ55bncI4YVUuwTBJ+YquAW7nvU2j6/pWs6YmqwkQQhmQifbG0br95Tzjj1BIrnPGt2um+KNHvpZVtEFlqEMd1IvmRRSso2MwJGQD1FcXcsL3wzppna3hhOqahvyAkQkKiVGOAQSUBA75wKAPXDrFiNUh0nGXms3vEkG3yfLR1TrnrlxikvdatbG8SzaOR5JfIClACCJpRDkcjIUnLeg5ryaWTSlsLGHV2fyl0HUPsz5dFLyTB4McglcAgDGOntUnim9VL60F0RDeR2GnSPLM+Jt+3P7vOPLAH3+fm/CgD2XfHnBYZJx1HXris6bxBp8esW2iAmS4uo5pFZNrRp5WMhvmyCc8cdq87bVpIPFX2Td5jp4llnSMkbiZLbyV5P+12rP8MQwm5ZLYsNWi0zWnuVUFCZVxHCfYkE575680AenaVovhzSbm51DThGksxYzyeZ5mN7F2HLEKCxya1ILm1uS/wBnlSXy22PsYPtbAODgnBwRXiGlxomha3JYzKy/2TE88cKAorNKhVJCeCwCn1HJ9K7z4f2sOm634h0u1UR29vJYmOPuBJEWye5z70AdxgdaMCiigAowKKKAMDxZ4bXXLVZbY+TqNmfNs51yCHHzBTgjKkjkVy1/cSa5py+KdPja11/QnCXtuQULBOXU8crgkgj1Ir0g1xGuwHw14stNfQZsdWIsr9P4d7DEb498YoA6jRNVt9Z0231G2OUnQNjrtb+JT7g1frifC+fDvijUfCxXbaXH+nWHpsYAOg+h7V21AH//0+g8T41jxfomg8NFbFtRuEPPCZCZ74zVzRtHvm8V6r4g1GMBHCW9g25XBhA3MwwTjJPeqOo+NtKkmnsbexuV1eRGtoleFRIHf5QrMpbA5z6VDovic+E9LttB160uVurXMERiQOkyKfkMZypbggcD6UAd5RUVrObmBJjG8JdQ3lyAB1z2OCRn8aloAKKKKACorq0tr63e1vI1mhlUq8bjcrA9QRUtFAGfZ+HtDsLWaxtLKGK3uM+fEFBWTIwd2c7uPWn22iaPZJFHaWVvCkEhkiEcaKEcqULjA4YqcE9cVz3izxreeH9Uh02zsUvGlgEnLyK5LFgFVUjkJ+7Vnw94l1i/lm/tzS/7IgijDLPK7hGZm2hf3iR8/wD1qANVvD2gyIkcmnWrpEZDGrRRsFMjb325U4y3JxSyaBoUwhWXT7VxbIEgDQxt5agghVyvygEZAFTDVNNKSSC7gKQhTK3mJtQN93cc8Zxxmo7LWdJ1IObC8gufKGZPKkVyoyRkgHIGVPNAD20nS2u1v2tIDdIcrOY080HG3IbGRwcfSpFsrNGR0hjDRlyhCqCpc5cjjjJOT61RfxT4bjaNG1O03SnCATRtn8mPrVGfxS0Xi638NpCjxT26ymfeQwLCRgAu0gjCdc0AbF3pWmX53X1pBcnYUzNGkh2nkr8wPHtUi2dmrl1hjDMUYsFXJKDah6dQOBSWt/ZXvmCzninMTbJBE6ybG9DtJweK5PxJ4x8RaFdXG3Rlk0+ORIor2SYors4XA2qjN944oA625srO9QR3kEdwisGVZVWQBh0IBB5pqadYRwtbx28SQuxdo1RQhY9SRjGazNG1u+lsvtHiO2i0iVnKxxtMrhlAzuycY+lT63rkOk6U2rDZLCrwjO8BCsjqm4EZzwePWgC69jZSOkkkEbvEMRsyKSo9BkcU9ra3Z/MaJGbGNxUFsdcZIpq3MJdY96+Y6b1TcN5HXOOuKqP4g0VLz7A19bi5zgxGRQw5xjr1z2oAt/YrPzvtPkR+djHmbF3/AJ4zSpbW8TM8cSIzkszKoBJPUk4pt1e2tjCbi8mSCIdXkYIv5mqOoa7bw6Nd6vYSRXS20DyDa+YyVGdpK7iPyoA0UtrZFKJEiqxJYBQASTk5GOeaesaKSyqATjJA5OOlYmj+J7O90uwvdQkis59QGI4WfBZskYXOC3T0rcFABRRRQAUUUUAFZ+uaRba5p0mn3RKI5VhIm3ejIQysNwYZBHpV9s4OOuOK4TXPFfiiK7fQJdNgs3vCYLa8edzE2/5QwPkkZOfuk5zQBb8SafP/AGx4d1nTt8/k3QtpXjBkHkupO5ioIC5HJPFdjmvOrTVPE/hWSPwjYWcGqywRboWSSRXSNj8vmARkLyTjLciu7sPtrWkTagI1uSgMqwkmMN3AyCaAP//U2/Hf2mfWNIstHtlm1ESNcFwmdqL8o3sMbV3HPJwcYqDSBrFn43QeJ4oWnvbXyre5jUtE7RbnGwn7rFSdwx246Vu+J9aPhy4sbwW8TRXlylrdTtkSInJXkDoCe9Srrkb+KG0C4gUYtkurW4LBt5OQwAI4I9QaAN4ADpRVW/1TT9Kh+0ajcR20RYIHlYIuWOAOfrToL+zuXeOCZJHiVGcKwO1XBKMfYgcGgCxRSb1ABJAB6HsaN6E4BBI6gcmgBaKoz65pNrfxaXPdRpdzgmKEn52AzyP++TTdO8QaLq7MmmXkV0yrvZYm3EKGKbsemR1oA4Lx1YzXnjmxtreb7PNeW9vFFL8w8tkadg3ykHv2I+tT+I9D1XRPCF+mp6i+p/aLmw27g+2Ii4RmI3u5wxOK6q807w9eeJbS5uju1W2hMsEfmMMIhwXKg7Tgv3rQ1TT7DVrRrDUUEkEjIxQsyZKMHXlSp4ZRQB5jNpukaX8Pra6ZJftGtTQyfIyqiyoskiZBBG0KpzgZJ7g81X8FwbfFX2ffGqyaderuhl+0xYZIyMP/ABevt+Fegaxo/haTS7HRNQ2w2izLDZBZGjKyIj4UOGznaGzk81n3Gi+CPBvkapdJKrMTDCxae5ZmZX3YVS2SUJycdKAOHsNBs5/AN34iJb7TaPHhcnyjGBGGTb05DdTnFP8AEVtfRalp0EPmSTRaFY7ZY93muAs29sjnhWIJHavRNCsvCF7oBsNJjjk0y5Yh4HZySwIBVhIxcEFRwa0TpOjG7t9RaGL7RZReRDLnGxPuheuO5Az6n1oAwvhjJYP4bVLRESaKZ1udvLM2dyOT6FCCOwHAp3xOQnws2wZYXlpgdOTKo/rVi11XwdoGsvoNiI7a9u5VaVYY2KGRuQHcAqD83QnuPWtm6j03UYWt7sRTxpIpdJCrKHQhlyM9Q2PxoA4HxTaajeeKEVoLS6t0sYPs8WpP5drlsiQr6tkDIqvrMF1B4HvSj2klouo2zRxWDvcQQqjKJIwWVeNw6V219aeGPEsU8F4sN8unsUlUElomA3kZUgjj061jDxT4MudHfTdPjSa3VYo4ba4gmjtnaR1WMEtGcgsRzg460AVfBQudP1C7sNaQrqk1nG9tLIzSNJCgJCgnj5WbkCsa5svDtv4LlvbySJtauPNkG5sTCUOQyhSQdo75HSu0sfEGk3TltSSKK8sp72H5QZlj+zYLYk2gAmNlbH+FOOmeENSji8SSWdvILkRTJcPHtZ95URswIGTnGMigDj7W4Z7/AMO2virnT20gkfas+U0pxh5AxxuAHfkfjUVqUmu/Flr4eAbTW012i8vJhZ9oCFeenBH0Arr9Z1nwtc/atL1eAz/YAjzJLbStFHuyEfdsICkj7wpNHudD01ptHFnDZmS8W3MVurSxu0sXmKZGKDkrnk+woA4fwnLJpmtaPqOtJ/od5E0VjLIQVBOAm0c457e9ewLyKwLnVfDtjoP9oiANp9nKYUjSEfI0bmHCKQAAGHUcY5pLDxx4fv40kWV4fMuPswE6NHiTYZMEn5cbR1zigDoaKqtqdks32YzRmfyzKIQymUoBncFzkikXUrR443LhDNH5iROQkpGN2Np5zjtQBboqjZ6xYX0NvNDKo+2QiaGNyElZDznaTu/SnLrGlskjrdwFYCBKwkTCZ4G7nj8aALhrmfFWj6nrt3YWNpI1rbwSNcT3Q7EfIqqMjL4JI7Ctiz1rT7/yhay7/PieWI9NyxsEcj1wSPzrI8b6rc2Wmw2VhIYr3UrqK1hZD86hyN7jr0WgCjonh7V/D/inzVke+026tPJ8+Vi88ZjO6NXyeeS3I657Y57LaK5OTWNRl8a2Xh+znzbWlo0t/gBg7bQArEgkHkHgiutHSgD/1e78W6GniDQrnTuBIy74WIzh15X8+lcTc3Nxq2gWHiS0OdX8Nt5d3HjllQ7XOM9MDP5969OINef+IrS58H66PEenxedpt+fK1G2Ayo3ZJPQ4ySSO2eO+QAb91p+j+PNHtp5GYRkiaOWEqJkbG11yytj0PFcp4ltBp93qWn2e9bW20LSY5DGcMIoro7idu0Z2bvbrnipdN1JfBuqq0UnneGdWbzoJx80cDN1yRwAM4I9O3BNdxNpOkalHO1xbxXKXyRCYsA6yLH80X4AnI9+aAPH76C9n0uyk077ZdW7XGpxwr+9kwyTIsIwuQjFe/GO2K0xBcJfa2tn9rku47DV0uJlEhRnDQ+QARn5xg8da9UsNPstLtls9PhS3gQkrHGMKCxyT+JNPtbO2shILaNYhNM80m3jdI5y7n3JoA8w/sw6F4igtI7e7uI5/sEySskkpLkS+dl8YHLYxmtLwFoo0u/s5ZLedJJtJlHmOJRGXSYIcg8LlFXAI9x3r0M9K5H/hMr+DxO+hahZRW1uizTmczb3FuisROVCkAHb0J4zQBxEdnq39oa5LFbXa3Js9VwyLJne1xE0QRguTwOPXHHFa1lp9z4hube5uYbp1i/tyWJ5RJGwkdoHt1Y8bevyjPbjpXXnx54XFmL/7ZmE3H2fISQtvKGUDbtzgquQelUIfiHY3aLPbREQf2hLau8hOWRIGuEkQKDncAODjHegDlbTw62oaLp9qLG+iP24fbBdLIqNKbN2llCFQVUyYXdjDH61oazomp3vgrwzZR28xnge2SZNjFohJE0WXXggAsM8ce1alp8RobjT5b+WBIxDBaSSRrIzOrXEzQlOUAIAAIIPPStlvGfhrfaoL1T9uLCBgr7Dh/K5bbhfn45oA851jwVqGi63ZR2UM98pe0dbtId22QS5cZQHYqgLjcfxNPvfC2qf2NcTxWd1JPPrF2stuNxjMKb/KYxEgN87EhueeemK9G8P+Io9fk1FIojGun3z2oJOd4QAFz6fMGGPYHvWNpHxBj1CWOCeBIZG1KS1f5yVESRSyiYZXPWPbj1/UAwtN0/xFaaq9reaSLie/vLe8+0ygzwW6RxMm4SEgrKCQPUc4z1rM0zwdrMr6hb3mnz4ke0V2YAeYPtSmZi2cOfLBbJz69a9Em8beHoLT7a07+V5FtcfLHIzeXcsyRHAXPJU8dRVWL4jeFpt+yac+XG0hzbzrwuM4yoyeegoAj8J6EdD1nWYUsmt7R5YPscwIMTQqv3B8xbIcknI71zbaBrcdprcsdjIzjX4ruFMBTLHHcPLlOckbWH9MniunsviJ4evbkWyGeJjFJITLEUAKclO+WxyMcfjRH8R/DL2Ul+8k0ccMiI6mGRnHmK7I2FB+UiM89sYNAHH3Wh+J28PXF5bWU8N3PrV9ciFCvmrBcwFTxkEjzePUjtius13T5LLwtpdpbIypZXeleZGNzkRxyxbs9TgdST2Fb9pqttfi4+yB3a2YKwZHjyxQSAKWAyMEciua07xN4i1K5v8AS3gs4ry3s4bkBmcwxM7fPBKRuyyr1I70AGueH9T1O88RC3j+TUNJtYLZ2IVHkRpWZc5J4yOvrVW60PW76x1u7it57a5uJrGazhkaLzd9qqZ27WZRkqQMn8qV/iFe2Xhkaze20L3E91LFZxxsyxSxQjLzfxMF4IB78etXYfGTy+JX0lpLWC3U26Is3mLPJJNGspVSMqfvcZxQA648NXl14Fg0NwfteyBpclQfM3iSQk9OuTVL/hAIkilsvLS4tVvpLmMTYLMGtPJUH1Il5Ge30pZ/Get6dPqsN9HayPZae12Iod4Nu29VSKVtzbiVYN8oH61JJ43u9M0m/fVBBJqNpe/Y7YQh44p2aJJ1baxZlAV/m57e+KAKX/CF6gfEEGovEzKIYyzrJGkaMts0LKwILsd54xgY+nM9h4NvIp9Pu7mFGns7fT4i25fl8qKaOVRjHAZh9a67R78anpVnqHANzbxSkAEAFlBIGeetXaAPN4vDHieLUdEAgUW9ja2MdxKpjJDxeZvyT8xAzxj1qXUfBWpy6RLb2kEKyyW9lujBVBJLDPJNLuIBByrDk969DPFJuFAHFaBpF3ptzoNveJ5U1hp+oNc870USvHhd3TnH6VQju4tZ1y+8aXbZ0rQ1aOxBPyySKDl19ck/ifpWh4j1SfxFqB8IaGzBXIGpXqYKwxclkB7Mf85GcZ5hTxNqcPhTSFMeg6OyG5k+95zRn7uTweR9ep9MgGr4A0u48q68SakuL3V5TJ0xti/gH49fpXYU2NVRAiABVAAA6ADgU6gD/9b1Sobq0t723ktbpBLDMhSRG5DKeCKmooA8w1GB/CEkmg6ojXXhvUXYxyY/fROxLHawP3l64xk9Rzmuq8H6ZqWkQSWj3Ud7pYCNp0ij95sbJOQFCgdMY/TpW9eWVrfQNbXcKTwuMNHIodD9Qa4rx5oP2Gzk16wvri0EGzfarcXEcMvRFRAsiiNj0GBj2oA3fDXiM67darDgbbG+aGEgEFowANx5PO9W/Ct/NeSzx6BqN9plh4avH06e5k+zXjQy3GSwRpFc7Wj8zJBG8nk16DpA0vSCuhJetPeIgkdbiZprlg3G752JxkcAdKANk9K88Xwp4nudT1mS/ggZNYhuLcXhm3SxRHd5YRNuADhARnt616FkUtAHm2k/D/V1gt49USEBNbhu5USTf+4jiZGAOwZyxB2+lXv+EM1mLWDcQPEbZtXurzg8hLiCSMbgQOhfaAM4H5V2t3L9nt5bhULmON3Cjq20E4H5V5ynjfWtW029hvIUthLbWDQvAXikC3k6w71bdngHIPFAE7eA9al0lbIGCOT+z9KtzliRvtriSWU8LyNr8epqjc/DzxcWtI1eyljsiBCyu8W0CTzssDEdzFuTz7e9SatrusRhptOuZIEgttd3B5WdiLe6RN67uN4H3R27cVfXxJq1lNdQxhJdRnk0+BBPLIbYyNB5kjAbcKMAHjgmgDV03wX5U929/K2x9XOpWxt5HjYsyxhhIAqgjch45GKxU+HmpLfWt8phVxe38lx8x+5K7tCw+XkgOQR/hVnWdf1DUfh3HraMLee4mtstAzJhTOq8EHIyAMgn61nx+KNbvZbG9uV8u8sW1KOSJC8NvK0cYYbkEhU7cEHJPPSgCbT/AAN4ja2a11J7ZBHFpkEDoxf93ZTtKSRtHJRjj3qebwBqBtwkE1vvSfUnyxblbmVJIuQnGFT5hjr0rU8L6/c+JfDV3d6jLFbOhmiae3zHsXYGEhVixQgNxzyMHvXFWQWG7n0eW5uhp14LKRZTM83moDMwutwJCCQJnb9AeaAOqt/Ac6zztLLEY5L67nUjc0gjmtlhTsAGDgnHIx71T0n4eXtrbeTfPbM41DT5z5TSHfFbFi2cqCCS5IHT3rf8A3s994U0+S6ZnmERRmcl3bYxTcSeT061xelyXDalJdwzzSXt8+uwzDzGYkRAmABc4Uj+H9KAPSIV1VmvhPJDsZyLFog25VKAfvM9WD56dvyrlfD3g/XtK03UrO5nsxNqFs6C4jEkkxlYH5nYqmVyzHAGcnPeqXwuu4GvL6K2eYW5sbGUrPIzjznMglcbmONzdO/SrXxIjMlxaQ21xK1/cRtBZWcUhgVHd1Ju3YMpwuMAYPX60AWdU+HdpqGkWVkJ2judO017SDG3yWdtp3uCpJG4dKW78HalNexqt+raastnM8cymS5VrVdoCNkKASM8jNYVrJOvif7fc3Eguk15tOeXcSnk/YiSAvA2l1DdPeq9uvn6bqJspJTpTHTNOluJpXLXcpulSeYgs20Mj4+h/IA3Z/A2sak9yNQ1NJY2sZ7O2dY2MxWVg6tKS5DYxj+WKnTwA1/ZzLr915t5Ldm6jktR5UaN5MduBht24Yjq34Cjjt7XVbCBi1rZa1dQWwJ3BYwsbgA9+WNdRgUAZ+g6Uui6Ra6Yshl+zxKjOc4LdWwCTtXJOF7Dir5IA5ozWbrXiLSNBgM+pziMdkUF5W+ijJNACXviPRbSCaSS/tw0KOSplTOQCcdevFYXhjxdY6toCjXLyK2vHMkMyPIsMvzE7SMEEHaRg1meO7bRrWTTddtLbF/dXkL7FTaZ4xhmDqRy3QDjOarxNZ+IPGtra+IdNNpItlIGtZNhgaUEOhyOXUoT17jFAGrqeiXsWm2ugeD40WyvSwvdREgZwucsWYEMxPPI+nGcjqNF0az0SwjsLNdqIPmY43O3dmxjk1djjREVEUKqjCgDAAHYU6gAHFFFFAH/1/VKKKKACsTxLoB8RJa2c0vl2cc4muEX/WSbfuID0Az1PX05rbowKAMLU/CGk3kVn5EYs5dOeNrWWFQCioQfLI7occj+tcn4ivPDeo6pNb+IrS40a9jkKW2pIu4sq/dkYqCMckg8gA9Qc16TVPUtJ0/V4Ps2o26XEecgOMlSOhB6g+4NAHE2ep+MPDqJIGTxJo+3cs9swkuAnp97d9OG9zXQ6L450DWSIY5/s9yeDb3GI3DDGVBJ2sRnnBrHl8A6hpFw194Rv2tnBLC3uCXibI5Usdx5PcgnFZOrT25fy/H+ieQ+z5tTsNyhgo5JK9s9BnPtQB6XIPOiZBj50YA9RyCK4Pw78NpbaK+tdblVoLiK3hj+zMwfEEnmrISw+XkDA5q/oL6J4ZDCfxF5lvcRJJDb30scbxhssGG4qQCCBjAHFRaJ44sZtb1ZdQvIYbAujWE8rqkLon7t9rE4b5hnj1oA1LfwJocFkLGQSzxiC8gzI+WK3brJLyAOcqMGqGveAYrvTjb6S+y5kktTJLcs7B1t0MYJIBIYgjJxzjB4xjdPibw+LNr8ajbvapIsbTJIrxh26LlSRn2qWw13R9TTzLG7imU5GAwDccdDg/pQBlaZ4OgTwsnhvVX85fMMsjQFohuMhm4PXAP51JB4G0CC3itVido4BchQ8jsT9px5hbJ5PyjB7VvgjtS5FAGTo/hjSdDs57GyjYxXJJm81mlZ/l2YJY9MVRi+H3huG0nso4pNlwYiztLI8iiJt6KrMSQoOeK6TNRPcRRyxwO4Ekxby17ttG5sfhQBR0/w7pelzxT2MbRNBZpZRje5URIxYDBJBOTyepqvbeDdAtNRl1SC323E6yK/zuY/3v8ArCFLbQTnt/U1t5oyOlAGHZeDPD2n2721rbFUeaCdi0kryF7dhJF8zOzbQwyFzjrxzTtZ8H6D4guRd6pA0soiEO5JZocoCxCkI6g/ePX1razVW51TTbNWe7uoYFT7xkkRcfXJoApnwroZ1FtVNsPtTLgvufbkp5W7bu27thxuxnFVbPwL4Z0+OeG2tW8u6hWCZJJZpVKKdygB3bGD0x0q/Z+IdF1COaazvYJorcgSyK42LnkZPTFYPivxja22noNAvIbm+kuYlEcDCZ9iMHlGF3H7ikUAdFpmladolt9k02BbeEu0hVe7HGWJJJJ4qlrHi/w/oQxf3aeZ0EMf72Unp91c45PU4FYuu6h4d8Tw21qniWOxRjmWG3miDSlsbUOTnIPb8xWc9na+GNQ/svwv4de+vdqMb65BaPDAkFW2kDGOmVFAF241jxZ4oj/4kVs2jae33r28KpMy/wB5V+YgY9vxrEt5vD+i34TTY5vE+u8qbglnhRycDH3sgE9ecc5IrbXwh4m8QMH8W6jsgyD9hsziIjnIbgDnPQ7vrXU6Voel6LD5GmW6QKfvFR87e7MeSaAI7bT1vBZ6hq9tEuoQRH5VPmpE7437CcenXFWLvSrG+mguLmJWmtZBJBL0kQ9OCOcEdRVvAooAAMDFFFFABRRRQB//0PVKKKKACiiigAooooAKa8aOpRgGUjBBGRj8adRQBy3jrStEl0Oe/wBQi2yWkBEEsXySgnhUBH8JOODxXG3eqS6lp+iabrWnyWVo9xEpvIwkfnx7drYIQGM7yGwOoGRXp+o6XaarCtvfJ5sKypIYz9xih3KGHcZ5waS/0uw1OzewvrdJreRcNGw49iPQjsRQBz+vKdJtYNMsfDy6npZjYuEwQrZ4+XaxJIJ5rjnn+H8kjHVtD1DSdn/LVmlUL/ugPn8hXrUESwwpEMkRoFBY5bAGOT3pzRo4w6hh7gH+dAHlEVv4MlXzNO8VX1grZKrM8kS/qEb6c1oWFtqc4UaT44ieEZUK4DucDHWWRjn3ruLjw9oV2rLcafbSBjlsxpkn1zjNZ0nw+8Hyfe0uHpjjcP8A2agAg1HUtJ0NZC3/AAkd1AW897V41kIJzkL04Hbr7VzM/iXUdauk8U2Nm0FvoKP51vcSxo0nmkLJkh/l2pz8w56Cus0nwroPhqSe80yBoWkjxIS7yDamWAAYkD8K4mDwp4j16z1bVBK9kNSleSKzb5BMjHb845x+7AC+/JoA7Dw74ouNatTeXdgdOtVHFxNIojYnptBCkj3OK5zUorozO2oeN4ordpGKJHtjZQSSqgxyKTgcc5rotLs08R+GILLxBbEuu2O5hbMZ8yBsZ4PqueDj606LwD4SiBA02NgRjDF2GPoTQBw8p8Jxr5mp+KtSvUYltkLTmPt6biPzpkEnw7ixLp2h3+ry5ysskckiOW7sScHr6V6Ta+GtAtDm3062jI/iESbvzIJrRWNEG1FCj0UAD9KAOO0K71OZ47K28LppemSfLM0zRx/Jg5/dgZPsDWG0X9geNJ7TwpYNeGO1UyW25REhflsMwJUAcKPfHTp6aw7iqljpVnp8lxNbR4lu5jNPIeXdjgcnrgAcCgDjfh/p+kajc3uqywMNQhvJP3cpGIQ3K7UUKoI6ZxXfbfeqUGj2NvqcurQR+Xc3EKxTMpIVwpLKSo4LDJ561eoAKKKKACiiigAooooAKKKKAP/Z'
                    ,tuv: 'data:image/jpeg;base64,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'
                },
                pageSize: 'A4',
                pageMargins: [20, 20, 20, 35],
                styles: {
                    topHeader: {
                        fontSize: 15,
                        bold: true,
                        margin: [0, 6, 0, 30],
                        alignment: 'center',
                        background: '#ccc'
                    },
                    table: {
                        color: 'black',
                        margin: [22, 0, 32, 25]
                    },
                    header: {       
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 15],
                        alignment: 'left'
                    },
                    footer: {
                        margin: [32, 0, 32, 0]
                    },
                    date: {
                        fontSize: 10,
                        aligment: 'right',
                        bold: false
                    },
                    field: {
                        fontSize: 10,
                        bold: true,
                        aligment: 'left'
                    },
                    tableExample: {
                        margin: [0, 10, 0, 0]
                    },
                    mainHeader: {
                        fontSize: 14,
                        bold: true,
                        aligment: 'left',
                        margin: [32, 15, 0, 0]
                    },
                    subHeader: {
                        fontSize: 12,
                        bold: true, 
                        aligment: 'left',
                        margin: [32, 15, 0, 0]
                    },
                    paragraph: {
                        fontSize: 8,
                        bold: false,
                        alignment: 'justify',
                        margin: [32, 10, 32, 0]
                    },
                    unterlagenTable: {
                        margin: [32, 10, 32, 0]
                    },
                    tableHeader: {
                        fontSize: 10,
                        bold: true, 
                        alignment: 'left'
                    },
                    tableContent: {
                        fontSize: 8,
                        bold: false,
                        alignment: 'left'
                    },
                    wd70: {
                        width: '70%'
                    },
                    wd30: {
                        width: '30%'
                    }
                }
            };
            console.log('====================================');
            console.log('pdfMake => ', pdfMake);
            console.log('====================================');
            pdfMake.createPdf(docDefinition).open();
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