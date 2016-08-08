(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('CarInfoCtrl', CarInfoCtrl);

  CarInfoCtrl.$inject = [
    '$scope'
  ];

  function CarInfoCtrl(
    $scope
  ) {
    var vm = this;

    vm.sample = 'This car info is coming from the controller';

    vm.data = null;

    vm.vinDetailsErrorFlag = false;

    vm.defaultData = {
      PhysicalInventoryAddressId: null, // Location object locally, flatten to string for API tx
      UnitColorId: null, // Color object locally, flatten to string to API tx
      UnitMake: null, // string
      UnitMileage: null, // string
      UnitModel: null, // string
      UnitPurchaseDate: $scope.$parent.wizardFloor.today, // Date locally, format to string for API transmission, default is today
      UnitPurchasePrice: null, // string
      UnitStyle: null, // string
      UnitVin: null, // string
      VinAckLookupFailure: false, // Boolean (whether vehicle data came from VIN or manual attribute entry)
      UnitYear: null, // int
      TitleLocationId: null, // TitleLocationOption object locally, flatten to int for API tx
      TitleTypeId: null // null locally, int extracted from TitleLocationOption object above for API tx
    };

    vm.setDefaults = function() {
      _.assign($scope.$parent.wizardFloor.data, vm.defaultData);
    }

    console.log($scope);
    // $scope.$watch('form', function(newVal) {
    //   $scope.$parent.wizardFloor.currentForm = newVal;
    // });

    $scope.$watch('$parent.wizardFloor.transition', function(newVal) {
      console.log('watch newVal: ', newVal);
      if (newVal === true) {
        $scope.form.$submitted = true;
        $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
        $scope.$parent.wizardFloor.formParts.one = $scope.form.$valid;
      }
    });

    // $scope.$parent.wizardFloor.currentForm = $scope.form;

    // $scope.$on('wizard.next', function() {
    //   $scope.$parent.wizardFloor.currentForm = $scope.form;
    // });
    console.log($scope.$parent.wizardFloor);

    // User.getStatics().then(function(res) {
    //   vm.options = res;
    // });
    //
    // User.getInfo().then(function(res) {
    //   console.log(res);
    //   vm.options = angular.extend({}, res);
    // });

    // vm.validate = function(form) {
    //   $scope.validity = angular.copy(form);
    //   $scope.$parent.wizardFloor.carInfoValid = form.$valid ? true : false;
    // };
  }

})();
