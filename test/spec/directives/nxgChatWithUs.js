'use strict';

describe('Directive: nxgChatWithUs', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, element, form, url = 'https://home-c4.incontact.com/inContact/ChatClient/ChatClient.aspx?poc=0a63c698-c417-4ade-8e0d-55cccf2b0d85&bu=4592556',
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
