(function($) {

angular.module('ui.bootstrap.contextMenu', [])

.service('CustomService', function () {
    "use strict";

    return {
        initialize: function (item) {
            console.log("got here", item);
        }
    };

})
.constant('ContextMenuEvents', {
  // Triggers when all the context menus have been closed
  ContextMenuAllClosed: 'context-menu-all-closed',
  // Triggers when any single conext menu is called.
  // Closing all context menus triggers this for each level open
  ContextMenuClosed: 'context-menu-closed',
  // Triggers right before the very first context menu is opened
  ContextMenuOpening: 'context-menu-opening',
  // Triggers right after any context menu is opened
  ContextMenuOpened: 'context-menu-opened'
})
.directive('contextMenu', ['$rootScope', 'ContextMenuEvents', "$parse", "$q", "CustomService", "$sce",
function ($rootScope, ContextMenuEvents, $parse, $q, custom, $sce) {

    var _contextMenus = [];
    // Contains the element that was clicked to show the context menu
    var _clickedElement = null;
    var DEFAULT_ITEM_TEXT = "New Item";

    function createAndAddOptionText(params) {
        // Destructuring:
        var $scope = params.$scope;
        var item = params.item;
        var event = params.event;
        var modelValue = params.modelValue;
        var $promises = params.$promises;
        var nestedMenu = params.nestedMenu;
        var $li = params.$li;
        var leftOriented = String(params.orientation).toLowerCase() === 'left';

        var optionText = null;

        if (item.html) {
          if (angular.isFunction(item.html)) {
            // runs the function that expects a jQuery/jqLite element
            optionText = item.html($scope);
          } else {
            // Assumes that the developer already placed a valid jQuery/jqLite element
            optionText = item.html;
          }
        } else {

          var $a = $('<a>');
          var $anchorStyle = {};

          if (leftOriented) {
              $anchorStyle.textAlign = 'right';
              $anchorStyle.paddingLeft = "8px";
            } else {
              $anchorStyle.textAlign = 'left';
              $anchorStyle.paddingRight = "8px";
            }

          $a.css($anchorStyle);
          $a.addClass('dropdown-item');
          $a.attr({ tabindex: '-1', href: '#' });

          var textParam = item[0] || item.text;
          var text = DEFAULT_ITEM_TEXT;

          if (typeof textParam === 'string') {
              text = textParam;
          } else if (typeof textParam === "function") {
              text = textParam.call($scope, $scope, event, modelValue);
          }

          var $promise = $q.when(text);
          $promises.push($promise);
          $promise.then(function (pText) {
              if (nestedMenu) {
                  var $arrow;
                  var $boldStyle = {
                      fontFamily: 'monospace',
                      fontWeight: 'bold'
                  };

                  if (leftOriented) {
                      $arrow = '&lt;';
                      $boldStyle.float = 'left';
                  } else {
                      $arrow = '&gt;';
                      $boldStyle.float = 'right';
                  }

                  var $bold = $('<strong style="font-family:monospace;font-weight:bold;float:right;">' + $arrow + '</strong>');
                  $bold.css($boldStyle);
                  $a.css("cursor", "default");
                  $a.append($bold);
              }
              $a.append(pText);
          });

          optionText = $a;
        }

        $li.append(optionText);
    }

    /**
     * Process each individual item
     *
     * Properties of params:
     * - $scope
     * - event
     * - modelValue
     * - level
     * - item
     * - $ul
     * - $li
     * - $promises
     */
    function processItem(params) {
        var nestedMenu = extractNestedMenu(params);

        // if html property is not defined, fallback to text, otherwise use default text
        // if first item in the item array is a function then invoke .call()
        // if first item is a string, then text should be the string.

        var text = DEFAULT_ITEM_TEXT;
        var currItemParam = angular.extend({}, params);
        currItemParam.nestedMenu = nestedMenu;
        currItemParam.enabled = isOptionEnabled(currItemParam);
        currItemParam.text = createAndAddOptionText(currItemParam);

        registerCurrentItemEvents(currItemParam);

    }

    /*
     * Registers the appropriate mouse events for options if the item is enabled.
     * Otherwise, it ensures that clicks to the item do not propagate.
     */
    function registerCurrentItemEvents (params) {
        // Destructuring:
        var item = params.item;
        var $ul = params.$ul;
        var $li = params.$li;
        var $scope = params.$scope;
        var modelValue = params.modelValue;
        var level = params.level;
        var event = params.event;
        var text = params.text;
        var nestedMenu = params.nestedMenu;
        var enabled = params.enabled;
        var orientation = String(params.orientation).toLowerCase();

        if (enabled) {
            var openNestedMenu = function ($event) {
                removeContextMenus(level + 1);
                /*
                 * The object here needs to be constructed and filled with data
                 * on an "as needed" basis. Copying the data from event directly
                 * or cloning the event results in unpredictable behavior.
                 */
                /// adding the original event in the object to use the attributes of the mouse over event in the promises
                var ev = {
                    pageX: orientation === 'left' ? event.pageX - $ul[0].offsetWidth + 1 : event.pageX + $ul[0].offsetWidth - 1,
                    pageY: $ul[0].offsetTop + $li[0].offsetTop - 3,
                    view: event.view || window,
                    target: event.target,
                    event: $event
                };

                /*
                 * At this point, nestedMenu can only either be an Array or a promise.
                 * Regardless, passing them to `when` makes the implementation singular.
                 */
                $q.when(nestedMenu).then(function(promisedNestedMenu) {
                    if (angular.isFunction(promisedNestedMenu)) {
                        //  support for dynamic subitems
                        promisedNestedMenu = promisedNestedMenu.call($scope, $scope, event, modelValue, text, $li);
                    }
                    var nestedParam = {
                      "$scope" : $scope,
                      "event" : ev,
                      "options" : promisedNestedMenu,
                      "modelValue" : modelValue,
                      "level" : level + 1,
                      "orientation": orientation
                    };
                    renderContextMenu(nestedParam);
                });
            };

            $ul.on('mouseleave', function ($event) {
                if (level > 0) {
                    removeContextMenus(level);
                }
            });

            $li.on('click', function ($event) {
                if($event.which == 1) {
                  $event.preventDefault();
                  $scope.$apply(function () {

                    var cleanupFunction = function () {
                      $(event.currentTarget).removeClass('context');
                      removeAllContextMenus();
                    };
                    var clickFunction = angular.isFunction(item.click) ? item.click
                      : (angular.isFunction(item[1]) ? item[1]
                          : null);

                    if (clickFunction) {
                      var res = clickFunction.call($scope, $scope, event, modelValue, text, $li);
                      if(res === undefined || res) {
                        cleanupFunction();
                      }
                    } else {
                      cleanupFunction();
                    }
                  });
                }
            });

            $li.on('mouseover', function ($event) {
                $scope.$apply(function () {
                    if (nestedMenu) {
                        openNestedMenu($event);
                    } else {
                        removeContextMenus(level + 1);
                    }
                });
            });
        } else {
            $li.on('click', function ($event) {
                $event.preventDefault();
            });
            $li.addClass('disabled');
        }
    }

    /**
     * @param params - an object containing the `item` parameter
     * @returns an Array or a Promise containing the children,
     *          or null if the option has no submenu
     */
    function extractNestedMenu(params) {
      // Destructuring:
      var item = params.item;

      // New implementation:
      if (item.children) {
        if (angular.isFunction(item.children)) {
          // Expects a function that returns a Promise or an Array
          return item.children();
        } else if (angular.isFunction(item.children.then) || angular.isArray(item.children)) {
          // Returns the promise
          // OR, returns the actual array
          return item.children;
        }

        return null;

      } else {
        // nestedMenu is either an Array or a Promise that will return that array.
        // NOTE: This might be changed soon as it's a hangover from an old implementation

        return angular.isArray(item[1]) ||
            (item[1] && angular.isFunction(item[1].then)) ? item[1] : angular.isArray(item[2]) ||
            (item[2] && angular.isFunction(item[2].then)) ? item[2] : angular.isArray(item[3]) ||
            (item[3] && angular.isFunction(item[3].then)) ? item[3] : null;
      }
    }

    /**
     * Responsible for the actual rendering of the context menu.
     *
     * The parameters in params are:
     * - $scope = the scope of this context menu
     * - event = the event that triggered this context menu
     * - options = the options for this context menu
     * - modelValue = the value of the model attached to this context menu
     * - level = the current context menu level (defauts to 0)
     * - customClass = the custom class to be used for the context menu
     */
    function renderContextMenu (params) {
        /// <summary>Render context menu recursively.</summary>

        // Destructuring:
        var $scope = params.$scope;
        var event = params.event;
        var options = params.options;
        var modelValue = params.modelValue;
        var level = params.level;
        var customClass = params.customClass;

        // Initialize the container. This will be passed around
        var $ul = initContextMenuContainer(params);
        params.$ul = $ul;

        // Register this level of the context menu
        _contextMenus.push($ul);

        /*
         * This object will contain any promises that we have
         * to wait for before trying to adjust the context menu.
         */
        var $promises = [];
        params.$promises = $promises;

        angular.forEach(options, function (item) {
            var $li = $('<li>');
            if (item === null) {
                $li.addClass('divider');
            } else if (typeof item[0] === "object") {
                custom.initialize($li, item);
            } else {
                var itemParams = angular.extend({}, params);
                itemParams.item = item;
                itemParams.$li = $li;

                // If displayed is anything other than a function or a boolean
                var displayed = true;
                if (angular.isFunction(item.displayed)) {
                  // if displayed is a function
                  displayed = item.displayed();
                } else if (item.displayed === true || item.displayed === false) {
                  // If displayed is a boolean
                  displayed = item.displayed;
                }

                if (displayed) { processItem(itemParams); }
            }
            $ul.append($li);
        });

        $(document).find('body').append($ul);

        doAfterAllPromises(params);

        $rootScope.$broadcast(ContextMenuEvents.ContextMenuOpened, {
          context: _clickedElement,
          contextMenu: $ul,
          params: params
        });
    }

    /**
     * calculate if drop down menu would go out of screen at left or bottom
     * calculation need to be done after element has been added (and all texts are set; thus the promises)
     * to the DOM the get the actual height
     */
    function doAfterAllPromises (params) {

        // Desctructuring:
        var $ul = params.$ul;
        var $promises = params.$promises;
        var level = params.level;
        var event = params.event;
        var leftOriented = String(params.orientation).toLowerCase() === 'left';

        $q.all($promises).then(function () {
            var topCoordinate  = event.pageY;
            var menuHeight = angular.element($ul[0]).prop('offsetHeight');
            var winHeight = window.scrollY + event.view.innerHeight;
            /// the 20 pixels in second condition are considering the browser status bar that sometimes overrides the element
            if (topCoordinate > menuHeight && winHeight - topCoordinate < menuHeight + 20) {
                topCoordinate = event.pageY - menuHeight;
                /// If the element is a nested menu, adds the height of the parent li to the topCoordinate to align with the parent
                if(level && level > 0) {
                  topCoordinate += event.event.currentTarget.offsetHeight;
                }
            } else if(winHeight <= menuHeight) {
                // If it really can't fit, reset the height of the menu to one that will fit
                angular.element($ul[0]).css({"height": winHeight - 5, "overflow-y": "scroll"});
                // ...then set the topCoordinate height to 0 so the menu starts from the top
                topCoordinate = 0;
            } else if(winHeight - topCoordinate < menuHeight) {
                var reduceThresholdY = 5;
                if(topCoordinate < reduceThresholdY) {
                    reduceThresholdY = topCoordinate;
                }
                topCoordinate = winHeight - menuHeight - reduceThresholdY;
            }

            var leftCoordinate = event.pageX;
            var menuWidth = angular.element($ul[0]).prop('offsetWidth');
            var winWidth = event.view.innerWidth;
            var padding = 5;
            var reduceThresholdX = 5;

            if (leftOriented) {
                if (winWidth - leftCoordinate > menuWidth && leftCoordinate < menuWidth + padding) {
                    leftCoordinate = padding;
                } else if (leftCoordinate < menuWidth) {
                    if (winWidth - leftCoordinate < reduceThresholdX + padding) {
                        reduceThresholdX = winWidth - leftCoordinate + padding;
                    }
                    leftCoordinate = menuWidth + reduceThresholdX + padding;
                } else {
                    leftCoordinate = leftCoordinate - menuWidth;
                }
            } else {
                if (leftCoordinate > menuWidth && winWidth - leftCoordinate - padding < menuWidth) {
                    leftCoordinate = winWidth - menuWidth - padding;
                } else if(winWidth - leftCoordinate < menuWidth) {
                    if(leftCoordinate < reduceThresholdX + padding) {
                        reduceThresholdX = leftCoordinate + padding;
                    }
                    leftCoordinate = winWidth - menuWidth - reduceThresholdX - padding;
                }
            }

            $ul.css({
                display: 'block',
                position: 'absolute',
                left: leftCoordinate + 'px',
                top: topCoordinate + 'px'
            });
        });

    }

    /**
     * Creates the container of the context menu (a <ul> element),
     * applies the appropriate styles and then returns that container
     *
     * @return a <ul> jqLite/jQuery element
     */
    function initContextMenuContainer(params) {
      // Destructuring
      var customClass = params.customClass;

      var $ul = $('<ul>');
      $ul.addClass('dropdown-menu');
      $ul.attr({ 'role': 'menu' });
      $ul.css({
          display: 'block',
          position: 'absolute',
          left: params.event.pageX + 'px',
          top: params.event.pageY + 'px',
          "z-index": 10000
      });

      if(customClass) { $ul.addClass(customClass); }

      return $ul;
    }

    // if item is object, and has enabled prop invoke the prop
    // else if fallback to item[2]
    function isOptionEnabled (params) {
        var item = params.item;
        var $scope = params.$scope;
        var event = params.event;
        var modelValue = params.modelValue;
        var text = params.text;

        if (typeof item.enabled !== "undefined") {
            return item.enabled.call($scope, $scope, event, modelValue, text);
        } else if (typeof item[2] === "function") {
            return item[2].call($scope, $scope, event, modelValue, text);
        } else {
            return true;
        }
    }

    function isTouchDevice() {
      return 'ontouchstart' in window  || navigator.maxTouchPoints; // works on most browsers | works on IE10/11 and Surface
    }

    /**
     * Removes the context menus with level greater than or equal
     * to the value passed. If undefined, null or 0, all context menus
     * are removed.
     */
    function removeContextMenus (level) {
        while (_contextMenus.length && (!level || _contextMenus.length > level)) {
            var cm = _contextMenus.pop();
            $rootScope.$broadcast(ContextMenuEvents.ContextMenuClosed, { context: _clickedElement, contextMenu: cm });
            cm.remove();
        }
        if(!level) {
          $rootScope.$broadcast(ContextMenuEvents.ContextMenuAllClosed, { context: _clickedElement });
        }
    }

    function removeOnScrollEvent(e) {
        removeAllContextMenus(e);
    }

    function removeOnOutsideClickEvent(e) {

      var $curr = $(e.target);
      var shouldRemove = true;

      while($curr.length) {
        if($curr.hasClass("dropdown-menu")) {
          shouldRemove = false;
          break;
        } else {
          $curr = $curr.parent();
        }
      }
      if (shouldRemove) {
        removeAllContextMenus(e);
      }
    }

    function removeAllContextMenus(e) {
        $(document.body).off('mousedown', removeOnOutsideClickEvent);
        $(document).off('scroll', removeOnScrollEvent);
        $(_clickedElement).removeClass('context');
        removeContextMenus();
        $rootScope.$broadcast('');
    }

    return function ($scope, element, attrs) {
        var openMenuEvent = "contextmenu";
        if(attrs.contextMenuOn && typeof(attrs.contextMenuOn) === "string"){
            openMenuEvent = attrs.contextMenuOn;
        }
        element.on(openMenuEvent, function (event) {
            if(!attrs.allowEventPropagation) {
              event.stopPropagation();
              event.preventDefault();
            }

            // Don't show context menu if on touch device and element is draggable
            if(isTouchDevice() && element.attr('draggable') === 'true') {
              return false;
            }

            // Remove if the user clicks outside
            $(document.body).on('mousedown', removeOnOutsideClickEvent);
            // Remove the menu when the scroll moves
            $(document).on('scroll', removeOnScrollEvent);

            _clickedElement = event.currentTarget;
            $(_clickedElement).addClass('context');

            $scope.$apply(function () {
                var options = $scope.$eval(attrs.contextMenu);
                var customClass = attrs.contextMenuClass;
                var modelValue = $scope.$eval(attrs.model);
                var orientation = attrs.contextMenuOrientation;

                $q.when(options).then(function(promisedMenu) {
                  if (angular.isFunction(promisedMenu)) {
                      //  support for dynamic items
                      promisedMenu = promisedMenu.call($scope, $scope, event, modelValue);
                  }
                  var params = {
                    "$scope" : $scope,
                    "event" : event,
                    "options" : promisedMenu,
                    "modelValue" : modelValue, 
                    "level" : 0,
                    "customClass" : customClass,
                    "orientation": orientation
                  };
                  $rootScope.$broadcast(ContextMenuEvents.ContextMenuOpening, { context: _clickedElement });
                  renderContextMenu(params);
                });
            });

            // Remove all context menus if the scope is destroyed
            $scope.$on("$destroy", function () {
                removeAllContextMenus();
            });
        });
    };
}]);

})(window.angular.element);