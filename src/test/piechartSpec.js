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

      it('should create path elements with correct d ttributes when collection changes', function() {
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
