var sliceValues = [];

angular.module('piechartDynamicHarness', ['piechart'])
   
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
   
   .factory('Slice', function() {
      return function Slice(val) {
         this.value = val;
      };
   }) 
   
   .controller('TestHarnessCtrl', function ($scope, wrapMethod, Slice) {
      $scope.slices = [];
      
      wrapMethod(sliceValues, 'push', function(original, value) {
         original(value);
         $scope.slices.push(new Slice(value));
         $scope.$digest();
      });
   });