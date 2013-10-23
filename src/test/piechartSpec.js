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

         it('resets angles as slices are added to the collection', function() {
            var slice1, slice2, slice3;

            ctrl.addSlice(slice1 = { value: 50 });
            expect(slice1.angle).toBe(360);
            ctrl.addSlice(slice2 = { value: 50 });
            expect(slice1.angle).toBe(180);
            expect(slice2.angle).toBe(180);
            ctrl.addSlice(slice3 = { value: 100 });
            expect(slice1.angle).toBe(90);
            expect(slice2.angle).toBe(90);
            expect(slice3.angle).toBe(180);
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

         it('resets angles as slices are removed from the collection', function() {
            var slice1, slice2, slice3;

            ctrl.addSlice(slice1 = { value: 50 });
            ctrl.addSlice(slice2 = { value: 50 });
            ctrl.addSlice(slice3 = { value: 100 });
            
            ctrl.removeSlice(slice2);
            expect(slice1.angle).toBe(120);
            expect(slice3.angle).toBe(240);

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
               "<piechart>" +
                  "<piechart-slice></piechart-slice>" +
                  "<piechart-slice></piechart-slice>" +
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

         it('should create paths', function() {
            expect(slices.length).toEqual(2);
            expect(findPath(0).attr('d')).toEqual('');
         });
      });
   });
});
