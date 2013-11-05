describe('piechart', function() { 
   var $scope;

   beforeEach(function() {
      module('piechart');
      module('template/piechart.html');
      module('template/piechart-slice.html');

      inject(function($rootScope) {
         $scope = $rootScope;
      });
   });

   describe('controller', function() {
      var ctrl, $attrs;

      beforeEach(function() {
         $attrs = { radius: '1' };
         
         inject(function($controller) {
            ctrl = $controller('PiechartController', { $scope: $scope, $attrs: $attrs });
         });
      });

      describe('addSlice', function() {
         
         it('adds a slice to the collection', function() {
            var slice1, slice2;

            ctrl.addSlice(slice1 = $scope.$new());
            ctrl.addSlice(slice2 = $scope.$new());

            expect(ctrl.slices.length).toBe(2);
            expect(ctrl.slices[0]).toBe(slice1);
            expect(ctrl.slices[1]).toBe(slice2);
         });
      });

      describe('removeSlice', function() {

         it('removes a slice from the collection', function() {
            var slice1, slice2;

            ctrl.addSlice(slice1 = $scope.$new());
            ctrl.addSlice(slice2 = $scope.$new());
            ctrl.removeSlice(slice1);

            expect(ctrl.slices.length).toBe(1);
            expect(ctrl.slices[0]).toBe(slice2);
         });
      });

      describe('setArcs', function() {
         var slice1, slice2,
             originalConfigRadius;

         beforeEach(function() {
            ctrl.addSlice(slice1 = { value: 50 });
            ctrl.addSlice(slice2 = { value: 50 });

            inject(function(piechartConfig) {
               originalConfigRadius = piechartConfig.radius;
               piechartConfig.radius = 100;
            });
         });

         afterEach(function() {
            inject(function(piechartConfig) {
               piechartConfig.radius = originalConfigRadius;
            });
         });

         it('sets arc start and end points for each slice in the collection, using radius attribute if defined', function() {
            var ninety = { x: 1, y: 0 },
                twoForty = { x: -1, y: 0 };
            
            ctrl.setArcs();
            
            expect(slice1.arc.start).toEqual(ninety);
            expect(slice1.arc.end).toEqual(twoForty);
            expect(slice2.arc.start).toEqual(twoForty);
            expect(slice2.arc.end).toEqual(ninety);
         });

         it('sets arc start and end points for each slice in the collection, using piechartConfig if radius attribute not defined', function() {
            var ninety = { x: 100, y: 0 },
                twoForty = { x: -100, y: 0 };

            delete $attrs.radius;

            ctrl.setArcs();

            expect(slice1.arc.start).toEqual(ninety);
            expect(slice1.arc.end).toEqual(twoForty);
            expect(slice2.arc.start).toEqual(twoForty);
            expect(slice2.arc.end).toEqual(ninety);
         });
      });
   });

   describe('piechart-slice', function() {
      var $compile, element, paths,
          originalConfigRadius,
          findPath = function(index) {
             return element.find('path').eq(index);
          };

      beforeEach(function() {
         inject(function( _$compile_, piechartConfig) {
            $compile = _$compile_;

            originalConfigRadius = piechartConfig.radius;
            piechartConfig.radius = 100;
         });
      });
      
      afterEach(function() {
         element = paths = $scope = $compile = undefined;

         inject(function(piechartConfig) {
            originalConfigRadius = piechartConfig.radius;
         });
      });
      
      describe('with static slices', function() {

         afterEach(function() {
            element.remove();
         });

         it('should create paths with d attribute, using piechart radius attribute if defined', function() {
            var html = 
               "<piechart radius='10'>" +
                  "<piechart-slice value='50'></piechart-slice>" +
                  "<piechart-slice value='50'></piechart-slice>" +
               "</piechart-slice>";
            
            element = angular.element(html);
            $compile(element)($scope);
            $scope.$digest();

            paths = element.find('path');
            expect(paths.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M10,0A10,10,0,1,1,-10,0Z');
            expect(findPath(1).attr('d')).toEqual('M-10,0A10,10,0,1,1,10,0Z');
         });

         it('should create paths with d attrribute, using piechartConfig if piechart radius attribute not defined', function() {
            var html = 
               "<piechart>" +
                  "<piechart-slice value='50'></piechart-slice>" +
                  "<piechart-slice value='50'></piechart-slice>" +
               "</piechart-slice>";
            
            element = angular.element(html);
            $compile(element)($scope);
            $scope.$digest();

            paths = element.find('path');
            expect(paths.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M100,0A100,100,0,1,1,-100,0Z');
            expect(findPath(1).attr('d')).toEqual('M-100,0A100,100,0,1,1,100,0Z');
         });
      });

      describe('with dynamic slices', function() {
         var model;

         beforeEach(function() {
            var html = 
               "<piechart radius='10'>" +
                  "<piechart-slice ng-repeat='slice in slices' value='{{slice.value}}'></piechart-slice>" +
               "</piechart-slice>";
            
            element = angular.element(html);
            model = [
               { value: '50' },
               { value: '50' }
            ];
            $compile(element)($scope);
            $scope.$digest();
         });

         it('should create no paths initially', function() {
            var html = 
               "<piechart radius='10'>" +
                  "<piechart-slice ng-repeat='slice in slices' value='{{slice.value}}'></piechart-slice>" +
               "</piechart-slice>";
            
            element = angular.element(html);
            $compile(element)($scope);
            $scope.$digest();

            paths = element.find('path');
            expect(paths.length).toEqual(0);
         });

         it('should create paths with d attribute, using piechart radius attribute if defined', function() {
            var html = 
               "<piechart radius='10'>" +
                  "<piechart-slice ng-repeat='slice in slices' value='{{slice.value}}'></piechart-slice>" +
               "</piechart-slice>";

            element = angular.element(html);
            $compile(element)($scope);
            $scope.slices = model;
            $scope.$digest();

            paths = element.find('path');

            expect(paths.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M10,0A10,10,0,1,1,-10,0Z');
            expect(findPath(1).attr('d')).toEqual('M-10,0A10,10,0,1,1,10,0Z');
         });

         it('should create paths with d attribute, using piechartConfig if piechart radius attribute not defined', function() {
            var html = 
               "<piechart>" +
                  "<piechart-slice ng-repeat='slice in slices' value='{{slice.value}}'></piechart-slice>" +
               "</piechart-slice>";

            element = angular.element(html);
            $compile(element)($scope);
            $scope.slices = model;
            $scope.$digest();

            paths = element.find('path');

            expect(paths.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M100,0A100,100,0,1,1,-100,0Z');
            expect(findPath(1).attr('d')).toEqual('M-100,0A100,100,0,1,1,100,0Z');
         });
      });
   });
});
