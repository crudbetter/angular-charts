describe('Controller: LinechartController', function() {
	var ctrl;
	var series1 = { values: [ 1, 2, 1 ] };
	var series2 = { values: [ 2, 1, 2 ] };
	var series3 = { values: [ 4 ] };

	beforeEach(function() {
		module('linechart');

		inject(function($controller, $rootScope) {
			var scope = $rootScope.$new();
			scope.height = 100;
			scope.width = 100;
			ctrl = $controller('LinechartController', { $scope: scope });
		});
	});

	describe('Function: addSeries', function() {
		it('should add to the collection', function() {
			ctrl.addSeries(series1);
			ctrl.addSeries(series2);

			expect(ctrl.series.length).toBe(2);
			expect(ctrl.series[0]).toBe(series1);
			expect(ctrl.series[1]).toBe(series2);
		});
	});

	describe('Function: setLines', function() {
		beforeEach(function() {
			ctrl.addSeries(series1);
			ctrl.addSeries(series2);
			ctrl.addSeries(series3);
		});

		it('should set points for each item in the series', function() {
			var zeroQuarter = { x: 0, y: 25 };
			var zeroHalf = { x: 0, y: 50 };
			var zeroOne = { x: 0, y: 100 };
			var halfQuarter = { x: 50, y: 25 };
			var halfHalf = { x: 50, y: 50 };
			var oneQuarter = { x: 100, y: 25 };
			var oneHalf = { x: 100, y: 50 };
			
			ctrl.setLines();

			expect(series1.points).toEqual([ zeroQuarter, halfHalf, oneQuarter ]);
			expect(series2.points).toEqual([ zeroHalf, halfQuarter, oneHalf ]);	
			expect(series3.points).toEqual([ zeroOne ]);
		});

	});
});

describe('Directive: linechartSeries', function() {
	var $compile, $rootScope, element, polylines;
	var findPolylines = function() {
		return element[0].getElementsByTagNameNS('http://www.w3.org/2000/svg', 'polyline');
	};

	beforeEach(function() {
		module('linechart');

		inject(function(_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
		});
	});

	afterEach(function() {
		element = polylines = undefined;
	});

	it('should create polyline elements with correct points attributes', function() {
		var html =
			'<div>' +
				'<linechart h="100" w="100">' +
					'<linechart-series values="[1, 2, 1]"></linechart-series>' +
					'<linechart-series values="[2, 1, 2]"></linechart-series>' +
					'<linechart-series values="[4]"></linechart-series>' +
				'</linechart>' +
			'</div>';

		element = angular.element(html);
		$compile(element)($rootScope);
		$rootScope.$apply();

		var polylines = findPolylines();

		expect(polylines.length).toEqual(3);
		expect(polylines[0].getAttribute('points')).toEqual('0,25 50,50 100,25');
		expect(polylines[1].getAttribute('points')).toEqual('0,50 50,25 100,50');
		expect(polylines[2].getAttribute('points')).toEqual('0,100');
	});

	describe('combined with ng-repeat', function() {
		var html =
			'<div>' +
				'<linechart h="100" w="100">' +
					'<linechart-series ng-repeat="foo in foos" values="{{foo.values}}"></linechart-series>' +
				'</linechart>' +
			'</div>';

		it('should create no polyline elements initiall', function() {
			element = angular.element(html);
			$compile(element)($rootScope);
			$rootScope.$apply();

			expect(findPolylines().length).toEqual(0);
		});

		it('should create polyline elements with correct points attributes when collection changes', function() {
			element = angular.element(html);
			$compile(element)($rootScope);
			$rootScope.$apply();

			$rootScope.foos = [
				{ values: [1, 2, 1] },
				{ values: [2, 1, 2] },
				{ values: [4] }
			];
			$rootScope.$apply();

			var polylines = findPolylines();

			expect(polylines.length).toEqual(3);
			expect(polylines[0].getAttribute('points')).toEqual('0,25 50,50 100,25');
			expect(polylines[1].getAttribute('points')).toEqual('0,50 50,25 100,50');
			expect(polylines[2].getAttribute('points')).toEqual('0,100');
		});
	});
});