describe('piechart directive with static slices', function() {
	it('should render', function() {
		browser.get('http://127.0.0.1:8000/test/piechart/staticHarness.html');
		browser.takeScreenshot().then(function(data) {
  		browser.driver.get('http://127.0.0.1:8000/test/piechart/expected/two_slices_25_75.html');
	    browser.driver.takeScreenshot().then(function(dataNext) {
	    	expect(data).toEqual(dataNext);
	    });
	  });
	})
});

describe('piechart directive with dynamic slices', function() {
  it('should render', function() {
    browser.get('http://127.0.0.1:8000/test/piechart/dynamicHarness.html');
    browser.executeScript('sliceValues.push(25)');
    browser.executeScript('sliceValues.push(75)');
  	browser.takeScreenshot().then(function(data) {
  		browser.driver.get('http://127.0.0.1:8000/test/piechart/expected/two_slices_25_75.html');
	    browser.driver.takeScreenshot().then(function(dataNext) {
	    	expect(data).toEqual(dataNext);
	    });
	  });
  });
});

describe('piechart directive with static and dynamic slices', function() {
	it('should render', function() {
    browser.get('http://127.0.0.1:8000/test/piechart/combinedHarness.html');
    browser.executeScript('sliceValues.push(100)');
  	browser.takeScreenshot().then(function(data) {
  		browser.driver.get('http://127.0.0.1:8000/test/piechart/expected/three_slices_50_50_100.html');
	    browser.driver.takeScreenshot().then(function(dataNext) {
	    	expect(data).toEqual(dataNext);
	    });
	  });
  });
});