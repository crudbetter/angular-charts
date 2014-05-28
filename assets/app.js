angular.module('angularChartsDemoApp', ['ui.bootstrap', 'piechart', 'linechart']);

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

   slices.push(new Slice(50));
   slices.push(new Slice(200));

   $scope.addSlice = function() {
      slices.push(new Slice(10));
   };
};

function LinechartDemoCtrl($scope) {
   var colours = {
      0: '#428bca',
      1: '#5cb85c',
      2: '#5bc0de',
      3: '#f0ad4e',
      4: '#d9534f'
   };

   var series = $scope.series = [];

   var Series = function(vals) {
      this.values = vals;
      this.colour = colours[series.length];
   };

   $scope.addSeries = function() {
      var len = series.length + 1;
      series.push(new Series([12 * len, 15 * len, 9 * len, 22 * len]));
   };

   $scope.addSeries();
   $scope.addSeries();
};
