angular.module('piechart', [])

  .constant('piechartConfig', {
    radius: 10
  })

  .constant('loadedAt', Date.now())

  .controller('PiechartController', ['$scope', '$attrs', 'piechartConfig', 'loadedAt', function($scope, $attrs, piechartConfig, loadedAt) {
    var slices;
    var keyframes = [];
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
    
    for (var degrees = 1; degrees <= 360; degrees++) {
      keyframes.push(getArc(degrees - 1, degrees));
    }

    $scope.slices = slices = [];

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
      var animateAfter = (Date.now() - loadedAt) / 1000;

      $scope.radius = angular.isDefined($attrs.radius) ? $scope.$eval($attrs.radius) : piechartConfig.radius;

      angular.forEach(slices, function(slice) {
        totalValue += slice.value;
      });

      angular.forEach(slices, function(slice, index) {
        var startAngle = prevStartAngle;
        var endAngle = (startAngle + (360 / (totalValue / slice.value))) % 360;
        
        slice.arc = getArc(startAngle, endAngle);
        slice.arc.large = slice.value > (totalValue / 2);
        
        slice.animation = {
          keyframes: keyframes.slice(startAngle + 1, endAngle ? endAngle : 360),
          animateAfter: animateAfter + (index * 0.5)
        };

        prevStartAngle = endAngle;
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
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watchCollection('slices', function(prevSlices, newSlices) {
          ctrl.setArcs();
        });
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
        value: '='
      },
      link: function(scope, element, attrs, ctrl) {
        ctrl.addSlice(scope);

        scope.$watch('value', function(prevVal, newVal) {
          if (newVal != prevVal) {
            ctrl.setArcs();
          }
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
      
