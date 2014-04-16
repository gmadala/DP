'use strict';

describe('Directive: nxgHighlight', function () {

  beforeEach(module('nextgearWebApp'));

  var scope,
      element,
      form;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope;
    element = angular.element(
      '<p nxg-highlight="text" highlight="search">'
    );
    element = $compile(element)(scope);
  }));

  it('should have the correct text', function () {
    scope.text = 'This is the text to search';
    scope.search = 'to search';
    scope.$digest();
    expect(element.text()).toBe('This is the text to search');
  });

  it('should have one instance of the found search text', function () {
    scope.text = 'This is the text to search';
    scope.search = 'to search';
    scope.$digest();
    expect(element.find('span').length).toBe(1);
    expect(element.find('span').first().text()).toBe('to search');
  });

  describe('change search text', function() {

    it('should not find the search value due to search change', function() {
      scope.text = 'This is the text to search';
      scope.search = 'to search';
      scope.$digest();
      expect(element.find('span').length).toBe(1);

      scope.search = 'not found string';
      scope.$digest();
      expect(element.find('span').length).toBe(0);
    });

    it('should not find the search value due to text change', function() {
      scope.text = 'This is the text to search';
      scope.search = 'to search';
      scope.$digest();
      expect(element.find('span').length).toBe(1);

      scope.text = 'Change the main text';
      scope.$digest();
      expect(element.find('span').length).toBe(0);
    });

  });

  describe('sanitization', function() {

    // For some escaped values asking for it back unescapes (like quotes and slashes)
    // so we have to spy on that function call, not just ask for the value back.
    beforeEach(function() {
      spyOn($.fn, 'html');
    });

    it('should sanitize ampersands', function() {
      scope.text = 'this & that';
      scope.search = '';
      scope.$digest();
      expect(element.html).toHaveBeenCalledWith('this &amp; that');
    });

    it('should sanitize <', function() {
      scope.text = 'this < that';
      scope.search = '';
      scope.$digest();
      expect(element.html).toHaveBeenCalledWith('this &lt; that');
    });

    it('should sanitize >', function() {
      scope.text = 'this > that';
      scope.search = '';
      scope.$digest();
      expect(element.html).toHaveBeenCalledWith('this &gt; that');
    });

    it('should sanitize single quotes', function() {
      scope.text = 'this \' that';
      scope.search = '';
      scope.$digest();
      expect(element.html).toHaveBeenCalledWith('this &#x27; that');
    });

    it('should sanitize double quotes', function() {
      scope.text = 'this " that';
      scope.search = '';
      scope.$digest();
      expect(element.html).toHaveBeenCalledWith('this &quot; that');
    });

    it('should sanitize slash', function() {
      scope.text = 'this / that';
      scope.search = '';
      scope.$digest();
      expect(element.html).toHaveBeenCalledWith('this &#x2F; that');
    });

  });

});
