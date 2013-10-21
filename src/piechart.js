angular.module('piechart', [])

   .controller('PiechartController', ['$scope', function($scope) {
      this.slices = [];

      this.scope = $scope;

      this.addSlice = function(sliceScope) {
         this.slices.push(sliceScope);
      };
   }]);
