(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('FooterCtrl', FooterCtrl);

  FooterCtrl.$inject = [
    '$scope',
    'gettextCatalog',
    'User'
  ];

  function FooterCtrl(
    $scope,
    gettextCatalog,
    User) {

    // bind functions for use in spec
    $scope.updateContactLink = updateContactLink;

    // initialize contact link
    $scope.updateContactLink(gettextCatalog.currentLanguage).then(function() {

      // update contact link if language changes (un-needed functionality?)
      $scope.$watch(function() {
        return gettextCatalog.currentLanguage;
      }, function(lang) {
        $scope.updateContactLink(lang);
      });

    });

    // update contact link based on user country / language
    function updateContactLink(lang) {
      return User.getInfo().then(function() {
        switch (lang) {
          // fr_CA is hard-coded in language selector, possibly should update to 'fr' since not everyone likes maple syrup eh
          case 'fr_CA':
            if (!User.isUnitedStates()) {
              $scope.contactLink = 'https://canada.nextgearcapital.com/nous-contacter/?lang=fr';
              break;
            }

            $scope.contactLink = 'https://www.nextgearcapital.com/nous-contacter/?lang=fr';
            break;
          case 'es':
            $scope.contactLink = 'https://www.nextgearcapital.com/contact-us/?lang=es';
            break;
          default:
            $scope.contactLink = 'http://www.nextgearcapital.com/contact-us';
            break;
        }
      });
    }
  }
})();