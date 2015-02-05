var sliceValues = [];

angular.module('piechartHarness', ['piechart'])
   
   .factory('wrapMethod', function() {
      return function(object, method, wrapper) {
         var fn = object[method];

         return object[method] = function() {
            return wrapper.apply(this, [fn.bind(this)].concat(
               Array.prototype.slice.call(arguments))
            );
         };
      }
   })
   
   .controller('HarnessCtrl', function ($scope, wrapMethod) {
      $scope.slices = [];
      
      wrapMethod(sliceValues, 'push', function(original, value) {
         original(value);
         $scope.slices.push({ value: value });
         $scope.$digest();
      });
   });