var debug = 0;
var gIp;
var counter = 0;

    gIp = 'http://127.0.0.1:3006/';
/* IF NOT DEBUG -> PRODUCTION:::::!!!*/

function raw(x) {
    return JSON.parse(JSON.stringify(x));
}

class DataHandler {
    //this.url = "";
    constructor($http, param) {
        this.$http = $http;
        this.url = gIp + param;
    }

    getData (id="") {
        var options = undefined;
        if(typeof id == "string" && id.indexOf("hidelog") >= 0) {
            options = {ignoreLoadingBar: true}
        }
        return this.$http.get(this.url + '/' + id, options);
    }

    postData (data) {
        return this.$http.post(this.url, data);
    }

    updateData (id, data) {
        return this.$http.put(this.url + '/' + id, data);
    }

    deleteData (id="") {
        return this.$http.delete(this.url + '/' + id);
    }

    setColor (id, col) {
        return this.$http.put(this.url + '/' + id + '/setColor/' + col);
    }

    getFilteredData (param) {
        return this.$http.get(this.url + '?' + param);
    }

    // getMaxId() {
    //     return this.$http.get(this.url + '/maxID');
    // }

    getNextKundennummer() {
        return this.$http.get(this.url + '/nextNumber');
    }

    deleteFile(id) {
        return this.$http.get(this.url + '/deleteFile/' + id);
    }

}

class KontakteHandler extends DataHandler {
    constructor($http) {
        super($http, 'kontakte');
    }
}

KontakteHandler.$inject = ['$http'];

angular.uppercase=function(text){
 return text.toUpperCase();
 }
 angular.lowercase=function(text){
    if(text)
        return text.toLowerCase();
    return text;
 }

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    'ngCookies',
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngAnimate",
    "LocalStorageModule",
    "ui.grid",
    "ui.grid.selection",
    "ui.grid.exporter",
    "ui.grid.expandable",
    'ui.grid.moveColumns',
    'ui.grid.multiselect.filter',
    'ui.grid.resizeColumns',
    'ui.grid.pinning',
    'ui.grid.autoResize',
    'ui.grid.saveState',
    'angularMoment',
    "ngSanitize",
    "mk.editablespan",
    "angularInlineEdit",
    "datatables",
    "ui.bootstrap.contextMenu",
    "uiCropper",
    "ngFileUpload",
    "ui.toggle",
    'angular.filter',
    "ngFlash",
    "angular-loading-bar",
    "cfp.loadingBar"
])
.config(['$compileProvider', function($compileProvider){
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
    // $compileProvider.debugInfoEnabled(false); // Only PRODUCTION
}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  // cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
}])

.factory('KontakteHandler', KontakteHandler)

    /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */

MetronicApp.config(['$ocLazyLoadProvider', '$httpProvider', function($ocLazyLoadProvider, $httpProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
        // debug: true
    });
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.useApplyAsync(true);
}])

MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // $controllerProvider.allowGlobals();
}]);

MetronicApp.config(['FlashProvider', function(FlashProvider) {
    FlashProvider.setTimeout(0);
    FlashProvider.setShowClose(false);
    FlashProvider.setAutoDismiss(true);
    // FlashProvider.setOnDismiss(myCallback);
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 0 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;
    $rootScope.ip = gIp;

    return settings;
}])

.factory('AuthInterceptor', ['$q', '$location', '$rootScope', 'localStorageService', function($q, $location, $rootScope, localStorageService){
    var interceptorFactory = {};

    //attach the token to all HTTP requests
    //attach the token to all HTTP requests - except weather API
    interceptorFactory.request = function (config) {
        if(!config.ignoreLoadingBar && config.method != "GET")
            $rootScope.isSubmitting = true;

        var isWeatherAPI = config.url.indexOf('maps.googleapis.com') > -1;
        // var isWeatherAPI2 = config.url.indexOf('127.0.0.1:3006/login') > -1;
        // var isWeatherAPI2 = config.url.indexOf('bauexperts.zendesk.com') > -1;

        // don't modify weather api headers
        if (isWeatherAPI) {
          delete config.headers['Authorization'];
          delete config.headers['Version'];
        }

        return config;
    };

    interceptorFactory.requestError = function(rejection){
        // $rootScope.isSubmitting = true;
        return $q.reject(rejection);
    };

    interceptorFactory.response = function (response) {
        if(!response.config.ignoreLoadingBar && response.config.method != "GET")
            $rootScope.isSubmitting = false;
        
        if(response.data.version) {
            localStorageService.set("version", response.data.version);
            location.reload();
            // location.reload(true); // to delete cache
            console.log("reloading");
            return;
        }

        return response;
    };
    //On response errors

    interceptorFactory.responseError = function(response){
        // console.log(response);
        $rootScope.isSubmitting = false;
        // console.log($rootScope.isSubmitting);
      //If server returns a 403 forbidden response
      if(response.status == 510){
        console.log(response);
      }
      if(response.status == 403){
        //console.
        //$location.path('/login');
        // console.error("403 vom Server bekommen?")
      }

      //return the errors from the server as a promise
      return $q.reject(response);
    }

    //return interceptorFactory
    return interceptorFactory;
  }]);//End AuthInterceptor

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
    var vm = this;
    $scope.varx = "";


    $scope.getSiteClass = function() {
        var string = ($state.current.data) ? $state.current.data.pageTitle : '';
        var value = string.toLowerCase();
        value = value.replace(/ä/g, 'ae');
        value = value.replace(/ /g, '-');
        value = value.replace(/ö/g, 'oe');
        value = value.replace(/ü/g, 'ue');
        return 'site-' + value;
    }

    $scope.replaceUmlauts= function() {
        var string =$state.current.data.pageTitle;
        value = string.toLowerCase();
        value = value.replace(/ä/g, 'ae');
        value = value.replace(/ /g, '-');
        value = value.replace(/ö/g, 'oe');
        value = value.replace(/ü/g, 'ue');
        return value;
    }

    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

MetronicApp.factory("sharedService",["$q", "$uibModal", function ($q, $uibModal)
{
    var instance;
    var isOpen = undefined;

    var xxx = {
      instance,
      isOpen,
      showConfirmDialog,
      alert
    }

    function alert(text, warn='success') {
        return showConfirmDialog("alert", "OK", text, warn);
    }

    function showConfirmDialog(choice="changed", param2="OK", param3=undefined, warn=undefined)
    {
        xxx.isOpen = true;

        var defer = $q.defer();

        xxx.instance = $uibModal.open({
            animation: true,
            size: "sm",
            templateUrl: 'tpl/ConfirmationBox.html',
            controllerAs: "FormCtrl",
            controller: function ($scope, $uibModalInstance)
            {
              $scope.choice = choice;
              $scope.param2 = param2;


              /* backdrop click closeModal not working */
              var vm = this;
              vm.closeModal = closeModal;

              function closeModal() {
                  return $scope.$close();
              }

              if (choice == 'alert') {
                  $scope.title = "";
                  $scope.text = param3;
                  $scope.param2 = param2;
                  $scope.svFlag = warn == 'info' ? 'sv-info' : (warn == 'danger' ? 'sv-danger' : 'sv-success');
                  $scope.choice = "otherid";
              }
              else if(choice == 'sure') {
                  $scope.title = "Sure";
                  $scope.text = "Are you sure to close? Data will not be saved.";
                  $scope.param2 = "Yes"
              }
              else if(choice == 'delete') {
                  $scope.title = "Sure";
                  $scope.text = "Are you sure to delete file?";
                  $scope.param2 = "Delete"
              }


                $scope.ok = function (par=undefined)
                {
                    defer.resolve(par);
                    $uibModalInstance.close();
                }

                $scope.cancel = function ()
                {
                    $uibModalInstance.close();
                }
            }
        }).closed.then( function () {
          xxx.isOpen = false;
        });
        //instance = modal

        return defer.promise;
    }

    return xxx;

}]);




MetronicApp.factory('modalService', ['$uibModal', '$rootScope', function($uibModal, $rootScope) {
  var cnt = 0;

  function functionBeforeUnload(e) {
    var confirmationMessage = "\o/";
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;
  }



  return {
    openComponentModal: function(comp, data) {
        return this.openMenuModal(undefined, undefined, undefined, data, comp);
    },

    openMenuModal: function(templateLink="", controller=undefined, windowAnimation=undefined, id=false, comp=undefined) {
        var setClass = (isMobile.any) ? 'bxp-active-modal modal-fullscreen' : 'bxp-active-modal';
        // if(++cnt == 1)
        //     window.addEventListener("beforeunload", functionBeforeUnload);
        console.log(comp);
        var controllerLabel;
        if(comp) {
            templateLink = '/components/' + comp + '/' + comp + '.template.html'
            controllerLabel = comp.charAt(0).toUpperCase() + comp.substr(1) + "Controller"
        }
        else
            controllerLabel = controller;

        return modalObj = $uibModal.open({
            templateUrl: templateLink,
            backdrop: 'true',
            animation: false,
            windowClass: windowAnimation || 'animated zoomIn',
            controller: controllerLabel,
            controllerAs: "FormCtrl",
            bindToController: true,
            size: 'lg inner-modal',
            windowTopClass: setClass,
            keyboard: false,
            resolve:
            {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    var list = [{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/UISelectController.js'
                        ]
                    },
                    {
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }]
                    if(controller)
                        list[0].files.push('js/controllers/' + controller + '.js');

                    else if(comp)
                        list[0].files.push('/components/' + comp + '/' + comp + '.controller.js');
                    console.log("", '/components/' + comp + '/' + comp + '.controller.js');

                    return $ocLazyLoad.load(list);
                }],

                getId: function () {
                    return id || false;
                }
            }
        }).result.then( (param3 = -1) => {

          // console.log(param3);
          // if(--cnt == 0)
          //   window.removeEventListener("beforeunload", functionBeforeUnload);
          if(param3 != -1)
            return param3;
        }, function(reason) {
           // console.info("I was dimissed, so do what I need to do myContent's controller now.  Reason was->" + reason);
           console.info("dismissed:", reason);
       });
        /*}).result.finally((sib) => {
        });*/
    }
};
}])


MetronicApp.controller('HeaderController', ['$rootScope', '$scope', '$interval', 'modalService', '$http', function($rootScope, $scope, $interval, modalService, $http) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    $rootScope.$on('userLoggedIn', function (params, data) {
        var data = data;
        $scope.data = data;
        $scope.$apply();
    });

    $scope.$on('$includeContentLoaded', function() {
        // console.warn($state);
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            params: {
                emailVerified: {
                    value: "",
                    squash: false
                }
            },
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'Dashboard'},
            controller: "DashboardController as vm",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            'js/controllers/DashboardController.js',
                            'components/statistics/statistics.component.js',
                            'components/newRequests/newRequests.component.js',
                            'components/stammdata/stammdata.component.js',
                        ]
                    });
                }]
            }
        })

        .state('errorpage', {
            url: "/errorpage",
            templateUrl: "views/errorpage.html",
            data: {pageTitle: 'Verweigert.'}
        })
        .state('agb', {
            url: "/agb",
            templateUrl: "views/agb.html",
            data: {pageTitle: 'AGB'}
        })
        .state('datenschutz', {
            url: "/datenschutz",
            templateUrl: "views/datenschutz.html",
            data: {pageTitle: 'Datenschutz'}
        })
        .state('impressum', {
            url: "/impressum",
            templateUrl: "views/impressum.html",
            data: {pageTitle: 'Impressum'}
        })
}]);

/* Init global settings and run the app */

MetronicApp.run(["$rootScope", "$http", "settings", "$state", "sharedService", "Flash", "modalService", "moment", "amMoment", "localStorageService" , function($rootScope, $http, settings, $state, sharedService, Flash, modalService, moment, amMoment, localStorageService) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
        $rootScope.sharedService = sharedService;
        $rootScope.flash = Flash;
        $rootScope.modalService = modalService;
        $rootScope.moment = moment;
        amMoment.changeLocale('de');

        $rootScope.$on('modal.closing', function(event, reason, closed, closeMethod) {
            if($rootscope.sharedService.isOpen == false)
            event.preventDefault();
        });

        $rootScope.goBack = function() {
            if(!$state.previous || !$state.previousParams)
                $state.go($state.previous, $state.previousParams);
            else
                $state.go("waiting");
        }

        $rootScope.download = function(fileResourceUrl, fileName) {
            var url = fileResourceUrl + fileName;

            $http({
                method: 'GET',
                url: url,
                responseType: 'blob'
            }).then(function (response) {
                var blob = response.data;
                startBlobDownload(blob, fileName)
            }, () => $rootScope.sharedService.alert("Datei wurde nicht gefunden.", 'danger'));

        };

        function startBlobDownload(dataBlob, suggestedFileName) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // for IE
                window.navigator.msSaveOrOpenBlob(dataBlob, suggestedFileName);
            } else {
                // for Non-IE (chrome, firefox etc.)
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

        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
            $state.previous = fromState;
            $state.previousParams = fromParams;
        });
}]);

// MetronicApp.run(['$rootScope', 'settings', '$state', '$cookies', '$http', '$location', '$timeout', '$urlRouter', '$interval',
//     function ($rootScope, settings, $state, $cookies, $http, AuthService, $location, $timeout, $urlRouter, $interval) {


//         $rootScope.$on('$locationChangeStart', function ($event, newUrl, oldUrl, newState, oldState) {
//         });

//         $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams)  {
//             if(fromState.name == toState.name && fromParams == toParams) {
//                 return;
//             }
//             if(!AuthService.initted) {
//                 var tmpState = toState;
//                 var tmpToParams = toParams;
//                 // var tmpToParams = toParams;
//                 event.preventDefault();
//                 var x= $interval( () => {
//                     if(AuthService.initted)
//                     {
//                         $interval.cancel(x);
//                         console.log("sending to " + tmpState.name )

//                         return $state.go(tmpState.name, tmpToParams);
//                         //return $urlRouter.sync();
//                     }
//                     }, 250, 5);
//                 return;
//             }

//             if(toState.name == "login" && toParams.emailVerified == "changedEmail") {
//                 event.preventDefault();
//                 App.stopPageLoading();
//                 toParams.emailVerified = "changedEmailConfirmed";
//                 AuthService.clearCredentials(toParams);
//                 return;
//             }

//             // console.log("f:", fromState.name, "t:", toState.name,"authen:",  AuthService.isAuthenticated(), "author:", AuthService.isAuthorized(toState.name))

//             var allowedUnregisteredPages = [
//                 "login",
//                 "signup",
//                 "signedup",
//                 "agb",
//                 "datenschutz",
//                 "impressum",
//                 "kontakt",
//                 "errorpage"
//             ]

//             var allowedUnverifiedPages = [
//                 "blanknp",
//                 "formSV",
//                 "waiting"
//             ]

//             if(AuthService.isAuthenticated() && (toState.name === "login" || toState.name === "signup" || toState.name === "signedup")) {
//                 event.preventDefault();
//                 App.stopPageLoading();
//                 // if(toParams.emailVerified === "auftragAcceptedtrue" || toParams.emailVerified === "auftragAcceptedfalse" || toParams.emailVerified === "auftragAcceptedfehler" || toParams.emailVerified === "auftragAcceptedalreadydone")
//                 $state.go("dashboard", {"emailVerified": toParams.emailVerified})
//                 return;
//             }

//             if(allowedUnregisteredPages.indexOf(toState.name) >= 0){
//                 return;
//             }

//             if (AuthService.isAuthenticated()) {
//                 if(allowedUnverifiedPages.indexOf(toState.name) >= 0){
//                     return;
//                 }

//                 if(AuthService.getData() && AuthService.getData().role.level <= 10 && toState.name == "dashboard") {
//                     event.preventDefault();
//                     App.stopPageLoading();
//                     $state.go("waiting");
//                     return;
//                 }
//                 if(!AuthService.isAuthorized('verified')){
//                     event.preventDefault();
//                     App.stopPageLoading();
//                     $state.go("errorpage");
//                     return;
//                 }
//                 //if(newUrl.indexOf("neu") != -1 || newUrl.indexOf("abgeschlossen") != -1 && newUrl.indexOf("abgeschlossen2") == -1 || newUrl.indexOf("abgerechnet") != -1 || newUrl.indexOf("disponiert") != -1 || (newUrl.indexOf("listSVNotAccept") != -1 && newUrl.indexOf("svAll") == -1) || newUrl.indexOf("stammdata") != -1)) {
//                 if(!AuthService.isAuthorized('employee') && (toParams.key == "neu" || toParams.key == "abgeschlossen" || toParams.key == "abgerechnet" || toParams.key == "disponiert"  || toState.name == "stammdata" || toState.name == "bestellungen" || toState.name == "listSVNotAccept" && toParams.key != "svAll") ) {
//                     event.preventDefault();
//                     App.stopPageLoading();
//                     $state.go("errorpage");
//                     console.error("Fehler, not allowed", toState, toParams);
//                 }
//                 else {
//                     return;
//                 }
//             }
//             else {
//                 event.preventDefault();
//                 App.stopPageLoading();
//                 $state.go('login');
//             }
//         });
//     }
// ])

MetronicApp.run(['$rootScope', '$uibModalStack',
    function ($rootScope,  $uibModalStack) {
        // close the opened modal on location change.
        $rootScope.$on('$locationChangeStart', function ($event) {
            var openedModal = $uibModalStack.getTop();
            if (openedModal) {
                if (!!$event.preventDefault) {
                    $event.preventDefault();
                }
                if (!!$event.stopPropagation) {
                    $event.stopPropagation();
                }
                $uibModalStack.dismiss(openedModal.key);
            }
        });
    }]);