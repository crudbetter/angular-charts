describe('piechart test harness', function() {
  it('should render', function() {
    browser.get('http://127.0.0.1:8000/test/piechart.html');
    var paths = element.all(by.repeater('slice in slices'));
    expect(paths.length).toEqual(2);
  });
});