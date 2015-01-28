'use strict';

describe('Service: language', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var language, catalog;
  beforeEach(inject(function (_language_, gettextCatalog) {
    language = _language_;
    catalog = gettextCatalog;
  }));

  it('should return english id by default.', function () {
    catalog.currentLanguage = 'es';
    expect(language.getCurrentLanguageId()).toEqual(3);
    catalog.currentLanguage = undefined;
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

});
