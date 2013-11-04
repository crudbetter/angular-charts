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
               piechartConfig.radius = 100;
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
      var scope, $compile, element, paths;
      var findPath = function(index) {
         return element.find('path').eq(index);
      };

      beforeEach(function() {
         inject(function($rootScope, _$compile_) {
            scope = $rootScope;
            $compile = _$compile_;
         });
      });
      
      afterEach(function() {
         element = paths = scope = $compile = undefined;
      });

      describe('with static slices', function() {

         beforeEach(function() {
            var html = 
               "<piechart radius='10'>" +
                  "<piechart-slice value='50'></piechart-slice>" +
                  "<piechart-slice value='50'></piechart-slice>" +
               "</piechart-slice>";
            
            element = angular.element(html);
            $compile(element)(scope);
            scope.$digest();
         });

         afterEach(function() {
            element.remove();
         });

         it('should create paths with correct d attributes', function() {
            paths = element.find('path');
            expect(paths.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M10,0A10,10,0,1,1,-10,0Z');
            expect(findPath(1).attr('d')).toEqual('M-10,0A10,10,0,1,1,10,0Z');
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
            $compile(element)(scope);
            scope.$digest();
         });

         it('should have no paths initially', function() {
            paths = element.find('path');
            expect(paths.length).toEqual(0);
         });

         it('should have a path for each model item', function() {
            scope.slices = model;
            scope.$digest();

            paths = element.find('path');

            expect(paths.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M10,0A10,10,0,1,1,-10,0Z');
            expect(findPath(1).attr('d')).toEqual('M-10,0A10,10,0,1,1,10,0Z');
         });
      });
   });
});
