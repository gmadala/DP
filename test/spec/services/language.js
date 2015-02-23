'use strict';

describe('Service: language', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var language, catalog, cookieStore;
  beforeEach(inject(function (_language_, gettextCatalog, $cookieStore) {
    language = _language_;
    catalog = gettextCatalog;
    cookieStore = $cookieStore;
  }));

  it('should return english id by default.', function () {
    catalog.currentLanguage = 'es';
    expect(language.getCurrentLanguageId()).toEqual(3);
    catalog.currentLanguage = undefined;
    expect(language.getCurrentLanguageId()).toEqual(1);
  });

  it('should return 1 for en language.', function () {
    catalog.currentLanguage = 'en';
    expect(language.getCurrentLanguageId()).toEqual(1);
  });

  it('should return 1 for enDebug language.', function () {
    catalog.currentLanguage = 'enDebug';
    expect(language.getCurrentLanguageId()).toEqual(1);
  });

  it('should return 2 for fr_CA language.', function () {
    catalog.currentLanguage = 'fr_CA';
    expect(language.getCurrentLanguageId()).toEqual(2);
  });

  it('should return 3 for es language.', function () {
    catalog.currentLanguage = 'es';
    expect(language.getCurrentLanguageId()).toEqual(3);
  });

  it('should set current language', function () {
    language.setCurrentLanguage('es');
    expect(catalog.currentLanguage = 'es');
  });

  it('should load language from storage', function () {
    cookieStore.put('lang', 'fr_CA');
    language.loadLanguage();
    expect(catalog.currentLanguage = 'fr_CA');
  });
});
