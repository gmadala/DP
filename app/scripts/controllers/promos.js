'use strict';

angular.module('nextgearWebApp')
  .controller('PromosCtrl', PromosCtrl);

function PromosCtrl($scope) {
  $scope.promos = {
    promo1: {
      Location: 'location1',
      Description: 'description1',
      SalesDate: 'Date1',
      TermsAndConditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
      'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ' +
      'ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
      'nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim ' +
      'id est laborum.'
    },
    promo2: {
      Location: 'location2',
      Description: 'description2',
      SalesDate: 'Date2',
      TermsAndConditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
      'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ' +
      'ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
      'nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim ' +
      'id est laborum.'
    },
    promo3: {
      Location: 'location3',
      Description: 'description3',
      SalesDate: 'Date3',
      TermsAndConditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
      'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ' +
      'ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
      'nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim ' +
      'id est laborum.'
    }
  }
}
