'use strict';

describe('Directive: nxgChatWithUs', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, element, form, url = 'http://www.nextgearcapital.com/contact.php',
    urlNonEn = 'http://www.nextgearcapital.com/contact.php';

  it('should work on an <a> tag', inject(function ($rootScope, $compile) {
    scope = $rootScope;
    element = angular.element(
      '<a nxg-chat-with-us id="foo">link text</a>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element.attr('href')).toBe(url);
    expect(element.attr('target')).toBe('_blank');
    expect(element.attr('id')).toBe('foo');

  }));

  it('should work on a <div> tag', inject(function ($rootScope, $compile, $window) {
    scope = $rootScope;
    element = angular.element(
      '<div nxg-chat-with-us id="foo">link text</a>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element.attr('id')).toBe('foo');

    spyOn($window, 'open');

    element.trigger('click');

    expect($window.open).toHaveBeenCalledWith(url, '_blank');
  }));

  it('does not use Chat URL when language is not English', inject(function ($rootScope, $compile, gettextCatalog) {
    gettextCatalog.setCurrentLanguage('en_DEBUG');

    scope = $rootScope;
    element = angular.element(
      '<a nxg-chat-with-us id="foo">link text</a>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element.attr('href')).toBe(urlNonEn);
    expect(element.attr('target')).toBe('_blank');
    expect(element.attr('id')).toBe('foo');
  }));


});
