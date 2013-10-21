describe('piechart', function() { 
   var $scope;

   beforeEach(function() {
      module('piechart');

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
      });
   });
});
