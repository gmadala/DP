'use strict';

angular.module('nextgearWebApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('translations', {
        url: '/translations',
        templateUrl: 'views/translations.html',
        controller: 'TranslationTestCtrl',
        allowAnonymous: true
      });
  })
  .run(function(gettextCatalog, $cookieStore) {
    gettextCatalog.debug = true;

    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      url = window.location.href,
      params = {},
      match = regex.exec(url);
    while(match) {
      params[match[1]] = match[2];
      match = regex.exec(url);
    }

    // lang=CODE only allowed in local mode
    if (params.lang && $cookieStore.get('lang') !== params.lang) {
      $cookieStore.put('lang', params.lang);
      window.location.reload();
    }

    angular.element('body').prepend(
      '<div id="translationDebugger" ng-controller="TranslationDebuggerCtrl" ng-dblclick="hide()" ng-show="visible">' +
        '<div nxg-translation-debugger></div>' +
      '</div>'
    );
  })
  .constant('translationsJSON', {})
  .controller('TranslationDebuggerCtrl', function ($scope, SupportedLanguages, translationsJSON) {
    $scope.languages = SupportedLanguages;
    $scope.translationsJSON = translationsJSON;
    $scope.visible = true;
    $scope.hide = function () {
      $scope.visible = false;
    };
  })
  .controller('TranslationTestCtrl', function ($scope, SupportedLanguages, translationsJSON, gettextCatalog) {
    $scope.languages = SupportedLanguages;
    $scope.translationsJSON = translationsJSON;
    var missingTranslations = $scope.missingTranslations = {
      strings: {},
      plurals: {}
    };
    var hasMatchingString = function (string, type) {
      if (type === 'strings') {
        return gettextCatalog.strings[gettextCatalog.currentLanguage].hasOwnProperty(string);
      }
      else {
        return gettextCatalog.strings[gettextCatalog.currentLanguage].hasOwnProperty(string) && gettextCatalog.strings[gettextCatalog.currentLanguage][string].length === 2;
      }
    };

    angular.forEach(SupportedLanguages, function (lang) {
      if (['en', 'enDebug'].indexOf(lang.key) > -1) {
        return;
      }

      // Set the language
      gettextCatalog.setCurrentLanguage(lang.key);

      angular.forEach(['strings', 'plurals'], function (type) {
        angular.forEach(translationsJSON[type], function (string) {
          if (!hasMatchingString(string, type)) {
            if (!missingTranslations[type].hasOwnProperty(string)) {
              missingTranslations[type][string] = [];
            }

            missingTranslations[type][string].push(lang);
          }
        });
      });
    });

    // Set back to default settings
    gettextCatalog.setCurrentLanguage(gettextCatalog.baseLanguage);
    gettextCatalog.debug = true;
  })
  .directive('nxgTranslationDebugger', function (gettextCatalog) {
      var template =
        '<strong>TRANSLATIONS</strong>' +
        '<ul>' +
          '<li ng-repeat="lang in languages"><a ng-click="switchLang(lang.key)" ng-class="{ active: lang.key == currentLanguage }">{{ lang.name }}</a></li>' +
        '</ul>';

      angular.element('head').append(
      '<style>' +
        '#translationDebugger { position: fixed; top: 150px; left: 10px; background: #eee; border-radius: 4px; border: solid 1px #aaa; padding: .5em; opacity: .7; z-index: 5000 }' +
        '#translationDebugger strong { display: block; text-align: center }' +
        '#translationDebugger ul { margin: .5em 0 0 0 }' +
        '#translationDebugger ul li { margin: 0 0 .5em 0 }' +
        '#translationDebugger ul li a { display: block; padding: .5em 1em; border: solid 1px #aaa; border-radius: 4px; color: #333; cursor: pointer }' +
        '#translationDebugger ul li a.active { background: white; color: blue; border-color: blue }' +
       '</style>'
      );

      return {
        restrict: 'A',
        template: template,
        link: function (scope) {

          scope.currentLanguage = gettextCatalog.currentLanguage;

          scope.switchLang = function (lang) {
            gettextCatalog.setCurrentLanguage(lang);
            scope.currentLanguage = gettextCatalog.currentLanguage;
            angular.element('body').removeClass('lang_en');
            angular.element('body').removeClass('lang_enDebug');
            angular.element('body').removeClass('lang_es');
            angular.element('body').removeClass('lang_fr_CA');
            angular.element('body').addClass('lang_' + lang);
          };

        }
      };
    });
