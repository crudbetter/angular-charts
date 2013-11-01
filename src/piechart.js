angular.module('piechart', [])

   .constant('piechartConfig', {
      radius: 10
   })

   .controller('PiechartController', ['$scope', '$attrs', 'piechartConfig', function($scope, $attrs, piechartConfig) {
      var slices,
          radius,
          getArc = function(startAngle, endAngle) {
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

      this.attrs = $attrs;

      this.addSlice = function(sliceScope) {
         slices.push(sliceScope);
      };

      this.removeSlice = function(sliceScope) {
         slices.splice(slices.indexOf(sliceScope), 1);
      };

      this.setArcs = function() {
         var prevStartAngle = 0,
             totalValue = 0;

         radius = angular.isDefined($attrs.radius) ? $scope.$eval($attrs.radius) : piechartConfig.radius;

         angular.forEach(slices, function(slice) {
            totalValue += slice.value;
         });

         angular.forEach(slices, function(slice) {
            slice.arc = getArc(
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
         replace: true
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
            value: '@'
         },
         link: function(scope, element, attrs, piechartCtrl) {
            piechartCtrl.addSlice(scope);

            piechartCtrl.attrs.$observe('radius', function(value) {
               scope['radius'] = value;
            });

            attrs.$observe('value', function(value) {
               scope['value'] = parseInt(value, 10);
               piechartCtrl.setArcs();
            });
         }
      };
   });
      
