(function () {
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
    $scope.updateContactLink().then(function () {

      $scope.$on('event:userAuthenticated', function () {
        $scope.updateContactLink();
      });

    });

    // update contact link based on user country / language
    function updateContactLink() {
      return User.getInfo().then(function () {
        var currentLang = gettextCatalog.currentLanguage;

        // redirect to 
        if (!User.isUnitedStates()) {
          $scope.contactLink = 'https://canada.nextgearcapital.com/';
        } else {
          $scope.contactLink = 'https://www.nextgearcapital.com/';
        }

        switch (currentLang) {
          // fr_CA is hard-coded in language selector, possibly should update to 'fr' since not everyone likes maple syrup eh
          case 'fr_CA':
            $scope.contactLink += 'nous-contacter/?lang=fr';
            break;
          case 'es':
            $scope.contactLink += 'contact-us/?lang=es';
            break;
          default:
            $scope.contactLink += 'contact-us';
            break;
        }
      });
    }
  }
})();