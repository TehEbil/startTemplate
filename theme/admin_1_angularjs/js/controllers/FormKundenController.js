(function() {
	'use strict';

	var ip = "";
	var id = "";
	var gname="";
	angular
	.module('MetronicApp')
	.controller('FormKundenController', FormKundenController);

	FormKundenController.$inject = ['$rootScope', '$scope', '$state'];

	/* @ngInject */
	function FormKundenController($rootScope, $scope, $state) {
		var vm = this;
		vm.title = 'FormKundenController';
        vm.closeModal = closeModal;
        vm.submitForm = submitForm;
    	$scope.individuelleFelder = [];

    	$scope.tabs = [
	    	'Adresse',
	    	'Ansprechpartner',
	    	'Anschriften',
	    	// 'Objekt',
	    	// 'Konditionen',
	    	// 'Vorgaben',
	    	'Statistik',
	    	'Indiv. Felder',
	    	'Dokumente'
    	];

        vm.tabs = $scope.tabs;

    	$scope.uploads = [null, undefined];


        function closeModal() {
            $scope.$close();
        }

        function submitForm() {
            $scope.$close();
        }


    	$scope.selectedTab = $scope.tabs[0];
    	$scope.setSelectedTab = function(tab) {
			$scope.selectedTab = tab;

    	}

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
    	$rootScope.settings.layout.pageBodySolid = false;
    	$rootScope.settings.layout.pageSidebarClosed = false;
    }

})();



angular.module('MetronicApp').controller('UploadController', ['$scope', 'Upload', function ($scope, Upload) {
    // upload later on form submit or something similar
    /*$scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
  };*/

    // upload on file select or drop
    $scope.upload = function (file) {
    	Upload.upload({
    		url: 'upload/url',
    		data: {file: file, 'username': $scope.username}
    	}).then(function (resp) {
    		console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    	}, function (resp) {
    		console.log('Error status: ' + resp.status);
    	}, function (evt) {
    		var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    		console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    	});
    };
}]);


(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('MyCtrl', MyCtrl);

	MyCtrl.$inject = ['$rootScope', '$scope'];

	/* @ngInject */
	function MyCtrl($rootScope, $scope) {
    // upload later on form submit or something similar
		var vm = this;

	}
})();


(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('AnsprechpartnerController', AnsprechpartnerController);

	AnsprechpartnerController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

	/* @ngInject */
	function AnsprechpartnerController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder) {
	  var vm = this;
	  vm.id = false;


    vm.dtOptions = DTOptionsBuilder.newOptions()
		.withPaginationType('simple_numbers')
		.withOption('processing', true)
  	.withOption('DT_RowId', true)

		//.withOption('order', true)
		//.withOption('orderClasses', false)
		.withOption('bSortClasses', false)
		.withOption('responsive', true)
		.withOption('paging', false)
		.withOption('searching', false)
      /* */
      //.withOption('scrollCollapse', true)
      //.withOption('paging', false)
      /* */

    .withLanguage({
			"decimal":        "",
			"emptyTable":     "Keine Daten vorhanden.",
			"info":           "", //Zeige Einträge _START_ bis _END_ von _TOTAL_
			"infoEmpty":      "", //Zeige 0 bis 0 von 0 Einträgen
			"infoFiltered":   "(Gefiltert von insgesamt _MAX_ Einträgen)",
			"infoPostFix":    "",
			"thousands":      ",",
			"lengthMenu":     "Zeige _MENU_ Einträge",
			"loadingRecords": "Lade...",
			"processing":     "Ausführen...",
			"search":         "",
			"zeroRecords":    "Keine Daten gefunden.",
			"paginate": {
				"first":      "<<",
				"last":       ">>",
				"next":       ">",
				"previous":   "<"
			},
		})

    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1)
    ];


    $scope.menuOptions = [
        // NEW IMPLEMENTATION
        {
            text: 'Neu',
            click: function ($itemScope, $event, modelValue, text, $li) {
                newAP();
            }
        },
        {
            text: 'Bearbeiten',
            click: function ($itemScope, $event, modelValue, text, $li) {
                editAP();
            }
        },
        {
            text: 'Löschen',
            click: function ($itemScope, $event, modelValue, text, $li) {
                deleteData();
            }
        },
        null, // Dividier
        {
            text: 'Zurück',
            click: function ($itemScope, $event, modelValue, text, $li) {
            	return;
            }
        },
    ];


	}
})();


(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('AnschriftController', AnschriftController);

	AnschriftController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

	/* @ngInject */
	function AnschriftController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder) {
		// console.log("AnschriftController Loaded");
		var vm = this;
	
		vm.dtOptions = DTOptionsBuilder.newOptions()
		.withPaginationType('simple_numbers')
		.withOption('processing', true)
		//.withOption('order', true)
		//.withOption('orderClasses', false)
		.withOption('bSortClasses', false)
		.withOption('responsive', true)
		.withOption('paging', false)
		.withOption('searching', false)
      /* */
      //.withOption('scrollCollapse', true)
      //.withOption('paging', false)
      /* */

      .withLanguage(
      {
				"decimal":        "",
				"emptyTable":     "Keine Daten vorhanden.",
				"info":           "",
				"infoEmpty":      "",
				"infoFiltered":   "(Gefiltert von insgesamt _MAX_ Einträgen)",
				"infoPostFix":    "",
				"thousands":      ",",
				"lengthMenu":     "Zeige _MENU_ Einträge",
				"loadingRecords": "Lade...",
				"processing":     "Ausführen...",
				"search":         "",
				"zeroRecords":    "Keine Daten gefunden.",
				"paginate": {
					"first":      "<<",
					"last":       ">>",
					"next":       ">",
					"previous":   "<"
				},
	  })

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1)
    ];


    $scope.menuOptions = [
        // NEW IMPLEMENTATION
        {
            text: 'Neu',
            click: function ($itemScope, $event, modelValue, text, $li) {
                newAnschrift();
            }
        },
        {
            text: 'Bearbeiten',
            click: function ($itemScope, $event, modelValue, text, $li) {
                editAnschrift();
            }
        },
        {
            text: 'Löschen',
            click: function ($itemScope, $event, modelValue, text, $li) {
                deleteData();
            }
        },
        null, // Dividier
        {
            text: 'Zurück',
            click: function ($itemScope, $event, modelValue, text, $li) {
            	return;
            }
        },
    ];
}
})();

(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('ObjektController', ObjektController);

	ObjektController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'KundenHandler', 'StammdatenHandler', 'modalService', 'settings', 'MainDataService', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

	/* @ngInject */
	function ObjektController($rootScope, $scope, $state, $stateParams, $timeout, KundenHandler, StammdatenHandler, modalService, settings, MainDataService, DTOptionsBuilder, DTColumnDefBuilder) {
		// console.log("ObjektController Loaded");
		var vm = this;
		vm.newObjekt = newObjekt;
		vm.editObjekt = editObjekt;
		vm.deleteData = deleteData;
		var tmpFormData = MainDataService.getCopiedData();
		vm.anschriften = tmpFormData.anschriften;
		vm.onMouseClick = onMouseClick;
		vm.clickedElement = false;

		if(vm.selectedLieferscheine)
			vm.currentLieferschein = vm.anschriften.find( o => o.bezeichnung == vm.selectedLieferscheine);

		if(vm.selectedRechnungen)
			vm.currentRechnung = vm.anschriften.find( o => o.bezeichnung == vm.selectedRechnungen);

		vm.dtOptions = DTOptionsBuilder.newOptions()
		.withPaginationType('simple_numbers')
		.withOption('rowCallback', rowCallback)
		.withOption('processing', true)
		//.withOption('order', true)
		//.withOption('orderClasses', false)
		.withOption('bSortClasses', false)
		.withOption('responsive', true)
		.withOption('paging', false)
		.withOption('searching', false)
      /* */
      //.withOption('scrollCollapse', true)
      //.withOption('paging', false)
      /* */

      .withLanguage(
      {
				"decimal":        "",
				"emptyTable":     "Keine Daten vorhanden.",
				"info":           "",
				"infoEmpty":      "",
				"infoFiltered":   "(Gefiltert von insgesamt _MAX_ Einträgen)",
				"infoPostFix":    "",
				"thousands":      ",",
				"lengthMenu":     "Zeige _MENU_ Einträge",
				"loadingRecords": "Lade...",
				"processing":     "Ausführen...",
				"search":         "",
				"zeroRecords":    "Keine Daten gefunden.",
				"paginate": {
					"first":      "<<",
					"last":       ">>",
					"next":       ">",
					"previous":   "<"
				},
	  })

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1)
    ];

    function onMouseClick() {
      angular.element(document).find('.selected').removeClass('selected');
      vm.id = false;
    }

    function rowCallback(nRow, aData, index) {
        // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {

			var parent = $(this).parent();
			if ( parent.hasClass('selected') ) {
				$timeout(function() {
					parent.removeClass('selected');
	   				vm.id = false;
				}, 70);
			}
			else {
				$('tr.selected').removeClass('selected');
				parent.addClass('selected');
	    		vm.id = aData[0];
			}
            $scope.$apply();
        });

        $('td', nRow).unbind('contextmenu');
        $('td', nRow).bind('contextmenu', function() {
        	var parent = $(this).parent();
        	if ( !parent.hasClass('selected') ) {
        		$('tr.selected').removeClass('selected');
        		parent.addClass('selected');
        		vm.id = vm.anschriften[index].id;
        	}
            $scope.$apply();
        });
        return nRow;
    }

    $scope.menuOptions = [
        // NEW IMPLEMENTATION
        {
            text: 'Neu',
            click: function ($itemScope, $event, modelValue, text, $li) {
                newObjekt();
            }
        },
        {
            text: 'Bearbeiten',
            click: function ($itemScope, $event, modelValue, text, $li) {
                editObjekt();
            }
        },
        {
            text: 'Löschen',
            click: function ($itemScope, $event, modelValue, text, $li) {
                deleteData();
            }
        },
        null, // Dividier
        {
            text: 'Zurück',
            click: function ($itemScope, $event, modelValue, text, $li) {
            	return;
            }
        },
    ];


		function newObjekt() {
			console.log("hi");
			//$scope.$close();
			$scope.$parent.state = false;
			modalService.openMenuModal('views/form_objekt.html', 'FormObjektController', 'animated zoomIn')
			if ( vm.clickedElement && vm.clickedElement.hasClass('selected') ) {
				vm.clickedElement.removeClass('selected');
				vm.clickedElement = false;
   				vm.id = false;
			}
		}

		function editObjekt() {
			if(vm.id)
			{
				modalService.openMenuModal('views/form_objekt.html', 'FormObjektController', 'animated zoomIn', vm.id).finally(() => {
					vm.currentLieferschein = vm.anschriften.find( o => o.bezeichnung == vm.selectedLieferscheine);
					vm.currentRechnung = vm.anschriften.find( o => o.bezeichnung == vm.selectedRechnungen);
					/*vm.selectedLieferscheine = vm.currentLieferschein;
					vm.selectedRechnungen = vm.currentRechnung;*/
					if ( vm.clickedElement && vm.clickedElement.hasClass('selected') ) {
					vm.clickedElement.removeClass('selected');
					vm.clickedElement = false;
					vm.id = false;
				}
				})
				$scope.$parent.state = false;
			}
			else
				alert("Kein Eintrag ausgewählt.")
		}

		function deleteData() {


			$scope.sharedService.showConfirmDialog("sure").then(function () {
				if("selectedHauptAddr" in MainDataService.getCopiedData())
					if(MainDataService.getCopiedData().selectedHauptAddr.id == vm.id)
						delete MainDataService.getCopiedData().selectedHauptAddr;


			vm.anschriften.splice(vm.anschriften.findIndex(x => x.id == vm.id), 1);
			MainDataService.getCopiedData().anschriften = vm.anschriften;
			vm.id = false;
			// $scope.$parent.state = false;
			});


		}

		function setSelectedRechnungen() {
			vm.currentRechnung = vm.anschriften.find( o => o.bezeichnung == vm.selectedRechnungen);
			MainDataService.getCopiedData().selectedRechnungen = vm.selectedRechnungen;
		}

		function setSelectedLieferscheine() {
			vm.currentLieferschein = vm.anschriften.find( o => o.bezeichnung == vm.selectedLieferscheine);
			MainDataService.getCopiedData().selectedLieferscheine = vm.selectedLieferscheine;

		}
}
})();
