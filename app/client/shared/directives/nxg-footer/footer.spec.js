'use strict';

describe('Directive: navBar', function() {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/navbar/navbar.template.html'));

  describe('controller', function() {
    var scope,
      user
    gettextCatalog,
    $rootScope,
    $controller;

    beforeEach(inject(function(_$rootScope_, _$controller_, User, gettextCatalog) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      user = User;
      gettextCatalog = gettextCatalog;
      scope = $rootScope.$new();
    }));

    it('should have an updateContactLink function', function() {
      scope.$apply();
      expect(scope.updateContactLink).toBeDefined();
      expect(typeof scope.updateContactLink).toBe('function');

      it('should have called the updateContactLink function', function() {
        expect(scope.updateContactLink).toHaveBeenCalled();

        it('should define a default contact link', function() {
          expect(scope.contactLink).toBeDefined();

          describe('a canadian user', function() {
            beforeEach(function() {
              spyOn(user, 'isUnitedStates').and.returnValue(false);
              spyOn(gettextCatalog, 'currentLanguage').and.returnValue('en')
            });

            it('should set a canadian contact link', function() {
              expect(scope.contactLink).toBe('https://canada.nextgearcapital.com/contact-us');
            })
          });


          describe('a french canadian user', function() {
            beforeEach(function() {
              spyOn(user, 'isUnitedStates').and.returnValue(false);
              spyOn(gettextCatalog, 'currentLanguage').and.returnValue('fr_CA')
            });

            it('should set a french canadian contact link', function() {
              expect(scope.contactLink).toBe('https://canada.nextgearcapital.com/nous-contacter/?lang=fr');
            })
          });

          describe('a french user', function() {
            beforeEach(function() {
              spyOn(user, 'isUnitedStates').and.returnValue(true);
              spyOn(gettextCatalog, 'currentLanguage').and.returnValue('fr_CA')
            });

            it('should set a french contact link', function() {
              expect(scope.contactLink).toBe('https://www.nextgearcapital.com/nous-contacter/?lang=fr');
            })
          });

          describe('a spanish user', function() {
            beforeEach(function() {
              spyOn(user, 'isUnitedStates').and.returnValue(true);
              spyOn(gettextCatalog, 'currentLanguage').and.returnValue('es')
            });

            it('should set a spanish contact link', function() {
              expect(scope.contactLink).toBe('https://www.nextgearcapital.com/contact-us/?lang=es');
            })
          });

        });
      });
    });
  });
});