angular.module('piechart', [])

   .controller('PiechartController', ['$scope', function($scope) {
      this.slices = [];

      this.scope = $scope;

      this.addSlice = function(sliceScope) {
         this.slices.push(sliceScope);
      };
   }])

   .directive('piechart', function() {
      return {
         restrict: 'EA',
         controller: 'PiechartController',
         template: '<svg ng-transclude></svg>',
         transclude: true,
         replace: true,
         link: function(scope, element, attrs, piechartCtrl) {
         }
      };
   })

   .directive('piechartSlice', function() {
      return {
         restrict: 'EA',
         require: '^piechart',
         template: '<path d=""></path>',
         replace: true,
         link: function(scope, element, attrs, piechartCtrl) {
         }
      };
   });
      
