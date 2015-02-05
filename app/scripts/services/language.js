'use strict';

angular.module('nextgearWebApp')
  .factory('language', function ($cookieStore, gettextCatalog, SupportedLanguages) {
    return {
      getCurrentLanguageId: function () {
        // default to English
        var defaultId = 1;
        var lang = gettextCatalog.currentLanguage;
        if (lang) {
          return _.result(_.findWhere(SupportedLanguages, {'key': lang}), 'id', defaultId);
        } else {
          return defaultId;
        }
      },
      setCurrentLanguage: function (key) {
        // Set cookie for future use
        $cookieStore.put('lang', key);

        // update language
        gettextCatalog.setCurrentLanguage(key);

        // update page css
        _.forEach(SupportedLanguages, function(language) {

          angular.element('body').removeClass('lang_' + language.key);
        });
        angular.element('body').addClass('lang_' + key);

      },
      loadLanguage: function () {

        var key = $cookieStore.get('lang');
        if (key) {
          this.setCurrentLanguage(key);
        }
      }
    };
  });
