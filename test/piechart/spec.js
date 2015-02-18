var async = require('async');

describe('piechart', function() {
  var baseUrl = 'http://localhost:8000/test/piechart/';
  var harnessUrl = baseUrl + 'harness.html';
  var two_slices_50_50, three_slices_50_50_100, three_slices_50_popped_50_100;

  var getDriverScreenshot = function scrshot(url, callback) {
    browser.driver.get(url);
    browser.driver.takeScreenshot().then(function(data) {
      callback(null, data);
    });
  };

  beforeAll(function(done) {
    async.series([
      async.apply(getDriverScreenshot, baseUrl + 'expected/two_slices_50_50.html'),
      async.apply(getDriverScreenshot, baseUrl + 'expected/three_slices_50_50_100.html'),
      async.apply(getDriverScreenshot, baseUrl + 'expected/three_slices_50_popped_50_100.html')
    ], function(err, results) {
      two_slices_50_50 = results[0];
      three_slices_50_50_100 = results[1];
      three_slices_50_popped_50_100 = results[2];
      done();
    });
  });

  it('should render static slices', function() {
    browser.get(harnessUrl);
    browser.waitForAngular();
    browser.takeScreenshot().then(function(data) {
      expect(data).toEqual(two_slices_50_50);
    });
  });

  it('should render dynamic slices', function() {
    browser.get(harnessUrl);
    browser.waitForAngular();
    browser.driver.executeScript('sliceValues.push(100)');
    browser.takeScreenshot().then(function(data) {
      expect(data).toEqual(three_slices_50_50_100);
    });
  });

  it('should animate slice focus', function () {
    browser.get(harnessUrl);
    browser.waitForAngular();
    browser.driver.executeScript('sliceValues.push(100)');
    element.all(by.repeater('slice in slices')).first().click();
    browser.sleep(250);
    browser.driver.takeScreenshot().then(function(data) {
      expect(data).toEqual(three_slices_50_popped_50_100);
    });
  });
});