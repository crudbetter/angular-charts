angular.module('piechart', [])

  .constant('piechartConfig', {
    radius: 10
  })

  .controller('PiechartController', ['$scope', '$attrs', 'piechartConfig', function($scope, $attrs, piechartConfig) {
    var slices;
    var getArc = function(startAngle, endAngle) {
      function convertToRadians(angle) {
        return angle * (Math.PI / 180);
      };

      function getPointOnCircle(angle) {
        return {
          x: Math.cos(angle),
          y: Math.sin(angle)
        };
      };

      var midAngle = startAngle + (((endAngle || 360) - startAngle) / 2);

      return {
        start: getPointOnCircle(convertToRadians(startAngle)),
        mid: getPointOnCircle(convertToRadians(midAngle)),
        end: getPointOnCircle(convertToRadians(endAngle))
      };
    };

    this.slices = slices = [];

    this.addSlice = function(sliceScope) {
      var that = this;

      slices.push(sliceScope);
      sliceScope.$on('$destroy', function() {
        that.removeSlice(sliceScope);
      })

    };

    this.removeSlice = function(sliceScope) {
      slices.splice(slices.indexOf(sliceScope), 1);
      this.setArcs();
    };

    this.setArcs = function() {
      var prevStartAngle = 0;
      var totalValue = 0;

      $scope.radius = angular.isDefined($attrs.radius) ? $scope.$eval($attrs.radius) : piechartConfig.radius;

      angular.forEach(slices, function(slice) {
        totalValue += slice.value;
      });

      angular.forEach(slices, function(slice) {
        slice.arc = getArc(
          prevStartAngle,
          prevStartAngle = (prevStartAngle + (360 / (totalValue / slice.value))) % 360
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
      templateUrl: 'template/piechart.html',
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
      templateNamespace: 'svg',
      templateUrl: 'template/piechart-slice.html',
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

        element.on('mouseenter', function() {
          element.addClass('mouseover'); 
          element.css('-webkit-transform', 'translate(' + (2.5 * scope.arc.mid.x) + '%, ' + (2.5 * scope.arc.mid.y) + '%)');
        });

        element.on('mouseleave', function() {
          element.removeClass('mouseover');
          element.css('-webkit-transform', 'translate(0%, 0%)');
        });
      }
    };
  });
      
