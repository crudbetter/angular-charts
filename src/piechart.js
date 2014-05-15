angular.module('piechart', [])

  .constant('piechartConfig', {
    radius: 10
  })

  .controller('PiechartController', ['$scope', '$attrs', 'piechartConfig', function($scope, $attrs, piechartConfig) {
    var slices, radius;
    var getArc = function(startAngle, endAngle) {
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
      var prevStartAngle = 0;
      var totalValue = 0;

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

  .directive('piechart', function() {
    return {
      restrict: 'EA',
      replace: true,
      controller: 'PiechartController',
      template: '<svg ng-transclude></svg>',
      transclude: true,
      scope: {
        radius: '@'
      }
    };
  })

  .directive('piechartSlice', function() {
    return {
      restrict: 'EA',
      require: '^piechart',
      replace: true,
      type: 'svg',
      template:
        '<path ' +
          'ng-attr-d="M0,0L{{arc.start.x}},{{arc.start.y}}A{{radius}},{{radius}},1,{{arc.large ? 1 : 0}},1,{{arc.end.x}},{{arc.end.y}}Z" ' +
          'ng-attr-transform="translate({{radius}},{{radius}})">' +
        '</path>',
      scope: {
        value: '@'
      },
      link: function(scope, element, attrs, ctrl) {
        scope.value = parseInt(scope.value, 10);
        ctrl.addSlice(scope);

        attrs.$observe('value', function(value) {
          scope.value = parseInt(value, 10);
          ctrl.setArcs();
        });
      }
    };
  });
      
