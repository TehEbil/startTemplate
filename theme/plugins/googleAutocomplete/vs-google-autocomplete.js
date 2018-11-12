/**
 * vsGoogleAutocomplete - v0.5.0 - 2015-11-29
 * https://github.com/vskosp/vsGoogleAutocomplete
 * Copyright (c) 2015 K.Polishchuk
 * License: MIT
 */
(function (window, document) {
    'use strict';
    //angular.module('MetronicApp', []);
    
    angular.module('MetronicApp').service('vsGooglePlaceUtility', function() {

        function isGooglePlace(place) {
          if (!place)
            return false;
          return !!place.place_id;
        }
     
        function isContainTypes(place, types) {
          var placeTypes,
              placeType,
              type; 
          if (!isGooglePlace(place))
            return false;
          placeTypes = place.types;
          for (var i = 0; i < types.length; i++) {
            type = types[i];
            for (var j = 0; j < placeTypes.length; j++) {
              placeType = placeTypes[j];
              if (placeType === type) {
                return true;
            }
          }
        }
        return false;
      }
      
      function getAddrComponent(place, componentTemplate) {
        var result;
        if (!isGooglePlace(place))
          return;
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentTemplate[addressType]) {
            result = place.address_components[i][componentTemplate[addressType]];
            return result;
          }
        }
        return;
      }
      
        function getPlaceId(place) {
          if (!isGooglePlace(place))
              return;
          return place.place_id;
        }
      
        function getStreetNumber(place) {
          var COMPONENT_TEMPLATE = { street_number: 'short_name' },
              streetNumber = getAddrComponent(place, COMPONENT_TEMPLATE);
          return streetNumber;
        }
      
        function getStreet(place) {
          var COMPONENT_TEMPLATE = { route: 'long_name' },
              street = getAddrComponent(place, COMPONENT_TEMPLATE);
          return street;
        }
      
        function getCity(place) {
          var COMPONENT_TEMPLATE = { locality: 'long_name' },
              city = getAddrComponent(place, COMPONENT_TEMPLATE);
          return city;
        }
      
        function getState(place) {
          var COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
              state = getAddrComponent(place, COMPONENT_TEMPLATE);
          return state;
        }
        
        function getDistrict(place) {
          var COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
              state = getAddrComponent(place, COMPONENT_TEMPLATE);
          return state;
        }
      
        function getCountryShort(place) {
          var COMPONENT_TEMPLATE = { country: 'short_name' },
              countryShort = getAddrComponent(place, COMPONENT_TEMPLATE);
          return countryShort;
        }
      
        function getCountry(place) {
        var COMPONENT_TEMPLATE = { country: 'long_name' },
            country = getAddrComponent(place, COMPONENT_TEMPLATE);
        return country;
      }
      
      function getPostCode(place) {
        var COMPONENT_TEMPLATE = { postal_code: 'long_name' },
            postCode = getAddrComponent(place, COMPONENT_TEMPLATE);
        return postCode;
      }
      
      function isGeometryExist(place) {
        return angular.isObject(place) && angular.isObject(place.geometry);
      }
      
      function getLatitude(place) {
        if (!isGeometryExist(place)) return;
        return place.geometry.location.lat();
      }
      
      function getLongitude(place) {
        if (!isGeometryExist(place)) return;
        return place.geometry.location.lng();
      }
      
      return {
        isGooglePlace: isGooglePlace,
        isContainTypes: isContainTypes,
        getPlaceId: getPlaceId,
        getStreetNumber: getStreetNumber,
        getStreet: getStreet,
        getCity: getCity,
        getState: getState,
        getCountryShort: getCountryShort,
        getCountry: getCountry,
        getLatitude: getLatitude,
        getLongitude: getLongitude,
        getPostCode: getPostCode,
        getDistrict: getDistrict
      };
    });
    
    angular.module('MetronicApp').directive('vsGoogleAutocomplete', ['vsGooglePlaceUtility', '$timeout', '$http', function(vsGooglePlaceUtility, $timeout, $http) {

      return {
        restrict: 'A',
        require: ['vsGoogleAutocomplete', 'ngModel'],
        scope: {
          ngdatamodel: '=ngModel',
          vsGoogleAutocomplete: '=',
          vsPlace: '=?',
          vsPlaceId: '=?',
          vsStreetNumber: '=?',
          vsStreet: '=?',
          vsCity: '=?',
          vsState: '=?',
          vsCountryShort: '=?',
          vsCountry: '=?',
          vsPostCode: '=?',
          vsLatitude: '=?',
          vsLongitude: '=?',
          vsDistrict: '=?',
          onSelect: '=',
          isSearching: '=',
          datavalue: '=',
          getCity: '=',
          isGutachtersuche: '='
        },
        controller: ['$scope', '$attrs', function($scope, $attrs) {
          this.isolatedScope = $scope;
          
          /**
          * Updates address components associated with scope model.
          * @param {google.maps.places.PlaceResult} place PlaceResult object
          */
          this.updatePlaceComponents = function(place) {
            $scope.vsPlaceId      = !!$attrs.vsPlaceId  && place     ? vsGooglePlaceUtility.getPlaceId(place)      : undefined;
            $scope.vsStreetNumber = !!$attrs.vsStreetNumber && place ? vsGooglePlaceUtility.getStreetNumber(place) : undefined;
            $scope.vsStreet       = !!$attrs.vsStreet && place       ? vsGooglePlaceUtility.getStreet(place)       : undefined;
            $scope.vsCity         = !!$attrs.vsCity && place         ? vsGooglePlaceUtility.getCity(place)         : undefined;
            $scope.vsPostCode     = !!$attrs.vsPostCode && place     ? vsGooglePlaceUtility.getPostCode(place)     : undefined;
            $scope.vsState        = !!$attrs.vsState && place        ? vsGooglePlaceUtility.getState(place)        : undefined;
            $scope.vsCountryShort = !!$attrs.vsCountryShort && place ? vsGooglePlaceUtility.getCountryShort(place) : undefined;
            $scope.vsCountry      = !!$attrs.vsCountry && place      ? vsGooglePlaceUtility.getCountry(place)      : undefined;
            $scope.vsLatitude     = !!$attrs.vsLatitude && place     ? vsGooglePlaceUtility.getLatitude(place)     : undefined;
            $scope.vsLongitude    = !!$attrs.vsLongitude && place    ? vsGooglePlaceUtility.getLongitude(place)    : undefined;
            $scope.vsDistrict     = !!$attrs.vsDistrict && place     ? vsGooglePlaceUtility.getDistrict(place)     : undefined;
          };
        }],
        link: function(scope, element, attrs, ctrls) {
          // controllers
          var autocompleteCtrl = ctrls[0],
          modelCtrl = ctrls[1]
          scope.ngdatamodel = scope.ngdatamodel;
          scope.datavalue = scope.datavalue;
          
          var isKeyDownOrUp = false;
          // google.maps.places.Autocomplete instance (support google.maps.places.AutocompleteOptions)
          var autocompleteOptions = scope.vsGoogleAutocomplete || {},
          autocomplete = new google.maps.places.Autocomplete(element[0], autocompleteOptions);
          var autocompleteLsr, autocompleteLsr2;
          var place;
          
          // value for updating view
          var viewValue;
          scope.isEntering = false;
          var isGettingCity = false;
          var lastSearch = "";

          scope.$on('$destroy', function() {
            // cleanup();
          });

          function cleanup() {
            google.maps.event.removeListener(autocompleteLsr);
            google.maps.event.removeListener(autocompleteLsr2);
            google.maps.event.clearInstanceListeners(autocomplete);
            $(".pac-container").remove();
          }

          var getCity = function (val=undefined) {
              console.log(val);
              if(!val)
                  val = scope.datavalue;

              return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
                  //return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + val + '&language=de&components=country:DE')
                  params: {
                      language: 'de',
                      address: val,
                      key: 'AIzaSyCGddpVu_R1w4VUqGLBcOpnh_vrm4oD8cs',
                      componentRestrictions: { country: 'DE' },
                      components: 'country:DE',
                      types: ['(cities)'],
                      sensor: false
                  }
              }).then(function (response) {
                      var tmpResult = response.data.results;
                      var x =  response.data.results.map(function (item) {
                          return item.formatted_address;
                      })
                      scope.datavalue = x;
                      scope.onSelect(x);
                      return x;
                  });
          };

          autocompleteLsr = google.maps.event.addListener(autocomplete, 'place_changed', function() {
            $('.pac-item').remove();


            if(scope.isSearching == true) {
              scope.isSearching = false;
              return;
            }

            place = autocomplete.getPlace();
            if(!scope.isGutachtersuche) {
              scope.$apply(function () {
                if(!vsGooglePlaceUtility.getCity(place) && !scope.isEntering)
                  return scope.isEntering = false;
                viewValue = ""; //vsGooglePlaceUtility.getStreet(place) + " ";
                if(vsGooglePlaceUtility.getStreet(place))
                  viewValue += vsGooglePlaceUtility.getStreet(place);
                if(vsGooglePlaceUtility.getStreetNumber(place))
                  viewValue += " " + vsGooglePlaceUtility.getStreetNumber(place);
                scope.datavalue = viewValue;
                scope.onSelect(place, true);
                scope.ngdatamodel = viewValue;

                modelCtrl.$setViewValue(scope.datavalue);
                modelCtrl.$render();  

              });
            }
            else {
              viewValue = place.formatted_address || modelCtrl.$viewValue;
              scope.$apply(function() {
                scope.vsPlace = place;
                autocompleteCtrl.updatePlaceComponents(place);
                scope.datavalue = viewValue;

                if (scope.onSelect) {
                  if(typeof vsGooglePlaceUtility.getLatitude(place) === "undefined") {
                    isKeyDownOrUp = false;
                    scope.isEntering = false;
                    return;
                  }
                  scope.onSelect("lat=" + vsGooglePlaceUtility.getLatitude(place).toFixed(6) + "&lng=" + vsGooglePlaceUtility.getLongitude(place).toFixed(6), place.formatted_address);
                  modelCtrl.$setViewValue(viewValue);
                  modelCtrl.$render();              
                }
              });
            }

            isKeyDownOrUp = false;
            scope.isEntering = false;

          });
          
          autocompleteLsr2 = google.maps.event.addDomListener(element[0], 'keydown', function(event) {

            if (event.keyCode == 40 ||event.keyCode == 38)
              isKeyDownOrUp = true;

            if (event.keyCode == 13 || event.keyCode == 9) {              
              event.preventDefault();
              event.stopImmediatePropagation();

              scope.isEntering = true;
              setTimeout( () => scope.isEntering = false, 333);

              if(!isKeyDownOrUp) {
                viewValue = modelCtrl.$viewValue;
                if(scope.getCity && scope.isGutachtersuche) {
                  scope.getCity(modelCtrl.$viewValue);
                }
                $(event.target).blur();
                return;
              }
              else {
                if(!scope.isGutachtersuche) {
                  return $(event.target).blur();
                }
                $(event.target).blur();
              }
            }
          });
        } 
      };
    }]);
})(window, document);
