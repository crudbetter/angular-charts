angular.module('piechart', [])

   .controller('PiechartController', ['$scope', function($scope) {
      var slices, 
          totalValue = 0,
          setAngles = function() {
             angular.forEach(slices, function(slice) {
                slice.angle = 360 / (totalValue / slice.value);
             });
          };

      this.slices = slices = [];

      this.scope = $scope;

      this.addSlice = function(sliceScope) {
         totalValue += sliceScope.value;
         slices.push(sliceScope);
         setAngles();
      };

      this.removeSlice = function(sliceScope) {
         totalValue -= sliceScope.value;
         slices.splice(slices.indexOf(sliceScope), 1);
         setAngles();
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
      
