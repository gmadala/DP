(function () {

  'use strict';

  var supportedLanguages = [
    {id: 1, key: 'en', name: 'English'},
    {id: 1, key: 'enDebug', name: 'English (Debug)'},
    {id: 2, key: 'fr_CA', name: 'French (CA)'},
    {id: 3, key: 'es', name: 'Spanish'}
  ];

  angular
    .module('nextgearWebApp')
    .constant('supportedLanguages', supportedLanguages);

  angular
    .module('nextgearWebApp')
    .factory('language', language);

  language.$inject = ['$window', 'gettextCatalog'];

  function language($window, gettextCatalog) {

    var service;
    service = {
      getCurrentLanguageId: getCurrentLanguageId,
      setCurrentLanguage: setCurrentLanguage,
      loadLanguage: loadLanguage
    };
    return service;

    function getCurrentLanguageId() {
      // default to English
      var defaultId = 1;
      var lang = gettextCatalog.currentLanguage;
      if (lang) {
        return _.result(_.findWhere(supportedLanguages, {'key': lang}), 'id', defaultId);
      } else {
        return defaultId;
      }
    }

    function setCurrentLanguage(key) {
      // Store preference for future use
      $window.localStorage.setItem('lang', key);
      // update language
      gettextCatalog.setCurrentLanguage(key);
      // update page css
      _.forEach(supportedLanguages, function (language) {
        angular.element('body').removeClass('lang_' + language.key);
      });
      angular.element('body').addClass('lang_' + key);
    }

    function loadLanguage() {
      var key = $window.localStorage.getItem('lang');
      if (key) {
        setCurrentLanguage(key);
      }
    }
  }

})();
