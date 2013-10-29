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
      var ctrl, element, attrs;

      beforeEach(function() {
         attrs = {}, element = {};
         
         inject(function($controller) {
            ctrl = $controller('PiechartController', { $scope: $scope, $element: element, $attrs: attrs });
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

         it('sets arcs for slices in the collection', function() {
            var slice1, slice2, slice3,
                radius = 10,
                ninety = { x: 10, y: 0 },
                twoForty = { x: -10, y: 0 };

            ctrl.addSlice(slice1 = { value: 50 });
            ctrl.setArcs(radius);

            expect(slice1.arc.start).toEqual(ninety);
            expect(slice1.arc.end).toEqual(ninety);

            ctrl.addSlice(slice2 = { value: 50 });
            ctrl.setArcs(radius);

            expect(slice1.arc.start).toEqual(ninety);
            expect(slice1.arc.end).toEqual(twoForty);
            expect(slice2.arc.start).toEqual(twoForty);
            expect(slice2.arc.end).toEqual(ninety);
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

         it('sets arcs for slices in the collection', function() {
            var slice1, slice2, slice3,
                radius = 10,
                ninety = { x: 10, y: 0 },
                twoForty = { x: -10, y: 0 };

            ctrl.addSlice(slice1 = { value: 50 });
            ctrl.addSlice(slice2 = { value: 50 });
            ctrl.addSlice(slice3 = { value: 50 });
            ctrl.removeSlice(slice2);
            ctrl.setArcs(radius);
            
            expect(slice1.arc.start).toEqual(ninety);
            expect(slice1.arc.end).toEqual(twoForty);
            expect(slice3.arc.start).toEqual(twoForty);
            expect(slice3.arc.end).toEqual(ninety);
         });
      });
   });

   describe('piechartSlice', function() {
      var scope, $compile, element, slices;
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
         element = slices = scope = $compile = undefined;
      });

      describe('with static slices', function() {

         beforeEach(function() {
            var html = 
               "<piechart radius='10'>" +
                  "<piechart-slice value='50'></piechart-slice>" +
                  "<piechart-slice value='50'></piechart-slice>" +
               "</piechart-slice>";
            
            element = angular.element(html);
            angular.element(document.body).append(element);
            $compile(element)(scope);
            scope.$digest();
            slices = element.find('path');
         });

         afterEach(function() {
            element.remove();
         });

         it('should create paths with correct d strings', function() {
            expect(slices.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('M10,0A10,10,0,1,1,-10,0Z');
            expect(findPath(1).attr('d')).toEqual('M-10,0A10,10,0,1,1,10,0Z');
         });
      });
   });
});
