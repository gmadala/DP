(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('signupUrls', signupUrls);

  signupUrls.$inject = ['gettextCatalog'];

  function signupUrls(gettextCatalog) {

    return {
      urls: {
        en: 'https://www.nextgearcapital.com/apply-for-credit/',
        'en_CA': 'https://www.nextgearcapital.com/apply-for-credit/',
        'fr_CA': 'https://www.nextgearcapital.com/apply-for-credit/',
        // Currently redirecting Spanish to English site
        es: 'https://www.nextgearcapital.com/apply-for-credit/'
      },

      /**
       * Get the URL for any missing URLs
       * @returns {string}
       */
      getDefaultUrl: function () {
        return this.urls.en;
      },

      /**
       * Get by a specific language
       * @param lang  (en, en_CA, fr_CA, etc.)
       * @returns {String}
       */
      getByLanguage: function (lang) {
        if (this.urls.hasOwnProperty(lang)) {
          return this.urls[lang];
        }
        return this.getDefaultUrl();
      },

      /**
       * Get for the current selected language
       * @returns {String}
       */
      getForCurrentLanguage: function () {
        return this.getByLanguage(gettextCatalog.currentLanguage);
      }
    };

  }
})();
