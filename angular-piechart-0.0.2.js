angular.module('piechart', [])

   .constant('piechartConfig', {
      radius: 10
   })

   .value('createSVGNode', function(name, element, settings) {
      var namespace = 'http://www.w3.org/2000/svg';
      var node = document.createElementNS(namespace, name);
      for (var attribute in settings) {
         var value = settings[attribute];
         if (value !== null && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
            node.setAttribute(attribute, value);
         }
      }
      return node;
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
            slice.radius = radius;
            slice.arc = getArc(
               prevStartAngle,
               prevStartAngle = prevStartAngle + (360 / (totalValue / slice.value))
            );
            slice.arc.large = slice.value > (totalValue / 2);
         });
      };
   }])

   .directive('piechart', ['createSVGNode', function(createSVGNode) {
      return {
         restrict: 'EA',
         controller: 'PiechartController',
         controllerAs: 'ctrl',
         link:  function(scope, element, attrs) {
            var svg = createSVGNode('svg', element, attrs);

            angular.element(svg).append(element[0].childNodes);
            element.replaceWith(svg);
         }
      };
   }])

   .directive('piechartSlice', ['piechartConfig', 'createSVGNode', '$compile', function(piechartConfig, createSVGNode, $compile) {
      return {
         restrict: 'EA',
         require: '?^piechart',
         scope: {
            value: '@'
         },
         link: function(scope, element, attrs, ctrl) {
            var piechartCtrl = ctrl || scope.$parent.ctrl;
            var d = 'M0,0L{{arc.start.x}},{{arc.start.y}}A{{radius}},{{radius}},1,{{arc.large ? 1 : 0}},1,{{arc.end.x}},{{arc.end.y}}Z';
            var transform = 'translate({{radius}},{{radius}})';
            var path = createSVGNode('path', element, attrs);
            
            angular.element(path).attr('ng-attr-d', d);
            angular.element(path).attr('ng-attr-transform', transform);
            element.replaceWith(path);

            piechartCtrl.addSlice(scope);

            attrs.$observe('value', function(value) {
               scope['value'] = parseInt(value, 10);
               piechartCtrl.setArcs();
               $compile(path)(scope);
            });
         }
      };
   }]);
      
