describe('linechart directive with static series', function() {
	it('should render', function() {
		browser.get('http://localhost:8000/test/linechart/staticHarness.html');
		browser.takeScreenshot().then(function(data) {
  		browser.driver.get('http://localhost:8000/test/linechart/expected/two_lines_alternating_points.html');
	    browser.driver.takeScreenshot().then(function(dataNext) {
	    	expect(data).toEqual(dataNext);
	    });
	  });
	});
});

describe('linechart directive with dynamic series', function() {
  it('should render', function() {
    browser.get('http://localhost:8000/test/linechart/dynamicHarness.html');
    browser.executeScript('seriesValues.push([0, 1, 0])');
    browser.executeScript('seriesValues.push([1, 0, 1])');
  	browser.takeScreenshot().then(function(data) {
  		browser.driver.get('http://localhost:8000/test/linechart/expected/two_lines_alternating_points.html');
	    browser.driver.takeScreenshot().then(function(dataNext) {
	    	expect(data).toEqual(dataNext);
	    });
	  });
  });
});