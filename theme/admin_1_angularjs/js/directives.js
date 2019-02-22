/***
GLobal Directives
***/

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
])

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
              `
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
      }


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
          })
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
        }

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
          
          vm.address = Object.assign(vm.address, addrObj)
          if(vm.onSelect)
              vm.onSelect();
        });
        return;
      };

        vm.onSelectCity2 = function ($item, $model, $label) {
        console.log($item, $model, $label)
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
            }

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
            vm.address = Object.assign(vm.address, addrObj)
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
                `
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
        }


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
             console.log($rootScope.ip + 'uploads/' + fileName)

             $http({
                 method: 'GET',
                 url: url,
                 responseType: 'blob'
             }).then(function (response) {
                 var blob = response.data;
                 startBlobDownload(blob, fileName)
             }, () => $rootScope.sharedService.alert("File not found.", 'danger'));
         };

        vm.editEntry = function (id = -1) {
            // console.log(id);
            if(id == -1 && vm.id == false)
                return console.error("Fehler bei editEntry");

            if(id == -1)
                id = vm.id

            if(vm.recentEl)
                vm.recentEl.editMode = false;

            var idx = vm.uploads.findIndex(o => o.id == id);

            vm.recentEl = vm.uploads[idx];
            vm.uploads[idx].editMode = true;
            vm.id = id;
        }

        vm.saveEntry = function (id = -1) {
            if(vm.id == false)
                return console.error("Fehler bei saveEntry");

            var idx = vm.uploads.findIndex(o => o.id == vm.id);
            vm.uploads[idx].editMode = false;
        }

        vm.deleteEntry = function (id = -1) {

            if(id == -1)
                return console.error("Fehler bei deleteEntry");

            var idx = vm.uploads.findIndex(o => o.id == id);
            $rootScope.sharedService.showConfirmDialog("sure").then(function () {
                if (vm.ondelete)
                    vm.ondelete(vm.uploads[idx].id);
            });
        }

        vm.newDocument = function () {
            if(vm.makeDisabled)
                return;
            // console.log("HI");
            //$scope.$close();
            // console.log(vm.uploadtype);
            // console.log(vm);
            var obj = {
              uploads: vm.uploads,
              callback: vm.onsave
            };
            if(vm.uploadtype)
              obj['uploadtype'] = vm.uploadtype;

            obj.single = true;

            // console.log(obj);
            modalService.openMenuModal('views/form_upload.html', 'FormUploadController2', 'animated zoomIn', obj).then(() => {
                if(vm.disablesub && vm.uploadsLen < vm.uploads.length)
                    vm.disablesub = false;
            });
        }

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
            })

            scope.$on('$destroy', function () {
              //console.log("destroyed", htmlElement)
              toBind.unbind('click.' + attrs.id);
            })
        }]
    }
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
    }
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
          })

          scope.$on('$destroy', function () {
            toBind.unbind('keydown');
          })
        }
    }
})

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
    }
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
    }
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
}
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
    }
  }
])

.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);