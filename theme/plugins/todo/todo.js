angular.module('MetronicApp')
  .factory('store', [ '$q', 'localStorageService', function ($q, localStorageService) {
    'use strict';

    var STORAGE_ID = 'toDos';

    var store = {
      todos: [],

      _getFromLocalStorage: function () {
        return JSON.parse(localStorageService.get(STORAGE_ID) || '[]');
      },

      _saveToLocalStorage: function (todos) {
        localStorageService.set(STORAGE_ID, JSON.stringify(todos));
      },

      clearCompleted: function () {
        var deferred = $q.defer();

        var incompleteTodos = store.todos.filter(function (todo) {
          return !todo.completed;
        });

        angular.copy(incompleteTodos, store.todos);

        store._saveToLocalStorage(store.todos);
        deferred.resolve(store.todos);

        return deferred.promise;
      },

      delete: function (todo) {
        var deferred = $q.defer();

        store.todos.splice(store.todos.indexOf(todo), 1);

        store._saveToLocalStorage(store.todos);
        deferred.resolve(store.todos);

        return deferred.promise;
      },

      get: function () {
        var deferred = $q.defer();

        angular.copy(store._getFromLocalStorage(), store.todos);
        deferred.resolve(store.todos);

        return deferred.promise;
      },

      insert: function (todo) {
        var deferred = $q.defer();

        store.todos.push(todo);

        store._saveToLocalStorage(store.todos);
        deferred.resolve(store.todos);

        return deferred.promise;
      },

      put: function (todo, index) {
        var deferred = $q.defer();

        store.todos[index] = todo;

        store._saveToLocalStorage(store.todos);
        deferred.resolve(store.todos);

        return deferred.promise;
      }
    };

    store.get();

    return store;
}])

.directive('todoEscape', function () {
    'use strict';

    var ESCAPE_KEY = 27;

    return function (scope, elem, attrs) {
      elem.bind('keydown', function (event) {
        if (event.keyCode === ESCAPE_KEY) {
          scope.$apply(attrs.todoEscape);
        }
      });

      scope.$on('$destroy', function () {
        elem.unbind('keydown');
      });
    };
  })

.directive('todoFocus', ['$timeout', function todoFocus($timeout) {
  'use strict';

  return function (scope, elem, attrs) {
    scope.$watch(attrs.todoFocus, function (newVal) {
      if (newVal) {
        $timeout(function () {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
}]);

  (function() {
      'use strict';
  
      angular
          .module('MetronicApp')
          .component('toDoComponent', {
              bindings: {
  
              },
              controller: toDoController,
              controllerAs: 'vm',
              template: function ($element, $attrs) {
                return `
                <section id="todoapp">
                  <header id="header">
                    <!--h1>todos</h1-->
                    <form id="todo-form" ng-submit="addTodo()">
                      <input id="new-todo" placeholder="Neue Aufgabe" ng-model="newTodo" ng-disabled="saving">
                      <!--a ng-click="addTodo()" class="float-right bxp-rounded-button add small">
                        <i class="fa fa-plus"></i>
                      </a-->
                    </form>
                  </header>
                  <section id="main" ng-show="todos.length" ng-cloak>
                    <input id="toggle-all" type="checkbox" ng-model="allChecked" ng-click="markAll(allChecked)">
                    <label for="toggle-all">Mark all as complete</label>
                    <ul id="todo-list">
                      <li ng-repeat="todo in todos | filter:statusFilter track by $index" ng-class="{completed: todo.completed, editing: todo == editedTodo}">
                        <div class="view">
                          <input class="toggle" type="checkbox" ng-model="todo.completed" ng-change="toggleCompleted(todo)">
                          <label ng-dblclick="editTodo(todo)">{{todo.title}}</label>
                          <button class="destroy" ng-click="removeTodo(todo)"></button>
                        </div>
                        <form ng-submit="saveEdits(todo, 'submit')">
                          <input class="edit" ng-trim="false" ng-model="todo.title" todo-escape="revertEdits(todo)" ng-blur="saveEdits(todo, 'blur')" todo-focus="todo == editedTodo">
                        </form>
                      </li>
                    </ul>
                  </section>
                  <footer id="footer" ng-show="todos.length" ng-cloak>
                    <span id="todo-count"><strong>{{remainingCount}}</strong>
                      <ng-pluralize count="remainingCount" when="{ one: 'Aufgabe ausstehend', other: 'Aufgaben ausstehend' }"></ng-pluralize>
                    </span>
                    <ul id="filters">
                      <li>
                        <a ng-class="{selected: status == ''} " ng-click="onClick('')">Alle</a>
                      </li>
                      <li>
                        <a ng-class="{selected: status == 'active'}" ng-click="onClick('active')">Aktive</a>
                      </li>
                      <li>
                        <a ng-class="{selected: status == 'completed'}" ng-click="onClick('completed')">Erledigte</a>
                      </li>
                    </ul>
                    <button id="clear-completed" ng-click="clearCompletedTodos()" ng-show="completedCount">Lösche erledigte</button>
                  </footer>
                </section>
                  `
              }
  
          });
  
      toDoController.$inject = ['$scope', '$filter', 'store'];
  
      /* @ngInject */
      function toDoController($scope, $filter, store) {
        var vm = this;
        var todos = $scope.todos = store.todos;

            $scope.newTodo = '';
            $scope.editedTodo = null;

            $scope.$watch('todos', function () {
              $scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
              $scope.completedCount = todos.length - $scope.remainingCount;
              $scope.allChecked = !$scope.remainingCount;
            }, true);

            // Monitor the current route for changes and adjust the filter accordingly.
            $scope.onClick = function(state) {
              console.log(state);
              var status = $scope.status = state || '';
              $scope.statusFilter = (status === 'active') ?
                { completed: false } : (status === 'completed') ?
                { completed: true } : {};
            };

            $scope.addTodo = function () {
              var newTodo = {
                title: $scope.newTodo.trim(),
                completed: false
              };

              if (!newTodo.title) {
                return;
              }

              $scope.saving = true;
              store.insert(newTodo)
                .then(function success() {
                  $scope.newTodo = '';
                })
                .finally(function () {
                  $scope.saving = false;
                });
            };

            $scope.editTodo = function (todo) {
              $scope.editedTodo = todo;
              // Clone the original todo to restore it on demand.
              $scope.originalTodo = angular.extend({}, todo);
            };

            $scope.saveEdits = function (todo, event) {
              // Blur events are automatically triggered after the form submit event.
              // This does some unfortunate logic handling to prevent saving twice.
              if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
              }

              $scope.saveEvent = event;

              if ($scope.reverted) {
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
              }

              todo.title = todo.title.trim();

              if (todo.title === $scope.originalTodo.title) {
                $scope.editedTodo = null;
                return;
              }

              store[todo.title ? 'put' : 'delete'](todo)
                .then(function success() {}, function error() {
                  todo.title = $scope.originalTodo.title;
                })
                .finally(function () {
                  $scope.editedTodo = null;
                });
            };

            $scope.revertEdits = function (todo) {
              todos[todos.indexOf(todo)] = $scope.originalTodo;
              $scope.editedTodo = null;
              $scope.originalTodo = null;
              $scope.reverted = true;
            };

            $scope.removeTodo = function (todo) {
              store.delete(todo);
            };

            $scope.saveTodo = function (todo) {
              store.put(todo);
            };

            $scope.toggleCompleted = function (todo, completed) {
              if (angular.isDefined(completed)) {
                todo.completed = completed;
              }
              store.put(todo, todos.indexOf(todo))
                .then(function success() {}, function error() {
                  todo.completed = !todo.completed;
                });
            };

            $scope.clearCompletedTodos = function () {
              store.clearCompleted();
            };

            $scope.markAll = function (completed) {
              todos.forEach(function (todo) {
                if (todo.completed !== completed) {
                  $scope.toggleCompleted(todo, completed);
                }
              });
            };
  
      }
  })();