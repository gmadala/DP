'use strict';

describe('Controller: HomeCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var HomeCtrl,
    scope,
    userMock,
    init,
    displayTitleRelease = true;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    userMock = {
      infoPromise: function() {
        return {
          then: function(callback) {
            callback({
              DisplayTitleReleaseProgram: displayTitleRelease
            });
          }
        };
      }
    };

    init = function() {
      HomeCtrl = $controller('HomeCtrl', {
        $scope: scope,
        User: userMock
      });
    };

    init();
  }));

  it('should only show title release if API info says it should be shown', function() {
    expect(scope.showTitleReleases).toBe(true);
    displayTitleRelease = false;
    init();
    expect(scope.showTitleReleases).toBe(false);
  });

});
