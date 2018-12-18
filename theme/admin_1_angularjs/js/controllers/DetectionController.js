(function() {
	'use strict';

	angular
		.module('MetronicApp')
		.controller('DetectionController', DetectionController);

        DetectionController.$inject = ['$rootScope', '$scope', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

	/* @ngInject */
	function DetectionController($rootScope, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder) {
		// console.log("DetectionController Loaded");
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