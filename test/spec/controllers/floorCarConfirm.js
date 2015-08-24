'use strict';

describe('Controller: FloorCarConfirmCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarConfirmCtrl,
    FloorAuctionCarConfirmCtrl,
    controller,
    scope,
    scopeAuction,
    catalog,
    userDealerMock,
    userAuctionMock,
    dialogMock,
    formDataMock,
    mockKissMetricInfo,
    $httpBackend,
    segmentio,
    metric,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, gettextCatalog, _$httpBackend_, _$q_, _segmentio_, _metric_) {
    controller = $controller;
    catalog = gettextCatalog;
    $httpBackend = _$httpBackend_;
    segmentio = _segmentio_;
    metric = _metric_;
    $q = _$q_;
    scope = $rootScope.$new();
    scopeAuction = $rootScope.$new();
    dialogMock = {
      close: angular.noop
    };
    formDataMock = {};
    userDealerMock = {
      isDealer: function () {
        return true;
      },
      isUnitedStates: function () {
        return true;
      }
    };
    userAuctionMock= {
      isDealer: function(){
        return false;
      },
      isUnitedStates: function(){
        return true;
      }
    };
    mockKissMetricInfo = {
      getKissMetricInfo : function() {
        return $q.when({
          height: 1080,
          isBusinessHours: true,
          vendor: 'Google Inc.',
          version: 'Chrome 44',
          width: 1920
        });
      }
    };

    $httpBackend.whenGET('/info/v1_1/businesshours').respond($q.when({}));

    FloorCarConfirmCtrl = controller('FloorCarConfirmCtrl', {
      $scope: scope,
      dialog: dialogMock,
      formData: formDataMock,
      User: userDealerMock,
      gettextCatalog: catalog,
      kissMetricInfo: mockKissMetricInfo
    });

    FloorAuctionCarConfirmCtrl = controller('FloorCarConfirmCtrl', {
      $scope: scopeAuction,
      dialog: dialogMock,
      formData: formDataMock,
      User: userAuctionMock,
      gettextCatalog: catalog,
      kissMetricInfo: mockKissMetricInfo
    });
  }));

  var createController = function () {
    FloorCarConfirmCtrl = controller('FloorCarConfirmCtrl', {
      $scope: scope,
      dialog: dialogMock,
      formData: formDataMock,
      User: userDealerMock,
      gettextCatalog: catalog,
      kissMetricInfo: mockKissMetricInfo
    });
  };

  var createAuctionController = function () {
    FloorAuctionCarConfirmCtrl = controller('FloorAuctionCarConfirmCtrl', {
      $scope: scopeAuction,
      dialog: dialogMock,
      formData: formDataMock,
      User: userAuctionMock,
      gettextCatalog: catalog,
      kissMetricInfo: mockKissMetricInfo
    });
  };

  it('should attach the form data to the scope', function () {
    expect(scope.formData).toBe(formDataMock);
  });

  it('should attach the mode to the scope', function () {
    expect(scope.isDealer).toBe(true);
  });

  it('should provide a confirm function that closes the dialog with true result', function () {
    spyOn(dialogMock, 'close');
    scope.confirm();
    expect(dialogMock.close).toHaveBeenCalledWith(true);
  });

  it('should return true when user clicks Dealer Flooring Request submitted', function(){
    spyOn(userDealerMock, 'isDealer').andReturn(true);
    spyOn(dialogMock, 'close');
    spyOn(segmentio, 'track').andCallThrough();

    scope.confirm();
    scope.$digest();

    expect(segmentio.track).toHaveBeenCalledWith(metric.DEALER_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED, {
      height: 1080,
      isBusinessHours: true,
      vendor: 'Google Inc.',
      version: 'Chrome 44',
      width: 1920
    });

    expect(scope.kissMetricData.isBusinessHours).toBe(true);
    expect(scope.kissMetricData.height).toBe(1080);
    expect(scope.kissMetricData.vendor).toBe('Google Inc.');
    expect(scope.kissMetricData.version).toBe('Chrome 44');
    expect(scope.kissMetricData.width).toBe(1920);
  });

  it('should return true when user clicks Auction Flooring Request submitted', function(){
    spyOn(userAuctionMock, 'isDealer').andReturn(false);
    spyOn(dialogMock, 'close');
    spyOn(segmentio, 'track').andCallThrough();

    scopeAuction.confirm();
    scopeAuction.$digest();

    expect(segmentio.track).toHaveBeenCalledWith(metric.AUCTION_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED_PAGE, {
      height: 1080,
      isBusinessHours: true,
      vendor: 'Google Inc.',
      version: 'Chrome 44',
      width: 1920
    });

    expect(scopeAuction.kissMetricData.isBusinessHours).toBe(true);
    expect(scopeAuction.kissMetricData.height).toBe(1080);
    expect(scopeAuction.kissMetricData.vendor).toBe('Google Inc.');
    expect(scopeAuction.kissMetricData.version).toBe('Chrome 44');
    expect(scopeAuction.kissMetricData.width).toBe(1920);
  });

  it('should provide a cancel function that closes the dialog with false result', function () {
    spyOn(dialogMock, 'close');
    scope.close();
    expect(dialogMock.close).toHaveBeenCalledWith(false);
  });

  it('should return en document by default.', function () {
    expect(scope.documentLink).not.toContain('CAE');
    expect(scope.documentLink).not.toContain('CAF');
    expect(scope.documentLink).not.toContain('ES');
  });

  it('should return es documents when language is es and country is US.', function () {
    catalog.currentLanguage = 'es';
    createController();
    expect(scope.documentLink).toContain('ES');
  });

  it('should return en documents when language is fr_CA and country is US.', function () {
    catalog.currentLanguage = 'fr_CA';
    createController();
    expect(scope.documentLink).not.toContain('CAE');
    expect(scope.documentLink).not.toContain('CAF');
    expect(scope.documentLink).not.toContain('ES');
  });

  it('should return en documents when language is es and country is Canada.', function () {
    catalog.currentLanguage = 'es';
    spyOn(userDealerMock, 'isUnitedStates').andReturn(false);
    createController();
    expect(scope.documentLink).toContain('CAE');
  });

  it('should return en documents when language is en and country is Canada.', function () {
    catalog.currentLanguage = 'en';
    spyOn(userDealerMock, 'isUnitedStates').andReturn(false);
    createController();
    expect(scope.documentLink).toContain('CAE');
  });

  it('should return fr documents when language is fr_CA and country is Canada.', function () {
    catalog.currentLanguage = 'fr_CA';
    spyOn(userDealerMock, 'isUnitedStates').andReturn(false);
    createController();
    expect(scope.documentLink).toContain('CAF');
  });
});
