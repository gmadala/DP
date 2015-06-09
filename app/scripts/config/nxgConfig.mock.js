'use strict';

angular.module('nextgearWebApp')
  // TODO Uncomment upon upgrading to Angular 1.3 or instead use angular.reloadWithDebugInfo(); in console window
  // https://docs.angularjs.org/guide/production
  //.config(['$compileProvider', function ($compileProvider) {
  //  $compileProvider.debugInfoEnabled(true);
  //}])
  .config(function ($provide) {
    $provide.decorator('nxgConfig', ['$delegate', function ($delegate) {
      return angular.extend({}, $delegate, {
        apiBase: '/* @echo apiBase */',
        apiDomain: '/* @echo apiDomain */',
        // @if isDemo
        isDemo: true,
        segmentIoKey: null
        // @endif
      });
    }]);
  });
