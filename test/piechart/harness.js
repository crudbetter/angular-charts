var sliceValues = [];

angular.module('piechartHarness', ['piechart'])
   
   .controller('HarnessCtrl', function($scope) {
      $scope.slices = [];

      Array.observe(sliceValues, function(changes) {
         angular.forEach(changes, function(change) {
            switch(change.type) {
               case "splice":
                  var valuesToAdd = change.object.slice(change.index).map(function(value) {
                     return { value: value };
                  });
                  var args = [change.index, change.removed.length].concat(valuesToAdd);
                  Array.prototype.splice.apply($scope.slices, args);
                  break;
               case "update":
                  var index = parseInt(change.name, 10);
                  $scope.slices[index].value = change.object[index];
                  break;
            }
         });

         $scope.$digest();
      });
   });