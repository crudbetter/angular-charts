var async = require('async');

describe('linechart directive', function() {
	var baseUrl = 'http://localhost:8000/test/linechart/';
	var harnessUrl = baseUrl + 'harness.html';
	var two_lines_alt_points, two_lines_alt_points_one_line_short;

  var getDriverScreenshot = function(url, callback) {
    browser.driver.get(url);
    browser.driver.takeScreenshot().then(function(data) {
      callback(null, data);
    });
  };

  beforeAll(function(done) {
    async.series([
      async.apply(getDriverScreenshot, baseUrl + 'expected/two_lines_alternating_points.html'),
      async.apply(getDriverScreenshot, baseUrl + 'expected/two_lines_alternating_points_one_line_short.html')
    ], function(err, results) {
      two_lines_alt_points = results[0];
      two_lines_alt_points_one_line_short = results[1];
      done();
    });
  });

  it('should render static series', function() {
  	browser.get(harnessUrl);
  	browser.takeScreenshot().then(function(data) {
  		expect(data).toEqual(two_lines_alt_points);
  	});
  });

  it('should render dynamic series', function() {
  	browser.get(harnessUrl);
  	browser.executeScript('seriesValues.push([0.5, 0.5])');
  	browser.takeScreenshot().then(function(data) {
  		expect(data).toEqual(two_lines_alt_points_one_line_short);
  	});
  });
});