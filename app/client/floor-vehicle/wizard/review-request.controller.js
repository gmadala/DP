/**
 * Created by gayathri.madala on 9/28/16.
 */
(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ReviewInfoCtrl', ReviewInfoCtrl);

  ReviewInfoCtrl.$inject = [
    '$scope',
    '$window',
    'User',
    'gettextCatalog'];

  function ReviewInfoCtrl(
    $scope,
    $window,
    User,
    gettextCatalog) {

    var vm = this;


    vm.vinDetailsErrorFlag = false;

    $scope.isDealer = User.isDealer();

    var languagePrefix = '';
    var currentLanguage = gettextCatalog.currentLanguage;
    if (!User.isUnitedStates()) {
      if (currentLanguage === 'fr_CA') {
        languagePrefix = 'CAF%20';
      } else {
        languagePrefix = 'CAE%20';
      }
    } else {
      if (currentLanguage === 'es') {
        languagePrefix = 'ES%20';
      }
    }

    $scope.documentLink = '/documents/' + languagePrefix + 'Dealer%20Funding%20Checklist.pdf';
    $scope.openDocument = function () {
      $window.open($scope.documentLink);
    };
  }

})();
