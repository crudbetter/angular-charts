angular.module('charts', ['piechart', 'linechart']);

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
          x: 1 * Math.cos(angle),
          y: 1 * Math.sin(angle)
        };
      };

      return {
        start: getPointOnCircle(convertToRadians(startAngle)),
        end: getPointOnCircle(convertToRadians(endAngle))
      };
    };

    this.slices = slices = [];

    this.addSlice = function(sliceScope) {
      slices.push(sliceScope);
    };

    this.removeSlice = function(sliceScope) {
      slices.splice(slices.indexOf(sliceScope), 1);
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
      template: 
        '<svg ng-attr-height="{{radius * 2 + 10}}" ng-attr-width="{{radius * 2 + 10}}">' +
          '<g ng-attr-transform="translate({{radius}}, {{radius}}), scale({{radius}})"' +
            ' ng-attr-stroke-width="{{1 / radius}}"' +
            ' ng-transclude>' +
          '</g>' +
        '</svg>',
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
        '<path ng-attr-d="M0,0L{{arc.start.x}},{{arc.start.y}}A1,1,1,{{arc.large ? 1 : 0}},1,{{arc.end.x}},{{arc.end.y}}Z" />',
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
      

angular.module('linechart', [])

	.factory('Point', function() {
		function Point(x, y) {
			this.x = x;
			this.y = y;
		};

		Point.prototype.toString = function() {
			return this.x + ',' + this.y;
		};

		return Point;
	})

	.constant('linechartConfig', {
		height: 200,
		width: 300
	})

	.controller('LinechartController', ['$scope', 'Point', function($scope, Point) {
		var series;

		this.series = series = [];

		this.addSeries = function(seriesScope) {
			series.push(seriesScope);
		};

		this.setLines = function() {
			var maxValue = 0;
			var maxValuesLen = 0;

			angular.forEach(series, function(series) {
				if (series.values.length > maxValuesLen) maxValuesLen = series.values.length;
				angular.forEach(series.values, function(value) {
					if (value > maxValue) maxValue = value;
				});
			});

			angular.forEach(series, function(series) {
				series.points = [];
				angular.forEach(series.values, function(value, index) {
					var x = index * ($scope.width / (maxValuesLen -1));
					var y = value * ($scope.height / maxValue);
					series.points.push(new Point(x, y));
				});
			});
		};
	}])

	.directive('linechart', ['linechartConfig', function(linechartConfig) {
		return {
			restrict: 'EA',
			replace: true,
			controller: 'LinechartController',
			template:
				'<svg ng-attr-height="{{height + 10}}" ng-attr-width="{{width + 10}}">' +
					'<g transform="translate(5, 5)">' +
						'<line x1="0" y1="0" x2="0" ng-attr-y2="{{height}}" stroke="black" stroke-width="2"></line>' +
						'<line x1="0" ng-attr-y1="{{height}}" ng-attr-x2="{{width}}" ng-attr-y2="{{height}}" stroke="black" stroke-width="2"></line>' +
						'<g ng-attr-transform="translate(0, {{height}}), scale(1, -1)" ng-transclude>' +
						'</g>' +
					'</g>' +
				'</svg>',
			transclude: true,
			scope: {
				h: '@h',
				w: '@w'
			},
			link: function(scope, element, attrs, ctrl) {
				scope.height = angular.isDefined(scope.h) ? scope.$eval(scope.h) : linechartConfig.height;
				scope.width = angular.isDefined(scope.w) ? scope.$eval(scope.w): linechartConfig.width;
			}
		};
	}])

	.directive('linechartSeries', ['$parse', function($parse) {
		return {
			restrict: 'EA',
			require: '^linechart',
			replace: true,
			type: 'svg',
			template:
				'<polyline ng-attr-points="{{points.join(\' \')}}" />',
			scope: {
				vals: '@values'
			},
			link: function(scope, element, attrs, ctrl) {
				var getValues = $parse(scope.vals);

				scope.values = getValues();
				ctrl.addSeries(scope);

				scope.$watchCollection('vals', function() {
					scope.values = $parse(scope.vals)();
					ctrl.setLines();
				});
			}
		};
	}]);