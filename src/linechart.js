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