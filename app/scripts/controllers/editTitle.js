'use strict';

angular.module('nextgearWebApp')
  .controller('EditTitleCtrl', function ($scope, dialog, floorplan, Floorplan, User) {

    $scope.states = User.getStatics().states;

    $scope.getStateObjForName = function (stateName) {
      // not ideal to resolve name => ID, but the API gives us a state name in floorplan search results
      // and requires a state ID to save changes. Let's assume all states have unique names
      // (otherwise how would the user choose between them in the drop-down lists?)
      var stateObj;
      if (stateName) {
        stateObj = _.find($scope.states, function (state) {
          return state.StateName === stateName;
        });
      }
      return stateObj || null;
    };

    $scope.inputModel = {
      titleNumber: floorplan.TitleNumber,
      titleState: $scope.getStateObjForName(floorplan.TitleState)
    };

    $scope.submit = function () {
      var info = $scope.inputModel;

      $scope.validity = angular.copy($scope.form);
      if ($scope.form.$invalid) {
        return;
      }

      $scope.submitInProgress = true;
      Floorplan.setTitleInfo(floorplan.FloorplanId, info.titleNumber, info.titleState).then(
        function (/*success*/) {
          $scope.submitInProgress = false;
          // update values locally
          floorplan.TitleNumber = info.titleNumber;
          floorplan.TitleState = info.titleState.StateName;
          dialog.close();
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.close = function () {
      dialog.close();
    };

  });
