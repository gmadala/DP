'use strict';

angular.module('nextgearWebApp')
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
