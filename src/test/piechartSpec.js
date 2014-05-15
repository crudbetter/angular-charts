describe('Controller: PiechartController', function() {
   var attrs, ctrl;
   var slice1 = { value: 50 };
   var slice2 = { value: 150 };

   beforeEach(function() {
      module('piechart');

      inject(function($controller, $rootScope) {
         ctrl = $controller('PiechartController', { $scope: $rootScope, $attrs: {} });
      });
   });

   describe('Function: addSlice', function() {
      it('should add to the colleciton', function() {
         ctrl.addSlice(slice1);
         ctrl.addSlice(slice2);

         expect(ctrl.slices.length).toBe(2);
         expect(ctrl.slices[0]).toBe(slice1);
         expect(ctrl.slices[1]).toBe(slice2);
      });
   });

   describe('Function: removeSlice', function() {
      it('should remove from the collection', function() {
         ctrl.addSlice(slice1);
         ctrl.addSlice(slice2);
         ctrl.removeSlice(slice1);

         expect(ctrl.slices.length).toBe(1);
         expect(ctrl.slices[0]).toBe(slice2);
      });
   });

   describe('Function: setArcs', function() {
      beforeEach(function() {
         ctrl.addSlice(slice1);
         ctrl.addSlice(slice2);
      });

      it('should set start and end points for each slice in the collection', function() {
         var ninety = { x: 1, y: 0 };
         var oneEighty = { x: 0, y: 1 };

         ctrl.setArcs();

         expect(slice1.arc.start).toEqual(ninety);
         expect(slice1.arc.end).toEqual(oneEighty);
         expect(slice2.arc.start).toEqual(oneEighty);
         expect(slice2.arc.end).toEqual(ninety);
      });

      it('should set large flag when a slices value is more than 50% of total collection value', function() {
         ctrl.setArcs();

         expect(slice1.arc.large).toBeFalsy(); 
         expect(slice2.arc.large).toBeTruthy();
      });
   });
});

describe('Directive: piechartSlice', function() {
   var $compile, $rootScope, element, paths;
   var findPaths = function() {
      return element[0].getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');
   };
   
   beforeEach(function() {
      module('piechart');

      inject(function(_$compile_, _$rootScope_) {
         $compile = _$compile_;
         $rootScope = _$rootScope_;
      });
   });

   afterEach(function() {
      element = paths = undefined;
   });

   it('should create path elements with correct d attributes', function() {
      var html = 
         "<div>" +
            "<piechart>" +
               "<piechart-slice value='50'></piechart-slice>" +
               "<piechart-slice value='150'></piechart-slice>" +
            "</piechart-slice>" +
         "</div>";

      element = angular.element(html);
      $compile(element)($rootScope);
      $rootScope.$apply();

      var paths = findPaths();

      expect(paths.length).toEqual(2);
      expect(paths[0].getAttribute('d')).toEqual('M0,0L1,0A1,1,1,0,1,0,1Z');
      expect(paths[1].getAttribute('d')).toEqual('M0,0L0,1A1,1,1,1,1,1,0Z');
   });

   describe('combined with ng-repeat', function() {
      var html =
         "<div>" +
            "<piechart radius='10'>" +
               "<piechart-slice ng-repeat='foo in foos' value='{{foo.value}}'></piechart-slice>" +
            "</piechart>" +
         "</div>";

      it('should create no path elements initially', function() {
         element = angular.element(html);
         $compile(element)($rootScope);
         $rootScope.$apply();

         expect(findPaths().length).toEqual(0);
      });

      it('should create path elements with correct d and tranform attributes when collection changes', function() {
         element = angular.element(html);
         $compile(element)($rootScope);
         $rootScope.$apply();

         $rootScope.foos = [
            { value: 50 },
            { value: 150 }
         ];
         $rootScope.$apply();

         var paths = findPaths();

         expect(paths.length).toEqual(2);
         expect(paths[0].getAttribute('d')).toEqual('M0,0L1,0A1,1,1,0,1,0,1Z');
         expect(paths[1].getAttribute('d')).toEqual('M0,0L0,1A1,1,1,1,1,1,0Z');
      });
   });
});
