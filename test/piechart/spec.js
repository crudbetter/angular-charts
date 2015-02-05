var async = require('async');

describe('piechart directive', function() {
  var baseUrl = 'http://localhost:8000/test/piechart/';
  var two_slices_50_50, three_slices_50_50_100;

  var getDriverScreenshot = function(url, callback) {
    browser.driver.get(url);
    browser.driver.takeScreenshot().then(function(data) {
      callback(null, data);
    });
  };

  beforeAll(function(done) {
    async.series([
      async.apply(getDriverScreenshot, baseUrl + 'expected/two_slices_50_50.html'),
      async.apply(getDriverScreenshot, baseUrl + 'expected/three_slices_50_50_100.html')
    ], function(err, results) {
      two_slices_50_50 = results[0];
      three_slices_50_50_100 = results[1];
      done();
    });
  });

  it('should render static slices', function() {
    browser.get('http://localhost:8000/test/piechart/harness.html');
    browser.takeScreenshot().then(function(data) {
      expect(data).toEqual(two_slices_50_50);
    });
  });

  it('should render dynamic slices', function() {
    browser.get('http://localhost:8000/test/piechart/harness.html');
    browser.driver.executeScript('sliceValues.push(100)');
    browser.takeScreenshot().then(function(data) {
      expect(data).toEqual(three_slices_50_50_100);
    });
  })
});