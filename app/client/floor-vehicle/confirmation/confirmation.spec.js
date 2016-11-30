'use strict';

describe('Controller ConfirmationCtrl', function () {
  beforeEach(module('nextgearWebApp'));

  var scope;
  var vm;
  var form;
  var userMock;
  var $q;
  var loggedIn;
  var stateParamsMock;
  var kissMetricsInfoMock;
  var segmentioMock;
  var stateMock;
  var controller;
  var metric;
  var userMockData;
  var kissMetricsData;
  var responseMock;

  function reloadController() {
    vm = controller('FlooringConfirmationCtrl', {
      $scope: scope,
      User: userMock,
      $stateParams: stateParamsMock,
      kissMetricInfo: kissMetricsInfoMock,
      segmentio: segmentioMock,
      $state: stateMock
    });
  }

  beforeEach(inject(function ($controller, $rootScope, $compile, _$q_, _metric_) {
    scope = $rootScope.$new();

    $q = _$q_;
    loggedIn = true;
    metric = _metric_;

    userMockData = {
      BusinessNumber: 123456,
      BusinessId: '123-123-123'
    };

    userMock = {
      getInfo: function () {
        return $q.when(userMockData);
      }
    };

    stateMock = {
      go: function () {
        return;
      }
    };

    stateParamsMock = {
      stockNumber: 41,
      floorplanId: '123-456-789'
    };

    kissMetricsData = {
      height: 1080,
      isBusinessHours: true,
      vendor: 'Google Inc.',
      version: 'Chrome 44',
      width: 1920,
    };

    kissMetricsInfoMock = {
      getKissMetricInfo: function () {
        return $q.when(kissMetricsData);
      }
    };

    segmentioMock = {
      track: angular.noop
    };

    responseMock = {
      data: {
        waybill:'labelImage',
        trackingNumber: '1234567890'
      }
    };

    spyOn(stateMock, 'go').and.callThrough();
    spyOn(userMock, 'getInfo').and.callThrough();
    spyOn(kissMetricsInfoMock, 'getKissMetricInfo').and.callThrough();
    spyOn(segmentioMock, 'track').and.callThrough();

    controller = $controller;

    reloadController();

    form = '<form name="confirmationForm" novalidate>'
         +  '<textarea id="comment" name="comment" ng-model="vm.surveyComment" required></textarea>'
         + '</form>';

    form = angular.element(form);

    $compile(form)(scope);

    scope.$digest();
  }));

  it('if state params is defined change state should not happen', function () {
    expect(stateMock.go).not.toHaveBeenCalled();
  });

  it('if state params not defined change state', function () {
    stateParamsMock = {};

    reloadController();

    expect(stateMock.go).toHaveBeenCalled();
  });

  it('User getinfo should be called', function () {
    expect(userMock.getInfo).toHaveBeenCalled();
  });

  it('Survey submit with valid confirmation form', function () {
    scope.confirmationForm.comment.$setViewValue('This is a test comment!');

    vm.submitSurvey();

    scope.$digest();

    expect(kissMetricsInfoMock.getKissMetricInfo).toHaveBeenCalled();

    var resultObj = {
      surveyComment: scope.vm.surveyComment,
      businessNumber: vm.user.BusinessNumber,
      businessId: vm.user.BusinessId,
      flooringExperience: vm.starValue
    };

    expect(segmentioMock.track).toHaveBeenCalledWith(metric.FLOORING_EXPERIENCE_RATING, angular.extend(resultObj, kissMetricsData));
    expect(vm.surveyComplete).toEqual(true);
  });

  it('Survey submit with invalid confirmation form', function () {
    vm.submitSurvey();

    expect(vm.surveyComplete).toEqual(false);
  });

});
