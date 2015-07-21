(function () {

  'use strict';

  angular.module('nextgearWebApp', ['ui.state', 'ui.bootstrap', '$strap.directives', 'ui.calendar', 'ui.highlight',
    'ui.event', 'segmentio', 'ngCookies', 'ngSanitize', 'LocalStorageModule', 'gettext', 'nextgearWebCommon']);

  angular.module('nextgearWebApp').constant('SupportedLanguages', [
    {id: 1, key: 'en', name: 'English'},
    {id: 1, key: 'enDebug', name: 'English (Debug)'},
    {id: 2, key: 'fr_CA', name: 'French (CA)'},
    {id: 3, key: 'es', name: 'Spanish'}
  ]);

})();
