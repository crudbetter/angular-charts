angular.module('piechart', [])

   .controller('PiechartController', ['$scope', function($scope) {
      var slices,
          totalValue = 0,
          getArc = function(radius, startAngle, endAngle) {
             function convertToRadians(angle) {
                return angle * (Math.PI / 180);
             };
            
             function getPointOnCircle(angle) {
                return {
                   x: Math.round(radius * Math.cos(angle)),
                   y: Math.round(radius * Math.sin(angle))
                };
             };

             return {
                start: getPointOnCircle(convertToRadians(startAngle)),
                end: getPointOnCircle(convertToRadians(endAngle))
             };
          };

      this.slices = slices = [];

      this.scope = $scope;

      this.addSlice = function(sliceScope) {
         totalValue += sliceScope.value;
         slices.push(sliceScope);
      };

      this.removeSlice = function(sliceScope) {
         totalValue -= sliceScope.value;
         slices.splice(slices.indexOf(sliceScope), 1);
      };

      this.setArcs = function(radius) {
         var prevStartAngle = 0;

         angular.forEach(slices, function(slice) {
            slice.radius = radius; //TODO: tidy up scope inheritence for radius
            slice.arc = getArc(
               radius,
               prevStartAngle,
               prevStartAngle = prevStartAngle + (360 / (totalValue / slice.value))
            );
         });
      };
   }])

   .directive('piechart', function() {
      return {
         restrict: 'EA',
         controller: 'PiechartController',
         template: '<svg ng-transclude></svg>',
         transclude: true,
         replace: true,
         scope: {
            radius: '='
         },
         link: function(scope, element, attrs, piechartCtrl) {
            scope.$watch(piechartCtrl.slices, function() {
               piechartCtrl.setArcs(scope.radius);
            });
         }
      };
   })

   .directive('piechartSlice', function() {
      return {
         restrict: 'EA',
         require: '^piechart',
         template: 
            '<path ' +
               'd="M{{arc.start.x}},{{arc.start.y}}A{{radius}},{{radius}},0,1,1,{{arc.end.x}},{{arc.end.y}}Z" ' +
               'transform="rotate(90,0,0)">' + 
            '</path>',
         replace: true,
         scope: {
            value: '='
         },
         link: function(scope, element, attrs, piechartCtrl) {
            piechartCtrl.addSlice(scope);
         }
      };
   });
      
