'use strict';

angular.module('nextgearWebApp')
  .factory('signupUrls', function (gettextCatalog) {

    return {
      urls: {
        en: 'https://customer.nextgearcapital.com/NGCApplication/',
        'en_CA': 'http://www.nextgearcapital.com/french/links/NG_CanadaENG_CreditApp_Web.pdf',
        'fr_CA': 'http://www.nextgearcapital.com/french/links/NG_CanadaFREN_CreditApp_Web.pdf',
        // Currently redirecting Spanish to English site
        es: 'https://customer.nextgearcapital.com/NGCApplication/'
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
  });
