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
            var currentPage = 1;
            var pageCount = 10;
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
                                text: 'Umbau + Aufstockung eines Mehrfamilienhauses; Brehmstrasse 65; D 40239 Düsseldorf',
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
                                text: 'Firma ImmoSubstanz GmbH & Co. KG; Rathausufer 23; D 40231 Düsseldorf',
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
                        text: 'Frau Sprenger (ImmoSubstanz GmbH & Co. KG); Herr Ringwald (Architekt); Herr Ehl (Bauleiter); Herr Tekook (Sachverständiger)',
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
                                text: 'Der Prüfbericht darf nur ungekürzt vervielfältigt werden. Jede Veröffentlichung bedarf der vorherigen, schriftlichen Genehmigung des Sachverständigen.',
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
                        text: '2. Prüffelder und Feststellungen zum Ortstermin ',
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Zum Ortstermin wurden folgende Prüffelder baubegleitend geprüft:',
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
                        text: '3. Überprüfung der Abarbeitung bisher festgestellter Mängel',
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Aufgrund der noch nicht abgestellten Mängel und der noch nicht vollständig abgeschlossenen Leistungen werden folgende Kosten \n\n\tBeseitigungskosten: \nWertminderung: \nEinbehalt: \als angermessen beurteilt.',
                        style: 'paragraph'
                    },
                    {
                        text: '4. Voraussetzungen für die Erteilung der Abnahme',
                        style: 'mainHeader',
                        tocItem: true,
                        tocStyle: { bold: false },
                        tocMargin: [52, 10, 0, 0]
                    },
                    {
                        text: 'Der Status der durch die Sachverständigen festgestellten Mängel zeigt an: \n\n\tAbnahme kann nicht erteilt werden \n\nBesichtigt wurde in erster Linie die Musterwohnung im 3. OG links, da diese im Bautenstand am weitesten fertig gestellt ist. Außerdem wurde das Gemeinschaftseigentum besichtigt.',
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
                    //#endregion
                ],
                images: {
                    logo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEApACkAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAEEAT8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0miiigAooooAKKKKACiiigAooooAKKKSgAorN1LW7LTgRLJuk7Rpyf/rVhHU9a1klbCE20B/j/wDsv8K1jSlJX2RlKrFO27Onur22s13XE6Rj/aPJrEuvF9nGSttFJcN2ONoP9f0qO18JRs3m6hcSTyHqAcD8+tbtrp1nZjFvbxp7gc/nVfu4+ZP7yXkc5/a+v3v/AB6WAiU9Cy/1PFL/AGb4kueZr4RA9g+D/wCOiusope1t8KQexv8AE2coPCt5LzPqjk/Qn+Zo/wCEMQ/evnJ/3P8A69dXRT+sVOjD6vT7HKf8Iao+5fOD/uf/AF6T/hF7+LmDVXB/4Ev8jXWUUvrFR7sPq8OiOT+w+JrXmK7WYDsWB/8AQhSf25rVl/x+6fvUdWVSP1GRXW0YzR7VP4ooPZNfDJnP2ni2wmIWYSW7f7QyPzFbUFzBcpvglSRfVTmoLvSbG8z59tGxP8QGD+YrDuPCjwP5ul3bxOOisf6ii1OW2gXqR31OporkU1vVdJcR6rbGSPp5g6/mODXQ6fqtnqKZt5QW7oeGH4VMqUo69Co1Yy06l6ikpazNQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBKKKy9Z1m30qL5/nnYfLGDyfc+gpxi5OyJlJRV2Xbu6gs4TLcSLGg7muXn1jUdama30mJooejSng/n2/nSWmlXuvTi81V2jg6pGOMj2HYe/Wurt7eG1hWKCNY416ACtvdp+bMfeqeSMTTPDFtbES3Z+0z9Tu+6D9O/41vqoUAAAAdhS0VlKcpO7ZrGEY7C0UUVJYlFFVZ9Qs7bia5iQ+hcZ/Kmk3sJtLctUVjyeJtKjJH2ncf9lGP9KgPi3TR084/RKv2U30I9rDub9FYK+LdMPUzD6pU8XiTSpDj7UFP+0pH9KHSmugKrB9TXoqvBe2tx/qLiKT/dcGrFZtNblpp7C0UUUDGSRpKhSRVdTwQRkGud1HwvGz+fpshtphyFz8ufb0rpKKuM5R2IlCMtzlLPxBdafMLTWYmGOBKBz9ff6iunhmjniWSF1dG5DKcg1Fe2VvfwmK5jDr29R7g9q5aa21DwzMZ7VjcWJPzKe319PrWlo1NtGZXlT31R2VFUdM1O31O38yBuR95D1U1erFpp2ZummroWiiikMKKKKACiiigAooooAKKKKACiiigAooooASiisrXtYTS7X5cNcPwi/1PtTjFydkTKSirsi17XE02PyosSXTj5V/u+5qnougvJL/AGhquZbhzuVG7e5/w7Uvh/RnMn9pajl7mQ7lVv4fc+/8q6WtpSUFyx+8xjFzfNIKWkpawOgSio554raJpZnVEXqzGuXu/EF3qUxtdGhb0MpHP19vxq4U3LYznUUdzob7UrSwTdczKh7L1J/Cufl8T3V5IYtJsmc/32Gf0HSprDwqm/z9Tla4mPJXJx+J6muhhgigjCQxrGg6BRgVpenDzZFqk/JHLDRtc1Hm+vfJQ/wA5/QcVag8H2KYM0k0x+uB+ldHRUutPpoNUY9dTLi8PaXGOLRD/vEt/OpxpOnjpZW//fsVdoqHOT3ZahFdCk2kac3Wxt/+/YqvL4d0uXraKv8AusR/KtWloU5LZg4RfQ5mfwfaNzbzyxN2zhhVY6d4g03m1uvtMY/hJz+h/pXXUVoq0uupDox6aHLW/ip4ZBDqlo8L92UH+RrobS9tr2PzLaZZF9jyPqKdc2sF3GY7iJJF9GGa5y88MSW0n2jSJ2ikHOwt/I/40/3c/J/gL95DzR1NFcvYeJZIJvsusRGGQceZjA/Ef1FdMjrIgdGDKwyCDwaznBw3NIVFPYfTWUMpVgCDwQe9OoqCzkdV0efSrj+0dIJVV5eIdh/Ue1bejavDqtvuX5Zl+/H3H/1q0jXJ61pcul3X9qaZ8oU5kjHQf/WreMlUXLLc55J03zR2OsoqjpOpRanaLNHww4dO6mr1YtNOzN001dC0UUUhhRRRQAUUUUAFFFFABRRRQAUUUlAFbUL2Kws3uJjhVHA9T2Fc1odjLq982q34ymf3SHof/rCmXzv4j1xbOJj9jgOWYd/U/wBBXXRRJDEscahUUYAHYV0P93G3VnOv3kr9EPpaKK5zoEqjqmp2+mW5lnb5j91B1Y0mr6pDpdqZZOXPCIDyxrA0rSp9Zuf7S1XJQ8xxnoR/h/OtYQVuaWxjObvyx3I4LO/8Szi4vGaGyB+RB3+n+NdVZ2cFjCIreMRoPTv9anVQqgKAAOABS0p1HLTZFQpqOr1YtFFFZmgUUUUAFFFFABRRRQAUUUUAFJS0UAUtR0221GHy7iMH0YfeX6GuYzqHhefnNxYMfy/wP867OmSxJNG0cqh0YYIIyDWsKnLo9UZTp31WjIbG9gv7ZZrdwynr6g+hqzXG3lpc+Gr37ZZZezc4dD29j/Q11NhfQ6harPA2VbqO4PoaJwt70dghO75ZblqmsAwIIyDwQaWlrI1OMvYJfDWqreWwJspjhk9Pb/Cuut5o7mBJomDRuMgimXtrHe2slvMMo4x9PeuZ0C5l0rU5NIuz8pbMTHpn/wCv/Ot3+8jfqjnX7uVujOuopKWsDoCiiigAooooAKKKKACiiigBKxPFGpfYdOMcZxNP8i46gdz/AJ9a264+Ef274qaU/Na2vT0ODx+Z5rWlFN8z2RjVk0uVbs2fDmmDTtOXeMTy/M/t6D8K16KKiUnJ3ZpGKirIKgvLqKztZLiZtqIMmp65DV5pNd1pNNt2It4jmRh6jqfw6fWqpw5nrsTUnyrTcbplpL4i1JtQvQRaocInY+309a7AAAAAYAqO3gjtoEhiULGgwAKloqT5n5BThyrzFooorM0CiiigAooooAKKKKACiiigAooooAKKKKACiiigBksaTRtHIoZGGCD3Fcc6y+FtWDrufT5zyPT/AOuP1rs6q6jZRahZyW8o4YcH+6exrSnPl0ezMqkObVbonikSaNZI2DIwyCO4p9cr4avJbK8l0e8OGQnyyf5fj1FdVSqQ5HYdOfMrhXPeLNOM9qt7ACJ7fnI6lf8A63WuhpGUMpVhkEYIpQlyyuhzjzKxn6HqA1LTY5if3g+WQejD/Oa0a5DSydF8SzWDHEFx9zP/AI7/AFFdfVVYpS02ZNKXNHXdC0UUVmahRRRQAUUUUAFFFFAGX4gvfsOkTyKcSMNifU/5z+FVvCdl9l0hJGGJJzvP07fp/Os/xW7Xmp2OmofvMGb8Tj+Wa6qNFjjVFGFUYA9K2fu00u5hH3qjfYfRRSVibmV4h1H+ztMd1OJX+SP6+v4VX8K6d9j0/wA+Qfv7j5jnqB2H9azdSzrPimGzHMFv9/09T/QV14AAwOlby9yCj1ZhH35uXYKWiisDcKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA5jxbYsFi1O3+WaAjcR6Z4P4H+dbWl3q6hp8VwuMsPmHoe4qzNEk8LxSDKOpUj2Nct4Ykew1S70qU9CWT6j/ABGDW69+nbqjB+5Uv0Z1tFJS1gbnMeMbVvs8N9FxJAwBI9D0P54/Ot3Trpb2whuF/wCWign2PcfnS39st3ZTW7dJEK/Q+tYPgy4Y2lxaPw8L5APYH/64NbfFT9DD4anqdPRRRWJuFFFFABRRRQAUlLTWztOOtAHJ6d/p/jO6nPK24IH4fL/jXW1heHNJuNOa6kuihkmYH5Tn1/xrdrWq05adDKkmo6hUN3MttayzN0jUsfwqas/XLae90yW3ttoeTA+Y4GM81nGzauXK9nYx/BsDSC6v5OXlfaD+p/U/pXUVR0ezNhpkNu2N6j5sep5q9V1Zc0myaUeWKQtFJS1maBRRRQAUUUUAFFFFABRRRQAUUUlAC0UUUAFFFFABRRRQAUUUUAJXJeJFOn65ZainAYgPj2/+sf0rrayvEOmvqeniKHb5quGXccD3rSlJRlrsZVYuUdDUUhlBHQ0tVtPjlhsII58eaiBWwcjIqzWb3NFsFclZ/wCgeNbiHolwCR+I3fzzXW1zmvaPeXepQ3li6I6JjJOCCCf8a1pNXafUyqp2TXQ6OiuT/s/xN/z+r/31/wDWpf7P8Tf8/q/99f8A1qfsl/Mhe1f8rOrorlP7P8Tf8/qf99f/AFqP7P8AE3/P6v8A31/9aj2S/mQe1f8AKzrKKKKxNxKKWmt900AcxrWv3IvvsGlrumztZ8ZOfQVTki8T2qG4MrsF5Khlb9Kh8KYk1+eSTBYI7ZPruHP612c93bwRNJLMiooySTXXJqm1GMbnHFe0Tk3YyvDuuHVUeKZQtxGMnHRh61c1jU49LszM43OTtRP7xrmfCg87X7qeJSsO1vwy3Ap/jZy17aRZ+XaT+Z/+tQ6UXV5eg1VkqVxkM3iLVgZ4HMcRPy4IUfh3NS2+t6lpN2sGrqXib+LAyB6gjrXTxS2ttEkIliQRgLt3AYxWJ4va3n0oMkkbSRyAjDAnng0Rmpy5XHQUouEeZS1Nq/uCml3E8DDKxM6MOe2QayPCmpXeopcm7l8zYV2/KBjr6CixkMvgpmY5IgkX8Bkf0qp4F/1d59V/rUqCUJeRXO3OPmdaa5TQNXvrzWpbe4m3xKGIXaB0PsK6s9K4bwr/AMjHN/uv/OppRThJsqq2pRsdpcXEVrA807iONBksa5W48V3VzMYtKsy/ozKWY++B0qHxRPLqOtw6ZE2EUqD6bj3P0FdRp1naabbLDb7QB95sjLH1NYHQY2mTeIpdQhN5HstSTvG1Bxg/jUOravq+nalMViLWgI2lo/lxj1FdUHQnAZSfrSsoZSGAIPUGrhJRequZzi5LR2M3RtZh1aElR5cyffjJ6e49qz9X8TpazG2soxPODgn+EH09zWNrUL6DrPnWf7tJkJUDoM8EfyNbPhTSo4LJL2RQ083IJ/hHtXQ6cIr2nRmCnOT5Opa8P3Oo3Ucz6jG0fI2Apt471l6n4gvLq+ax0ZCxBIMgGSfXGeAPeulvnMdhcuvDLExH5GuX8CRKftkx+8Nqg/ma5pO7udMVZWIHuPEulr9ouN7xD7wYq4/HHIrpdF1eLVrUyINkqcSJnof8KvyqjROsgBQqQ2emK4jwa/l6rdEH90ImJ+gIxUlHVatq9tpUIediXb7ka9W/+tXOjxBrWoMf7PsgsfYhC36niqmlwf8ACQ65Nc3jfuEO4qT2/hWu5QxRoEQoiqMBRgAUAZmgtqzCb+1hjp5fC++en4VD4i17+ylWGBVe5cZGeij1rcDK33SD9DXFyAXXjzbKNyq4wD7LkfrQA3HiqVBcAzAHkAFR/wCO1peHvEEt3cGxv123IztbGNxHUEdjXSkgDJ6Vw7ul545je1IZRIuWXodo5P6UCNfWm18X2NMBNvtHZOvfrzWFdaz4gs7hYLibZKwBC7EPX6Cu/rhPFn/Ixwf7qfzNAFtH8W713KdueeI60fEHiD+y2W3gQSXLDPPRR/Wt+uF8SbrLxPDeSRl4so499vUUDLC3HiyVQ6xlVbkAqg/nzV7SG8QnUIxqKkW2Du4T046c1r6fqVrqMW+2lDeqnhl+oq5QAtFFFABRRRQAUUUUAFNb7p+lOprfdP0oE9jz/wAPWv22+vbffs8yBhuxnHzLWjJ4Mfadl6C3YMn/ANeqnhOWODV7mSVwiLCxLE8D5hXVtremqpJvYePRs121ZzjP3DipQhKHvHN6Fd3Gj6r/AGXdKoR2xkDoT0Oe4NHjT/kKWn+5/WoJLga14rgktlPlqy4JHZeSam8Z/wDITtP9z+tXb96m92ib/u2ltcu3nhMXd5LcfayvmsW27M4/WsrWPDY0yxNz9pMmGA27MdfxrvB0FYfjD/kBv/vr/OsaVafMo30NqlGHI3Yg0z/kSH/64y/zaq3gX7l59V/rV/QIftHhJIc48xJFz9WYVh+GL5NL1Ce2vD5W/gluisPWq3jNLuRe0oN9juj0rhvCv/Ixzf7r/wA66m/1e0s7V5WnjY4+VVYEsa5vwZbyS39xeMDsClc+rE5qKSapybLqNSqRSKGq232jxbLbySeUJZQA+M4yBitb/hC/+n9v+/f/ANepfFmjS3JW/tFLSxjDqvUgdCPcVLonie3uIVivpFhuFGCzcK/vnsa5jpE03wt9gv4br7YZPLJO3ZjPGPWukqvHfWkrhI7qB3boqyAk1Wv9bsbDess4Mi/8s15bNNRcnZCclFXZgeOmXfZr/Fhj+HFdDojrJo1mynjylH4gYNcjDDceJ9UlmcFIVUgHsvHyj8+an0LWG0eWTT9QVkjVuDjOw/4V2Tp3pqC3RxwqWqOb2Z1upf8AILu/+uL/APoJri9Alv4dKum02PzJvOQEbc/Lg/8A1q6y5vLe70q8a2mSUCF87TnHymsTwJ/x73n+8v8AI1x2todqd9itO/ibUIzbvA0aPwxChcj3Na2n6J/Zej3a7g9zLE25h0HBwBXQUlIZ5voGkLq8kyG5MLRgEALncPz+n51t/wDCFf8AT+3/AH7/APr1S1GzufDmrC+tVLWzNx6AHqp/pXTWOv6feQhxcRxP3SRgpH59aBDdD0X+yBMPPM3m46rjGM+/vXPxjPjxwOpdv/QK7GG5guM+RNHLt67GDY/KuPh/5H5v+uh/9BoGOl8L6sUYfb1cH+EyNzVfw7K2ka4bO7gVZJSI956qT0wfQ13dcVr/APyONn/vRf8AoVAjtq4TxZ/yMkH+6n8zXd1wniz/AJGSD/dT+ZoGd3Ve8s7e+gMNzGJEPr29x6VYqtJf2cMhSW7gjdeqtIARQByV94Wu7KT7RpczOF5C5w4+nrV3w94ilnuBY6gMTdFcjBJ9CPWt3+1NP/5/rb/v6v8AjXHX00N/4vt2sfmHmJll/iIPJ/L+VAjvaKKKBhRRRQBU/tKx/wCf22/7+r/jR/aVj/z+23/f1f8AGsj/AIQ7Tf79x/30P8KP+EO03+/cf99D/CgDX/tGx/5/bb/v6v8AjQdRsSMfbbb/AL+r/jWR/wAIfpv9+f8A76H+FH/CHab/AH5/++x/hQIbZeH9OIuTb3jzCVDG5V1bGSD2HtTf+ENsv+fi4/Nf8Kr+FB9j1fUbAk/Kcrn/AGTj+RFdWJE8wx713gZ255x64rX2011M/YwfQpabpNppiEW6Hc33nY5Y1W1rSLS+ljubu4aARjaDuAHX3qXVNVNlLFbwW7XN1NkrGpxx6k1RurltX0m/tJrdre7hTcYic+4IP4VHPK/NfUrkjbltob8bK6KyMGUjIKnINVdU0+PUrQ28rMikg5XrxWd4QuvtGipGT80LFD9Oo/nW7STad0U0mrMq6dZJp9lHaxszImcFuvJz/WquqaFZ6md8qlJf+eiHBP19a1KKanJO6eonCLVmjmYfBtorgyzzSL/dGBXQ21tDawrDBGI416AVLRTlUlP4mKNOMdkFZWoeH9P1By8kRjlPV4ztJ+vY1rUlQWYNh4XtLC9iuY5p2eM5AYjHTHpT7rw1Z3d/JdTtKzOclAwA6fTNbdFVGTjsTKKluRW1tDawrFBGsca9AKq6lpFnqSj7RH844Drwwq/RSUmndMHFNWaMnT9CgsLW5gjllZbgbWLYyOCOOPepNH0eHSElWCSRxIQTvx2+laVFEpOTuxxioqyFooopDGOiyIUdQysMEMMg1h3XhLTZ3LIJYCe0bcfrmt+igDM0fRoNIEogkkfzMZ344x9BTF0K3XWTqQkl80knbxt6Y9K1qKACsm80K3vNUiv3llWSMqQq4wcHPpWtRQAViatotnd3a3t1cPDsAH3gF4PvW3XL+NZz9ltrNOXmkzge3/1zQB0qOkiB42V0PIZTkGsS/wDC9pf3stzJNOryEEhSMdMela9nALazhgHSNAv5CsWK71q+MlxZC1W3DlUSQHLAHGaAIf8AhC7H/n4ufzX/AAq9p+laZo0wKyD7Q/CtM43H2A4p9lqF+90lve6c0W7P71G3J0/Ssi//ANN8cWsI5W3AJ/AFv6igDraKKKACiiigAooooAKKKKAORvv+Jd41t5+kdyAD6c/L/gavahIdK13+0ZI3e2mh8p2QZKEH+VR+M7Qy6bHdJ9+3fJI9Dx/PFWptRmn8LtfWvM5izwOh6N+XNAEGmyG/1i41V42itY4vLiaQYyOpNaMFrFJqLalHMHWWERgL0IznOayTu0q3gvf7Rku7WYhZkmbcCD3X6elWfDDbobswqwszOTBuGOO+PagDN0Q/2V4mu9PbiOblP5j9Ca6+uW8X2rx/Z9Ut+JIGAYj0zwfz/nW/p92l9ZRXMf3ZFzj0PcUAWqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuQU/2x4z3D5oLP8uP/sjW7ruoDTdLlmBxIRtjH+0f85rL8MwxaZpiXN3Iscl44wWPUdh/X8aAN+7njt7Z5JplhQD757GuX0+6uY3aLTNStLwMxbypkMbEnk4rS1944rzTpbtd1ksjeZkZAbHyk0mt2+mT6VLcgwq6LuiljIB3dsEdaAL+n3V3Msv22z+ytHjneGDfSsHwsDe61qGosOCSq59z/gBV7Vr6S18LK8xxcTRLH77iOf0zU3haz+yaJDuGHm/et+PT9MUAbNFFFABRRRQAUUUUAFFFFAENzAlzbSwSDKSKVP41zPhKd7a4u9JuOHjYsoPfsf6GusrkvE8Emn6lbaxbjowWTHc//XHFADr3TbTSy1xLALy6uJiLeHGEGTxxVvGvW0JuHe1dUGTbKuMD0B9am1FWvrSz1GxHmvAwlRP74I5H1qzd6rb2lkk10GjaRciE/fJ9MUASrJb6lpgdsGCePnPYGuc0Cd9H1abSLpv3btmJj0z2/MfrSRo91cW9tqEcthp7H9xAvRz1wzevtWl4k0f7bZrLbDFzbj5MdWHp/hQBu0tYvhzWBqdpslOLqIYcf3vetqgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkpa5zxRqzQoNPs8tdT/KdvVQe31NAFC6Y+JPEKW8ZJsrb7xHQ+p/HpXSXktjHb7rjymSBgACu7Y3bj1qHQdKXSrARnBmf5pG9/T6Cs6/0qDUNUNxYXsEdwnzMoO7Lg8EjNADpNO1aFJJEuIr1ZSWktpl+U8/w56UzSLPSri7YHTXtruL5mjk3FR7jtU39uXVkDDqVjL52PkeEblkP9KtSX8tjof2y+VRcbM7QMfMegoAxtdY6v4ittMjOYoTmQj8z+n8661QFUBRgDgCub8IWT+VNqVxkzXJO0n0zyfxP8q6agAooooAKKKKACiiigAooooAKr3trHe2ktvKPkkXB9verFFAHJeGbuTT76bRrw4IYmInpn0/HrWyNOsrO6m1G4ctITu3zNkRj0HpVHxTpTXMK31rkXVvz8vVgOfzFT6VeW3iDTAl1GjyIR5sZ9R0NAFS4uH12RPJQxabbuJXuH437f7tbGlXrahZC5MRiDM20E9VzwazPEtyIreHToUf9+QHWFckRjrge/SiS81FLZfKgt9MtIwFD3LZOPYCgCpr2mTWF2NX0z5WU5lQfqfp61t6PqsOq2okjO2ReHjPVT/hUllqNpfKVguI5nA+YLx+h7Vz+q6PcaXdHUtHyAOZIh2HfjuPagDraKydF1y31WIKCI7gD5oyf1HqK1qACiiigAooooAKKKKACiiigAooooAKKKKACiisLXPEEWngwW+JrxuAo5C/X/CgCXXtaj0qDamHunHyJ6e5qn4c0eSNzqV/lruXlQ3Vc9z7/AMqboehSmf8AtHVSZLljuVG52+59/btV3+0BYXTW1/eo807kw4XAjXsGoAm1WSS4tp7OxlQ3ZADKGAZFJ5P5Vjto0E+qNa2Z+yGyjUmVPvs7dM+1O0xdVs4Wt4tMT7UWJkupX+V8nrxyaS2tZ9S1G6FxM9pewBUkktm+WRT0696ANLQrrULmNvtawtGhZBKp5cg46fhWNqsr+INdj06Bj9mgOZGH6n+gq5rl9Ho2nR6dY58912qByVHr9TVzw5pI0yxzIP8ASZfmkPp7UAa0UaRRJHGoVEAVQOwp9FFABRRRQAUUUUAFFFFABRRRQAUUUUAJXIavZzaFqI1SwX9wx/exjoM9fwP6V2FMkjSWNo5FDIwwQehFAFfT72DULVLmAghhgjup9DWJqFodX1+W1mlaNLeEPEo7sf4sd6o3Nvc+Fr/7Tagy2Ehwyensf6Gt0xWmuQxXlrM8UycJLGcMv+yR/SgDKuZZPt9hC1sItTjnUF41wskfc59PbtW9bapa3VzNBFJl4jtJ7E+3rVHV5rhng060BN1KnzTlfuJ0Jz6modS0mx07QZWjtg8kSgh+jE5HOetACax4bWeT7XpzfZ7oHdgHAY/0NV7DxJLay/ZNaiaKRePNx/Mf1FaOm3Ooo8CXqRzQzR7lmizhOM4b/Gh5tN12eSz8r7QsaBjMOi57A9c0Aa0Usc8YkidXRujKcg1JXFvpN7pd666NeiR1G9rckbse46GrVt4saF/J1W0eCQdWUf0NAHVUVStNUsr0D7PcxuT/AA5wfyNXKAFooooAKKKKAEpaTpVC81nT7IHzrmPcP4VO5vyFAGhUFzdQWkRluJVjQd2Nc1P4oubxzDpFm7sf42GcfgOn40W/hq7v5Rca1dMx/wCeanP4Z6D8KAG3evXmrTG00WJwp4aU8HH9P51paL4eh07E0x8+6PJc9F+n+NaUMVpp0UcMYjgRm2qOm4/1NZV5fajK1w9s0Nla25KmW4HLkeg7CgC3qF/MJo7TTxFJdOTks3yxgYyTj6iqCSLeTy6ZrdvEl1IvySoOJAOmD6iqVvNJeZ1axRV1CD5bmAdJV9RWxJHaeItMSSNijg5Rx96J6AILH7bA8mk3TSkFCYLtB/D7+hFPuJbTw1prEEySyEkbjlpW9TVvUNRh0ixV7mQySBcKP4pDWBpenXGu3v8Aaepj9xn93GehH+H86AJvDumS3VydX1HLSucxKe3v/hXVUgAAwOAKWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAZLEk0TRyKHRhgqRwa5C80+88OXTXumkyWh/1kZ5wPf2967KkIBGDyKAM/SdWttVh3wtiQD542+8v+I96r6hd3NrczC5tXubCVML5KZZT3DD39ao6p4bZJvtujv5E6nPlg4B+np9OlGmeJwJPsurIbedeC5GAfqO38qAFs7q40nwypnRhOzFLeJvvc/dBq3pWhiyWGcyyrdctNtb5ZCexHtVjVbE6jFby20qrNA4liY8qT71n6zJP5mnxX0xtrWTP2h4SQN2OBnsKAJRfyW94o1GwW1e4/dLcxMG57AntV+GwgazW0uWF4Y+GaXDNzzz6Vz5t4LrWbWysrqSa0jInlBk3qpXpg/561Y0qxj1c3t9O82yeYiMJIVG1eAeOtAEt34QsJiWgaS3b2O4fkf8AGqT6JrNgjPa6qPKQZO9yoA+hyKsabq72mjO8zSXLfaGhtwT80npzTdavdWj0qVbu1gVJx5YMTklCexz1/CgCFJ/FMaBlSK4QjIYbCCPwNP8A7W8SLw2mIfpG3+NXWaAX2nabKl1HJAA0bIQEfavOfap5PENnG8gCTyRRna8yR5RT9aAMv+1fEr8LpqL9YyP5mkz4ruP4UgB7/IP8TW0+tWyWUFyyy/v/APVRBcu/0FNt9ailmaB4J7efaWWOZdu8D0oAx/8AhHNWu/8Aj/1Q7T1VSW/TgVetPCenW+DKHuG/2zgfkKE1fUL61+06dZx+SoyfOY5YjqFAqG61JtTi0uKF3gjvWIlKnDDb1XNAG7i3sLV2VFihjUsQi9APYVnJq8t0JZbG38y1jjLGVjjc23IUD8hVHUbOPQ5Le7sy627yCK4iZywZT3571Z8O/wChz3ultwYJN8ee6N0/z70AZhtludB/tdr2U3qfvN5f5VYH7uO1XdTmkePSbu6hd7YfPOirnDEcEj0pmpaIV1FZbKzgCMMl5HwiPnqV78dKW1uJLPWRG2pNdQCMtcNIRsjPbHp9KAJba2m1DVW1O2Z7OLAQbo+Zh3JB6dsVNqur2WiRukSIbhyW8pOOT3as+/8AEc95N9j0SJpHbgy4/l6fU1a0bw4lrJ9qvm+0XZO7nkKf6n3oApaZo1zqt0NR1kkg8pCeMj6dh7V1igKAAAAOABS0tABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVDUtJtNTj23MeWH3XHDD8av0UAccbDWdAYvYyG6tepjxnH4f4VfsfFNjdjyrxfs8h4IcZU/j/AI10VZ2oaNY6iCZ4F3/314b86AAafbSGee0YRvcReXvj5X2IFItnJYaEbW0HmSpEVXtlj3/M1iP4b1CwcyaTfNjrsY7f/rGkGvazp3Go2BkUdXAx+oyKAH3Nm+mWmjTPGzR2jEzhRkqW5z+dS6pf2uqXOm2trMsoecO+3sBUtv4u02UYmEsJ77lyP0q7DqGkTOjxz2u9fukkKR+dAFaUef4uRe0FqT9CTj+tZthPPBo8+mw2b3JJeNJkx5b5zySa6WOK1NzJdRBGmdQrMrZyB2rmJIbDbIj6JfJcHO1U3Fc+oIOKAFktLiw1PSYTcrARbmNZSoYB8kkDP1ArW/ssyX9tLd6k00sTFo02qufXp2qSx0/ztEt7bVUEsir8245I5459cYp9tp2mabJ5qLHHJjG93yQPxPFAFXw1+6S+sz/ywuGAHselUbTS5Li0ubZCYZ7O7Z7eQjj/APVWu+q6RaPI/wBpt1dzlynJY++Kz7nxhYR5EEcs57YG0frQBNLZalqZhj1AW8NvG4dxESxkI/kK05o7S3uDfTbI5AmwyM2Pl64rnP7X17UuLGy8hD/GR/U8U6Hwtc3cgl1a+eQ/3UOf1PT8qADWvEFldxGzt4GvWYjHULn8OTVSw8NXl7ta9ItbfOREg5/Lt9TzXVWOmWenri2gVD3bqx/GrtAFWxsLbT4fLtYgg7nufqatUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFJRRQBTudKsLnJmtIWJ77cH8xWbN4S0uTO1JYv8Acf8AxzRRQI57UNFtrRj5ckxx6kf4VjSNJGcLLJ/31RRTAdFvlOHlkI/3q3NN0C1u2AkknGf7rD/CiigDeh8KaVF96KSX/fc/0xWlbadZ2uPItYYyO4QZ/OiikMt0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2Q=='
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