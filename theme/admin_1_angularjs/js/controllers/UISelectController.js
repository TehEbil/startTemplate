/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
angular.module('MetronicApp').filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

angular.module('MetronicApp').controller('UISelectController', function($scope, $http, $timeout, $interval) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initAjax(); // initialize core components
    });

    var vm = this;

    vm.disabled = undefined;
    vm.searchEnabled = undefined;

    vm.setInputFocus = function() {
        $scope.$broadcast('UiSelectDemo1');
    };

    vm.enable = function() {
        vm.disabled = false;
    };

    vm.disable = function() {
        vm.disabled = true;
    };

    vm.enableSearch = function() {
        vm.searchEnabled = true;
    };

    vm.disableSearch = function() {
        vm.searchEnabled = false;
    };

    vm.clear = function() {
        vm.person.selected = undefined;
        vm.address.selected = undefined;
        vm.country.selected = undefined;
    };

    vm.someGroupFn = function(item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };

    vm.firstLetterGroupFn = function(item) {
        return item.name[0];
    };

    vm.reverseOrderFilterFn = function(groups) {
        return groups.reverse();
    };

    vm.personAsync = {
        selected: "wladimir@email.com"
    };
    vm.peopleAsync = [];

    $timeout(function() {
        vm.peopleAsync = [{
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        }, {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        }, {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        }, {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        }, {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        }, {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        }, {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }, {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        }, {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        }, {
            name: 'Nicolás',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }];
    }, 3000);

    vm.counter = 0;
    vm.onSelectCallback = function(item, model) {
        vm.counter++;
        vm.eventResult = {
            item: item,
            model: model
        };
    };

    vm.removed = function(item, model) {
        vm.lastRemoved = {
            item: item,
            model: model
        };
    };

    vm.tagTransform = function(newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase() + '@email.com',
            age: 'unknown',
            country: 'unknown'
        };

        return item;
    };

    vm.peopleObj = {
        '1': {
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        },
        '2': {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        },
        '3': {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        },
        '4': {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        },
        '5': {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        },
        '6': {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        },
        '7': {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        },
        '8': {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        },
        '9': {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        },
        '10': {
            name: 'Nicolás',
            email: 'nicolas@email.com',
            age: 43,
            country: 'Colombia'
        }
    };

    vm.person = {};

    vm.person.selectedValue = vm.peopleObj[3];
    vm.person.selectedSingle = 'Samantha';
    vm.person.selectedSingleKey = '5';
    // To run the demos with a preselected person object, uncomment the line below.
    //vm.person.selected = vm.person.selectedValue;

	vm.type = [
		"Haus",
		"Appartment",
		"Wohnung",
		"Villa",
		"Schloss"
	];

    vm.title = [
	  "Dr.",
	  "Prof.",
	  "Prof. Dr.",
	  "Dipl.-Ing.",
	  "Dipl.Kfm."
	];

    vm.rechtsformen = [
        "AG",
        "Einzelunternehmen",
        "GbR",
        "GmbH",
        "GmbH & Co.KG",
        "KG",
        "OHG.",
        "PartG",
        "PartG mbB",
        "UG",
	];

    vm.gender = [
	  "Herr",
	  "Frau"
	];

    vm.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    vm.singleDemo = {};
    vm.singleDemo.color = '';
    vm.multipleDemo = {};
    vm.multipleDemo.colors = ['Blue', 'Red'];
    vm.multipleDemo.colors2 = ['Blue', 'Red'];
    //vm.multipleDemo.selectedPeople = [vm.people[5], vm.people[4]];
    vm.multipleDemo.selectedPeople2 = vm.multipleDemo.selectedPeople;
    //vm.multipleDemo.selectedPeopleWithGroupBy = [vm.people[8], vm.people[6]];
    vm.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];
    //vm.multipleDemo.removeSelectIsFalse = [vm.people[2], vm.people[0]];

    vm.appendToBodyDemo = {
        remainingToggleTime: 0,
        present: true,
        startToggleTimer: function() {
            var scope = vm.appendToBodyDemo;
            var promise = $interval(function() {
                if (scope.remainingTime < 1000) {
                    $interval.cancel(promise);
                    scope.present = !scope.present;
                    scope.remainingTime = 0;
                } else {
                    scope.remainingTime -= 1000;
                }
            }, 1000);
            scope.remainingTime = 3000;
        }
    };

    vm.address = {};
    vm.refreshAddresses = function(address) {
        var params = {
            address: address,
            sensor: false
        };
        return $http.get(
            'http://maps.googleapis.com/maps/api/geocode/json', {
                params: params
            }
        ).then(function(response) {
            vm.addresses = response.data.results;
        });
    };

    vm.addPerson = function(item, model) {
        if (item.hasOwnProperty('isTag')) {
            delete item.isTag;
            vm.people.push(item);
        }
    };

    vm.country = {};
    vm.countries = // Taken from https://gist.github.com/unceus/6501985
[{"name":"Deutschland","code":"DE"},{"name":"Afghanistan","code":"AF"},{"name":"Åland","code":"AX"},{"name":"Albanien","code":"AL"},{"name":"Algerien","code":"DZ"},{"name":"Amerikanisch-Samoa","code":"AS"},{"name":"Andorra","code":"AD"},{"name":"Angola","code":"AO"},{"name":"Anguilla","code":"AI"},{"name":"Antarktika","code":"AQ"},{"name":"Antigua und Barbuda","code":"AG"},{"name":"Argentinien","code":"AR"},{"name":"Armenien","code":"AM"},{"name":"Aruba","code":"AW"},{"name":"Australien","code":"AU"},{"name":"Österreich","code":"AT"},{"name":"Aserbaidschan","code":"AZ"},{"name":"Bahamas","code":"BS"},{"name":"Bahrain","code":"BH"},{"name":"Bangladesch","code":"BD"},{"name":"Barbados","code":"BB"},{"name":"Weißrussland","code":"BY"},{"name":"Belgien","code":"BE"},{"name":"Belize","code":"BZ"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Bhutan","code":"BT"},{"name":"Bolivien","code":"BO"},{"name":"Bonaire, Sint Eustatius und Saba","code":"BQ"},{"name":"Bosnien und Herzegowina","code":"BA"},{"name":"Botswana","code":"BW"},{"name":"Bouvetinsel","code":"BV"},{"name":"Brasilien","code":"BR"},{"name":"Britisches Territorium im Indischen Ozean","code":"IO"},{"name":"Kleinere Inselbesitzungen der Vereinigten Staaten","code":"UM"},{"name":"Britische Jungferninseln","code":"VG"},{"name":"Amerikanische Jungferninseln","code":"VI"},{"name":"Brunei","code":"BN"},{"name":"Bulgarien","code":"BG"},{"name":"Burkina Faso","code":"BF"},{"name":"Burundi","code":"BI"},{"name":"Kambodscha","code":"KH"},{"name":"Kamerun","code":"CM"},{"name":"Kanada","code":"CA"},{"name":"Kap Verde","code":"CV"},{"name":"Kaimaninseln","code":"KY"},{"name":"Zentralafrikanische Republik","code":"CF"},{"name":"Tschad","code":"TD"},{"name":"Chile","code":"CL"},{"name":"China","code":"CN"},{"name":"Weihnachtsinsel","code":"CX"},{"name":"Kokosinseln","code":"CC"},{"name":"Kolumbien","code":"CO"},{"name":"Union der Komoren","code":"KM"},{"name":"Kongo","code":"CG"},{"name":"Kongo (Dem. Rep.)","code":"CD"},{"name":"Cookinseln","code":"CK"},{"name":"Costa Rica","code":"CR"},{"name":"Kroatien","code":"HR"},{"name":"Kuba","code":"CU"},{"name":"Curaçao","code":"CW"},{"name":"Zypern","code":"CY"},{"name":"Tschechische Republik","code":"CZ"},{"name":"Dänemark","code":"DK"},{"name":"Dschibuti","code":"DJ"},{"name":"Dominica","code":"DM"},{"name":"Dominikanische Republik","code":"DO"},{"name":"Ecuador","code":"EC"},{"name":"Ägypten","code":"EG"},{"name":"El Salvador","code":"SV"},{"name":"Äquatorial-Guinea","code":"GQ"},{"name":"Eritrea","code":"ER"},{"name":"Estland","code":"EE"},{"name":"Äthiopien","code":"ET"},{"name":"Falklandinseln","code":"FK"},{"name":"Färöer-Inseln","code":"FO"},{"name":"Fidschi","code":"FJ"},{"name":"Finnland","code":"FI"},{"name":"Frankreich","code":"FR"},{"name":"Französisch Guyana","code":"GF"},{"name":"Französisch-Polynesien","code":"PF"},{"name":"Französische Süd- und Antarktisgebiete","code":"TF"},{"name":"Gabun","code":"GA"},{"name":"Gambia","code":"GM"},{"name":"Georgien","code":"GE"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Griechenland","code":"GR"},{"name":"Grönland","code":"GL"},{"name":"Grenada","code":"GD"},{"name":"Guadeloupe","code":"GP"},{"name":"Guam","code":"GU"},{"name":"Guatemala","code":"GT"},{"name":"Guernsey","code":"GG"},{"name":"Guinea","code":"GN"},{"name":"Guinea-Bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Haiti","code":"HT"},{"name":"Heard und die McDonaldinseln","code":"HM"},{"name":"Heiliger Stuhl","code":"VA"},{"name":"Honduras","code":"HN"},{"name":"Hong Kong","code":"HK"},{"name":"Ungarn","code":"HU"},{"name":"Island","code":"IS"},{"name":"Indien","code":"IN"},{"name":"Indonesien","code":"ID"},{"name":"Elfenbeinküste","code":"CI"},{"name":"Iran","code":"IR"},{"name":"Irak","code":"IQ"},{"name":"Irland","code":"IE"},{"name":"Insel Man","code":"IM"},{"name":"Israel","code":"IL"},{"name":"Italien","code":"IT"},{"name":"Jamaika","code":"JM"},{"name":"Japan","code":"JP"},{"name":"Jersey","code":"JE"},{"name":"Jordanien","code":"JO"},{"name":"Kasachstan","code":"KZ"},{"name":"Kenia","code":"KE"},{"name":"Kiribati","code":"KI"},{"name":"Kuwait","code":"KW"},{"name":"Kirgisistan","code":"KG"},{"name":"Laos","code":"LA"},{"name":"Lettland","code":"LV"},{"name":"Libanon","code":"LB"},{"name":"Lesotho","code":"LS"},{"name":"Liberia","code":"LR"},{"name":"Libyen","code":"LY"},{"name":"Liechtenstein","code":"LI"},{"name":"Litauen","code":"LT"},{"name":"Luxemburg","code":"LU"},{"name":"Macao","code":"MO"},{"name":"Mazedonien","code":"MK"},{"name":"Madagaskar","code":"MG"},{"name":"Malawi","code":"MW"},{"name":"Malaysia","code":"MY"},{"name":"Malediven","code":"MV"},{"name":"Mali","code":"ML"},{"name":"Malta","code":"MT"},{"name":"Marshallinseln","code":"MH"},{"name":"Martinique","code":"MQ"},{"name":"Mauretanien","code":"MR"},{"name":"Mauritius","code":"MU"},{"name":"Mayotte","code":"YT"},{"name":"Mexiko","code":"MX"},{"name":"Mikronesien","code":"FM"},{"name":"Moldawie","code":"MD"},{"name":"Monaco","code":"MC"},{"name":"Mongolei","code":"MN"},{"name":"Montenegro","code":"ME"},{"name":"Montserrat","code":"MS"},{"name":"Marokko","code":"MA"},{"name":"Mosambik","code":"MZ"},{"name":"Myanmar","code":"MM"},{"name":"Namibia","code":"NA"},{"name":"Nauru","code":"NR"},{"name":"Népal","code":"NP"},{"name":"Niederlande","code":"NL"},{"name":"Neukaledonien","code":"NC"},{"name":"Neuseeland","code":"NZ"},{"name":"Nicaragua","code":"NI"},{"name":"Niger","code":"NE"},{"name":"Nigeria","code":"NG"},{"name":"Niue","code":"NU"},{"name":"Norfolkinsel","code":"NF"},{"name":"Nordkorea","code":"KP"},{"name":"Nördliche Marianen","code":"MP"},{"name":"Norwegen","code":"NO"},{"name":"Oman","code":"OM"},{"name":"Pakistan","code":"PK"},{"name":"Palau","code":"PW"},{"name":"Palästina","code":"PS"},{"name":"Panama","code":"PA"},{"name":"Papua-Neuguinea","code":"PG"},{"name":"Paraguay","code":"PY"},{"name":"Peru","code":"PE"},{"name":"Philippinen","code":"PH"},{"name":"Pitcairn","code":"PN"},{"name":"Polen","code":"PL"},{"name":"Portugal","code":"PT"},{"name":"Puerto Rico","code":"PR"},{"name":"Katar","code":"QA"},{"name":null,"code":"XK"},{"name":"Réunion","code":"RE"},{"name":"Rumänien","code":"RO"},{"name":"Russland","code":"RU"},{"name":"Ruanda","code":"RW"},{"name":"Saint-Barthélemy","code":"BL"},{"name":"Sankt Helena","code":"SH"},{"name":"St. Kitts und Nevis","code":"KN"},{"name":"Saint Lucia","code":"LC"},{"name":"Saint Martin","code":"MF"},{"name":"Saint-Pierre und Miquelon","code":"PM"},{"name":"Saint Vincent und die Grenadinen","code":"VC"},{"name":"Samoa","code":"WS"},{"name":"San Marino","code":"SM"},{"name":"São Tomé und Príncipe","code":"ST"},{"name":"Saudi-Arabien","code":"SA"},{"name":"Senegal","code":"SN"},{"name":"Serbien","code":"RS"},{"name":"Seychellen","code":"SC"},{"name":"Sierra Leone","code":"SL"},{"name":"Singapur","code":"SG"},{"name":"Sint Maarten (niederl. Teil)","code":"SX"},{"name":"Slowakei","code":"SK"},{"name":"Slowenien","code":"SI"},{"name":"Salomonen","code":"SB"},{"name":"Somalia","code":"SO"},{"name":"Republik Südafrika","code":"ZA"},{"name":"Südgeorgien und die Südlichen Sandwichinseln","code":"GS"},{"name":"Südkorea","code":"KR"},{"name":"Südsudan","code":"SS"},{"name":"Spanien","code":"ES"},{"name":"Sri Lanka","code":"LK"},{"name":"Sudan","code":"SD"},{"name":"Suriname","code":"SR"},{"name":"Svalbard und Jan Mayen","code":"SJ"},{"name":"Swasiland","code":"SZ"},{"name":"Schweden","code":"SE"},{"name":"Schweiz","code":"CH"},{"name":"Syrien","code":"SY"},{"name":"Taiwan","code":"TW"},{"name":"Tadschikistan","code":"TJ"},{"name":"Tansania","code":"TZ"},{"name":"Thailand","code":"TH"},{"name":"Timor-Leste","code":"TL"},{"name":"Togo","code":"TG"},{"name":"Tokelau","code":"TK"},{"name":"Tonga","code":"TO"},{"name":"Trinidad und Tobago","code":"TT"},{"name":"Tunesien","code":"TN"},{"name":"Türkei","code":"TR"},{"name":"Turkmenistan","code":"TM"},{"name":"Turks- und Caicosinseln","code":"TC"},{"name":"Tuvalu","code":"TV"},{"name":"Uganda","code":"UG"},{"name":"Ukraine","code":"UA"},{"name":"Vereinigte Arabische Emirate","code":"AE"},{"name":"Vereinigtes Königreich","code":"GB"},{"name":"Vereinigte Staaten von Amerika","code":"US"},{"name":"Uruguay","code":"UY"},{"name":"Usbekistan","code":"UZ"},{"name":"Vanuatu","code":"VU"},{"name":"Venezuela","code":"VE"},{"name":"Vietnam","code":"VN"},{"name":"Wallis und Futuna","code":"WF"},{"name":"Westsahara","code":"EH"},{"name":"Jemen","code":"YE"},{"name":"Sambia","code":"ZM"},{"name":"Simbabwe","code":"ZW"}];
});
