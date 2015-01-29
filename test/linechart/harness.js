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
   
   .factory('Series', function() {
      return function Series(vals) {
         this.values = vals;
      };
   }) 
   
   .controller('HarnessCtrl', function ($scope, wrapMethod, Series) {
      $scope.series = [];
      
      wrapMethod(seriesValues, 'push', function(original, values) {
         original(values);
         $scope.series.push(new Series(values));
         $scope.$digest();
      });
   });