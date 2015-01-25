describe('piechart test harness', function() {
  it('should render', function() {
    browser.get('http://127.0.0.1:8000/test/piechart/harness.html');
  	browser.driver.takeScreenshot().then(function(data) {
  		browser.driver.get('http://127.0.0.1:8000/test/piechart/expected/two_slices_75_25.html');
	    browser.driver.takeScreenshot().then(function(dataNext) {
	    	expect(data).toEqual(dataNext);
	    });
	  });
  });
});