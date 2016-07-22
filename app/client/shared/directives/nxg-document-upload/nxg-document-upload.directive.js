(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('documentUpload', documentUpload);

  function documentUpload() {

    return {
      restrict: 'A',
      templateUrl: 'client/shared/directives/nxg-document-upload/nxg-document-upload.template.html',
      controller: function() {
      }
    };

  }
})();
