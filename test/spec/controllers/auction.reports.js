'use strict';

describe('Controller: AuctionReportsCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionReportsCtrl,
    scope,
    api,
    formDataMock,
    mfgSubsidiaries,
    UserMock,
    $q,
    $httpBackend,
    mockKissMetricInfo;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, api, _$q_, _$httpBackend_) {
    scope = $rootScope.$new();
    $q = _$q_;
    $httpBackend = _$httpBackend_;
    formDataMock = {
      $valid: false,
      disDate: {
        $invalid: true
      }
    };

    UserMock = {
      getInfo: function() {
        return $q.when({
          BusinessId: "1234",
          ManufacturerSubsidiaries: []
        });
      },
      isManufacturer: function(){
        return true;
      }
    };

    mockKissMetricInfo = {
      getKissMetricInfo: function(){
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

    AuctionReportsCtrl = $controller('AuctionReportsCtrl', {
      $scope: scope,
      User: UserMock,
      kissMetricInfo : mockKissMetricInfo
    });

    scope.disForm = formDataMock;
    scope.data = {
      disDate: new Date(2014, 0, 20)
    };
  }));

  it('should attach metric names to the scope', function() {
    expect(scope.metric).toBeDefined();
  });

  it('should contain a list of documents', function() {
    expect(scope.documents).toBeDefined();
  });

  it('should return true when user clicks on Auction Reports. ', function(){

    scope.$apply();
    expect(scope.kissMetricData.isBusinessHours).toBe(true);
    expect(scope.kissMetricData.height).toBe(1080);
    expect(scope.kissMetricData.vendor).toBe('Google Inc.');
    expect(scope.kissMetricData.version).toBe('Chrome 44');
    expect(scope.kissMetricData.width).toBe(1920);
  });

  describe('viewDisbursementDetail function', function() {
    it('should check form validity and return if invalid', function() {
      spyOn(window, 'open').andReturn();

      expect(scope.data).toBeDefined();
      scope.viewDisbursementDetail();
      expect(scope.disFormValidity).toBeDefined();
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should create an api link and open the report in a new tab if the form is valid', function() {
            scope.$apply();

      spyOn(window, 'open').andReturn();
      scope.disForm.$valid = true;

      scope.viewDisbursementDetail();
      var expectedStr = '/report/disbursementdetail/v1_1/2014-01-20/1234/Disbursements-2014-01-20';
      expect(window.open).toHaveBeenCalledWith(expectedStr, '_blank');
    });

    it('should create an api link that includes the selected subsidiary\'s id and open the report in a new tab if the form is valid', function() {
      scope.selectedSubsidiary = {
        BusinessId: 'subsidiaryId',
        BusinessName: 'subsidiaryName'
      };

      spyOn(window, 'open').andReturn();
      scope.disForm.$valid = true;

      scope.viewDisbursementDetail();
      var expectedStr = '/report/disbursementdetail/v1_1/2014-01-20/subsidiaryId/Disbursements-2014-01-20-subsidiaryName';
      expect(window.open).toHaveBeenCalledWith(expectedStr, '_blank');
    });

    it('should create an api link that includes the selected subsidiary\'s id and with the subsidiary\'s business name stripped of non-alphanumeric characters', function() {
      scope.selectedSubsidiary = {
        BusinessId: 'subsidiaryId',
        BusinessName: 'Subsidiary, @$%^!@  #Num1=+'
      };

      spyOn(window, 'open').andReturn();
      scope.disForm.$valid = true;

      scope.viewDisbursementDetail();
      var expectedStr = '/report/disbursementdetail/v1_1/2014-01-20/subsidiaryId/Disbursements-2014-01-20-SubsidiaryNum1';
      expect(window.open).toHaveBeenCalledWith(expectedStr, '_blank');
    });

  });


});
