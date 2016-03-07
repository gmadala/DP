'use strict';

angular.module('nextgearWebApp')
  .directive('nxgDebugTitle', function (nxgConfig) {
    return {
      restrict: 'A',
      compile: function (element) {
        var api = nxgConfig.apiDomain || 'mock';

        var gitSha;
        // @ifdef GIT_SHA
        gitSha = '/* @echo GIT_SHA */';
        // @endif

        // @ifndef GIT_SHA
        gitSha = 'local';
        // @endif

        element.attr('title', gitSha + ' ' + api);
      }
    };
  });
