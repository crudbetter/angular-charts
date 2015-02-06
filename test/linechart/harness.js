var seriesValues = [];

angular.module('linechartHarness', ['linechart'])
   
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
      $scope.series = [];
      
      wrapMethod(seriesValues, 'push', function(original, values) {
         original(values);
         $scope.series.push({ values: values });
         $scope.$digest();
      });
   });