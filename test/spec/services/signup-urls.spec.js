'use strict';

describe('Service: signupUrls', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var signupUrls, gettextCatalog;
  beforeEach(inject(function (_signupUrls_, _gettextCatalog_) {
    signupUrls = _signupUrls_;
    gettextCatalog = _gettextCatalog_;
  }));

  afterEach(function () {
    gettextCatalog.setCurrentLanguage(gettextCatalog.baseLanguage);
  });

  it('should have a URL for English (en) language', function () {
    var result = signupUrls.getByLanguage('en');
    expect(result).toBe(signupUrls.urls.en);
  });

  it('should have a URL for French (fr_CA) language', function () {
    var result = signupUrls.getByLanguage('fr_CA');
    expect(result).toBe(signupUrls.urls.fr_CA);
  });

  it('should have a URL for Spanish (es) language', function () {
    var result = signupUrls.getByLanguage('es');
    expect(result).toBe(signupUrls.urls.es);
  });

  it('allows you to get by current language', function () {
    gettextCatalog.setCurrentLanguage('fr_CA');
    var result = signupUrls.getForCurrentLanguage();
    expect(result).toBe(signupUrls.urls.fr_CA);
  });

  it('returns default if language cannot be found', function () {
    var result = signupUrls.getByLanguage('en_DEBUG');
    expect(result).toBe(signupUrls.getDefaultUrl());
  });

});
