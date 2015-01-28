'use strict';

angular.module('nextgearWebApp')
  .factory('language', function (gettextCatalog) {
    return {
      getCurrentLanguageId: function () {
        var lang = gettextCatalog.currentLanguage;
        if (lang === 'fr_CA') {
          return 2;
        } else if (lang === 'es') {
          return 3;
        } else {
          // default to English
          return 1;
        }
      }
    };
  });
