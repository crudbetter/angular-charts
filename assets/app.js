angular.module('angularPiechartDemoApp', ['piechart']);

function PiechartDemoCtrl($scope) {
   var colours = {
      0: '#428bca',
      1: '#5cb85c',
      2: '#5bc0de',
      3: '#f0ad4e',
      4: '#d9534f'
   };

   var slices = $scope.slices = [];

   var Slice = function(val) {
      this.value = val;
      this.colour = colours[slices.length];
   };

   $scope.slices.push(new Slice(50));
   $scope.slices.push(new Slice(200));

   $scope.addSlice = function() {
      $scope.slices.push(new Slice(10));
   };
};
